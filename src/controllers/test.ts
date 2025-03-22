import fs from 'fs'
import OpenAI from 'openai'
import path from 'path'

import { env } from '@/constants/env'

const openai = new OpenAI({
  apiKey: env.openai_api_key
})

const AUDIO_DIR = path.join(__dirname, '..', '..', 'audio')
const instructions =
  'Voice Affect: Calm, composed, and reassuring; project quiet authority and confidence.\n\nTone: Sincere, empathetic, and gently authoritative—express genuine apology while conveying competence.\n\nPacing: Steady and moderate; unhurried enough to communicate care, yet efficient enough to demonstrate professionalism.\n\nEmotion: Genuine empathy and understanding; speak with warmth, especially during apologies ("I\'m very sorry for any disruption...").\n\nPronunciation: Clear and precise, emphasizing key reassurances ("smoothly," "quickly," "promptly") to reinforce confidence.\n\nPauses: Brief pauses after offering assistance or requesting details, highlighting willingness to listen and support.'

const user_input = async (input: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          "You are a helpful assistant that can answer questions and help with tasks. your response will be shown to a sales agent, so try to give short and concise answers. just answer the question, don't add any other text."
      },
      { role: 'user', content: input }
    ]
  })

  return response.choices[0].message.content
}

const voice_response = async (input: string) => {
  const response = await openai.audio.speech.create({
    model: 'gpt-4o-mini-tts',
    voice: 'coral',
    input,
    instructions
  })

  console.log('Response received:', response)

  // Convert to buffer and save to file
  const buffer = Buffer.from(await response.arrayBuffer())
  const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  fs.writeFileSync(
    path.join(AUDIO_DIR, `speech-${time.replace(/[/\s:,]/g, '-')}-audio.mp3`),
    buffer
  )
  console.log('Audio saved to output.mp3')

  return response
}

user_input('who are u?')
  .then((res) => {
    console.log(res)
    if (res) {
      voice_response(res.toString())
        .then(() => {
          console.log('Test completed successfully')
        })
        .catch((err) => {
          console.log('ERROR IN VOICE RESPONSE')
          console.log(err)
        })
    }
  })
  .catch((err) => {
    console.log('ERROR IN USER INPUT')
    console.log(err)
  })
