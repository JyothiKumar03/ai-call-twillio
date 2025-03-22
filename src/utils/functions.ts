import { Request } from 'express'

type TDeviceInfo = {
  browser: string
  os: string
  device_type: string
  user_agent: string
}

export const extract_user_agent_info = (req: Request): TDeviceInfo => {
  const user_agent = req.headers['user-agent'] || 'unknown'
  const is_mobile = /mobile/i.test(user_agent)
  const is_tablet = /tablet|ipad/i.test(user_agent)
  const device_type = is_mobile ? 'mobile' : is_tablet ? 'tablet' : 'desktop'

  const browser_info =
    user_agent.match(
      /(chrome|safari|firefox|msie|trident|edge|opera)\/?\s*(\d+)/i
    ) || []
  const browser = browser_info[1] || 'unknown'
  const browser_version = browser_info[2] || ''

  // Extract OS info
  const os_info =
    user_agent.match(
      /(mac|windows|linux|android|ios|iphone|ipad)(?:\s+\w+\s+(\d+[\d._]*)|[\s;]+(\d+[\d._]*))?/i
    ) || []
  const os = os_info[1] || 'unknown'
  const os_version = os_info[2] || os_info[3] || ''

  return {
    browser: `${browser} ${browser_version}`.trim(),
    os: `${os} ${os_version}`.trim(),
    device_type: device_type,
    user_agent: user_agent
  }
}
