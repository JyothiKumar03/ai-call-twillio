// helpers/openai.js - OpenAI integration helper
import fs from 'fs'
import OpenAI from 'openai'
import path from 'path'

import { OPENAI_MODELS, OPENIAI_VOICE_INSTRUCTIONS } from '@/constants/common'

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Directory for temporary audio files
const AUDIO_DIR = path.join(__dirname, '..', '..', '..', 'audio')

/**
 * Process text input with OpenAI and get a response
 * @param {string} userInput - User's message or question
 * @returns {Promise<string>} - AI-generated text response
 */
const generateTextResponse = async (userInput: string) => {
  try {
    // Define system message for the AI assistant
    const systemMessage = OPENIAI_VOICE_INSTRUCTIONS

    const response = await openai.chat.completions.create({
      model: OPENAI_MODELS.GPT_4O_MINI, // Use the appropriate model based on your needs
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userInput }
      ],
      max_tokens: 150, // Keep responses concise for voice
      temperature: 0.7 // Moderate creativity
    })

    return response.choices[0].message.content?.trim() || ''
  } catch (error) {
    console.error('Error generating text response:', error)
    throw new Error('Failed to generate text response')
  }
}

/**
 * Convert text to speech using OpenAI TTS
 * @param {string} text - Text to convert to speech
 * @returns {Promise<{filename: string, filepath: string, url: string}>} - Audio file information
 */
const generateSpeech = async (text: string, baseUrl = '') => {
  try {
    // Instructions for voice characteristics
    const instructions = OPENIAI_VOICE_INSTRUCTIONS

    const mp3 = await openai.audio.speech.create({
      model: OPENAI_MODELS.GPT_4O_MINI_TTS, // Using the latest TTS model
      voice: 'coral', // Using the coral voice
      input: text,
      instructions: instructions
    })

    // Convert to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer())

    // Create unique filename
    const time = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata'
    })
    const filename = `speech-${time.replace(/[/\s:,]/g, '-')}-audio.mp3`
    const filepath = path.join(AUDIO_DIR, filename)

    // Save to file
    fs.writeFileSync(filepath, buffer)

    // Generate URL for the audio file
    const url = `${baseUrl}/audio/${filename}`

    // Schedule cleanup after 5 minutes
    // setTimeout(
    //   () => {
    //     try {
    //       if (fs.existsSync(filepath)) {
    //         fs.unlinkSync(filepath)
    //         console.log(`Cleaned up temporary audio file: ${filepath}`)
    //       }
    //     } catch (err) {
    //       console.error(`Error cleaning up temporary audio file: ${err}`)
    //     }
    //   },
    //   5 * 60 * 1000
    // )

    return {
      filename,
      filepath,
      url
    }
  } catch (error) {
    console.error('Error generating speech:', error)
    throw new Error('Failed to generate speech')
  }
}

/**
 * Process voice input and generate speech response
 * @param {string} userInput - User's voice input as text
 * @param {string} baseUrl - Base URL for audio file access
 * @returns {Promise<{text: string, audio: {filename: string, filepath: string, url: string}}>}
 */
const processVoiceInput = async (userInput: string, baseUrl = '') => {
  // Generate text response
  const textResponse = await generateTextResponse(userInput)

  // Convert to speech
  const audio = await generateSpeech(textResponse, baseUrl)

  return {
    text: textResponse,
    audio
  }
}

export { generateSpeech, generateTextResponse, processVoiceInput }
