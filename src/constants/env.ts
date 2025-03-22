import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

type TEnv = {
  port: number
  db_url: string | 'NA'
  node_env: 'prod' | 'dev' | 'test'
  logtail_token: string | 'NA'
  app_name_slug: string | 'NA'
}

export const env: TEnv = {
  port: parseInt(process.env.PORT || '8000'),
  db_url: process.env.DB_URL || 'NA',
  node_env: (process.env.NODE_ENV as TEnv['node_env']) || 'NA',
  logtail_token: process.env.LOGTAIL_TOKEN || 'NA',
  app_name_slug: process.env.APP_NAME_SLUG || 'NA'
}
