import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

type TEnv = {
  port: number
  db_url: string | 'NA'
  node_env: 'prod' | 'dev' | 'test'
  logtail_token: string | 'NA'
  app_name_slug: string | 'NA'
  openai_api_key: string | 'NA'
  twilio_account_sid: string | 'NA'
  twilio_auth_token: string | 'NA'
  twilio_phone_number: string | 'NA'
  PERSONAL_PHONE_NUMBER: string | 'NA'
}

export const env: TEnv = {
  port: parseInt(process.env.PORT || '8000'),
  db_url: process.env.DB_URL || 'NA',
  node_env: (process.env.NODE_ENV as TEnv['node_env']) || 'NA',
  logtail_token: process.env.LOGTAIL_TOKEN || 'NA',
  app_name_slug: process.env.APP_NAME_SLUG || 'NA',
  openai_api_key: process.env.OPENAI_API_KEY || 'NA',
  twilio_account_sid: process.env.TWILIO_ACCOUNT_SID || 'NA',
  twilio_auth_token: process.env.TWILIO_AUTH_TOKEN || 'NA',
  twilio_phone_number: process.env.TWILIO_PHONE_NUMBER || 'NA',
  PERSONAL_PHONE_NUMBER: process.env.PERSONAL_PHONE_NUMBER || 'NA'
}
