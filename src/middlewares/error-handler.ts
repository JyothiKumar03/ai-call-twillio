import { NextFunction, Request, Response } from 'express'

import { ZodError } from 'zod'

import { TErrorResponse } from '@/types/common'

import { env } from '@/constants/env'

import CustomError from '@/utils/CustomError'
import { extract_user_agent_info } from '@/utils/functions'

import { log } from '@/services/log'

const error_handler = (
  err: Error | ZodError | CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let custom_error: TErrorResponse = err as TErrorResponse

  if (err instanceof ZodError) {
    custom_error = { ...handle_zod_error(err), stack: err.stack }
  }

  send_error_as_response(custom_error, req, res)
}

const handle_zod_error = (err: ZodError): TErrorResponse => {
  const invalid_fields = err.errors.map((error) => error.path.join('.'))
  return {
    message: 'Invalid input. Please check your entries and try again.',
    status_code: 400,
    validation_error: {
      fields: invalid_fields,
      details: err.errors.map((error) => ({
        field: error.path.join('.'),
        message: error.message,
        code: error.code
      }))
    }
  }
}

const send_error_as_response = (
  err: TErrorResponse,
  req: Request,
  res: Response
): void => {
  const error_response: TErrorResponse = {
    message: err.message || 'Unknown error occurred',
    status_code: err.status_code || 500,
    stack: env.node_env === 'prod' ? undefined : err.stack,
    validation_error: env.node_env === 'prod' ? undefined : err.validation_error
  }

  const device_info = extract_user_agent_info(req)

  log.error(error_response.message, {
    req: {
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body,
      ip:
        req.ip ||
        req.socket.remoteAddress ||
        (Array.isArray(req.headers['x-forwarded-for'])
          ? req.headers['x-forwarded-for'][0]
          : req.headers['x-forwarded-for']) ||
        'unknown',
      user_id: 'NA'
    },
    res: {
      status: error_response.status_code,
      json: {
        message: error_response.message,
        validation_error: error_response.validation_error
      }
    },
    stack: error_response.stack,
    device_info
  })

  res.status(error_response.status_code).json(error_response)
}

export default error_handler
