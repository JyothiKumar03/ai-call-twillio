import colors from 'colors'

import { env } from '@/constants/env'

import { connect_db, disconnect_db } from '@/services/db'

import app from './app'

colors.enable()

const start_server = async () => {
  try {
    await connect_db()

    app.listen(env.port, () => {
      if (env.node_env === 'dev') {
        console.log(`Server is live on: http://localhost:${env.port}`.magenta)
      } else {
        console.log(`Server is live on PORT: ${env.port}`.magenta)
      }
    })
  } catch (error) {
    console.error('Failed to start server...\n'.red, error)
    process.exit(1)
  }
}

const graceful_shutdown = async () => {
  try {
    console.log('Shutting down gracefully...\n'.yellow)
    await disconnect_db()
    process.exit(0)
  } catch (error) {
    console.error('Error during shutdown...\n'.red, error)
    process.exit(1)
  }
}

const handle_fatal_error = (error: Error, type: 'rejection' | 'exception') => {
  console.error(`Shutting down due to unhandled ${type}...\n`.red, error)
  graceful_shutdown()
}

start_server()

process.on('SIGTERM', graceful_shutdown)
process.on('SIGINT', graceful_shutdown)

process.on('unhandledRejection', (error: Error) => {
  handle_fatal_error(error, 'rejection')
})

process.on('uncaughtException', (error: Error) => {
  handle_fatal_error(error, 'exception')
})
