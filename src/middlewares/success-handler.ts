import { NextFunction, Request, Response } from 'express'

import { log } from '../services/log'
import { extract_user_agent_info } from '../utils/functions'

const success_handler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const original_json = res.json

  res.json = function (json: any): Response {
    if (Number(res.statusCode) < 400) {
      const device_info = extract_user_agent_info(req)

      log.info('Successful request', {
        req: {
          path: req.path,
          method: req.method,
          query: req.query,
          body: req.body,
          ip: req.ip,
          user_id: 'NA'
        },
        res: {
          status: res.statusCode,
          json
        },
        device_info
      })
    }

    return original_json.call(this, json)
  }

  next()
}

export default success_handler
