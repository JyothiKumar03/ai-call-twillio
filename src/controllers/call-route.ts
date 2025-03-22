import { Request, Response } from 'express'

import {
  generateSpeech,
  processVoiceInput
} from '@/controllers/helpers/openai-ai'
import { generateTwiML } from '@/controllers/helpers/twilio'

export const handleIncomingCall = async (req: Request, res: Response) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`

    const welcomeText =
      'Hello, this is your AI assistant. How can I help you today?'
    const welcomeAudio = await generateSpeech(welcomeText, baseUrl)
    console.log(welcomeAudio)

    const generatedTwiml = generateTwiML({
      play: welcomeAudio.url,
      gather: {
        options: {
          input: 'speech',
          speechTimeout: 'auto',
          action: '/api/twilio/response',
          method: 'POST',
          speechModel: 'phone_call'
        }
      },
      say: "I didn't receive any input. Goodbye!",
      hangup: true
    })

    res.type('text/xml')
    res.send(generatedTwiml.toString())
  } catch (error) {
    console.error('Error handling incoming call:', error)
    res.status(500).send('Internal Server Error')
  }

  // Log incoming call
}

/**
 * Process caller's speech and respond
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const handleCallResponse = async (req: Request, res: Response) => {
  try {
    // Get base URL for audio files
    const baseUrl = `${req.protocol}://${req.get('host')}`

    // Get speech input from caller
    const userSpeech = req.body.SpeechResult
    console.log(`Caller said: "${userSpeech}"`)

    // If no speech detected, ask again
    if (!userSpeech) {
      const noSpeechTwiml = generateTwiML({
        say: "I couldn't understand what you said. Please try again.",
        redirect: '/api/twilio/incoming'
      })

      res.type('text/xml')
      return res.send(noSpeechTwiml)
    }

    // Check if caller wants to talk to a human
    if (
      userSpeech.toLowerCase().includes('human') ||
      userSpeech.toLowerCase().includes('person') ||
      userSpeech.toLowerCase().includes('agent')
    ) {
      // Generate transfer message
      const transferText =
        'Transferring you to a human representative. Please hold while I connect you.'
      const transferAudio = await generateSpeech(transferText, baseUrl)

      // Generate TwiML for transfer
      const transferTwiml = generateTwiML({
        play: transferAudio.url,
        dial: {
          options: {
            callerId: process.env.TWILIO_PHONE_NUMBER,
            timeout: 20
          },
          number: process.env.PERSONAL_PHONE_NUMBER
        }
      })

      res.type('text/xml')
      return res.send(transferTwiml)
    }

    // Process with OpenAI
    const response = await processVoiceInput(userSpeech, baseUrl)
    console.log(`AI response: "${response.text}"`)

    // Generate follow-up text
    // const followUpText = 'Do you need any other assistance today?'
    // const followUpAudio = await generateSpeech(followUpText, baseUrl)

    // Generate TwiML
    const twiml = generateTwiML({
      play: response.audio.url,
      gather: {
        options: {
          input: 'speech',
          speechTimeout: 'auto',
          action: '/api/twilio/response',
          method: 'POST',
          speechModel: 'phone_call'
        }
      },
      say: response,
      hangup: true
    })

    res.type('text/xml')
    res.send(twiml)
  } catch (error) {
    console.error('Error handling call response:', error)

    // Send error response
    const errorTwiml = generateTwiML({
      say: 'Sorry, there was an error processing your request. Please try again later.',
      hangup: true
    })

    res.type('text/xml')
    res.send(errorTwiml)
  }
}
