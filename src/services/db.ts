import mongoose from 'mongoose'

import { env } from '@/constants/env'

export const connect_db = async (): Promise<void> => {
  try {
    if (env.db_url === 'NA') {
      console.error('No database URL provided, skipping connection'.yellow)
      return
    }

    await mongoose.connect(env.db_url)
    const dbName = mongoose.connection.name
    console.log(`Database [${dbName}] connected successfully`.cyan)
  } catch (error) {
    console.error('database connection error:', error)
    throw error
  }
}

export const disconnect_db = async (): Promise<void> => {
  try {
    await mongoose.disconnect()
    console.log('Database disconnected successfully'.cyan)
  } catch (error) {
    console.error('Database disconnection error:', error)
    throw error
  }
}
