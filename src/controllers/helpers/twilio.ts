// helpers/twilio.js - Twilio helper functions
import twilio from 'twilio'

import { env } from '@/constants/env'

// Initialize Twilio client with credentials
const client = twilio(env.twilio_account_sid, env.twilio_auth_token)

/**
 * Make an outbound call
 * @param {string} to - Recipient phone number
 * @param {string} from - Sender phone number (Twilio number)
 * @param {string} url - URL for TwiML instructions
 * @returns {Promise} - Call information
 */
const makeCall = async (
  to: string,
  from = env.twilio_phone_number,
  url: string
) => {
  try {
    const call = await client.calls.create({
      to,
      from,
      url,
      method: 'POST'
    })

    console.log(`Call initiated to ${to}, SID: ${call.sid}`)
    return call
  } catch (error) {
    console.error('Error making outbound call:', error)
    throw new Error('Failed to make outbound call')
  }
}

/**
 * Send SMS message
 * @param {string} to - Recipient phone number
 * @param {string} body - Message content
 * @param {string} from - Sender phone number (Twilio number)
 * @returns {Promise} - Message information
 */
const sendSMS = async (
  to: string,
  body: string,
  from = env.twilio_phone_number
) => {
  try {
    const message = await client.messages.create({
      to,
      from,
      body
    })

    console.log(`SMS sent to ${to}, SID: ${message.sid}`)
    return message
  } catch (error) {
    console.error('Error sending SMS:', error)
    throw new Error('Failed to send SMS')
  }
}

/**
 * Generate TwiML for a response
 * @param {object} options - Configuration options
 * @returns {string} - TwiML string
 */
const generateTwiML = (options: any) => {
  const VoiceResponse = twilio.twiml.VoiceResponse
  const twiml = new VoiceResponse()

  if (options.say) {
    twiml.say(options.say)
  }

  if (options.play) {
    twiml.play(options.play)
  }

  if (options.gather) {
    const gather = twiml.gather(options.gather.options || {})
    if (options.gather.say) {
      gather.say(options.gather.say)
    }
    if (options.gather.play) {
      gather.play(options.gather.play)
    }
  }

  if (options.dial) {
    twiml.dial(options.dial.options || {}, options.dial.number)
  }

  if (options.redirect) {
    twiml.redirect(options.redirect)
  }

  if (options.hangup) {
    twiml.hangup()
  }

  return twiml.toString()
}

export { client, generateTwiML, makeCall, sendSMS }
