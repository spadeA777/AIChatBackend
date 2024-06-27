import { type Request } from 'express'
import { type Handshake } from 'socket.io/dist/socket'

import { first } from '@/helpers/lists'

type IRequestOrHandshake = Request | Handshake

const DEFAULT_REQUESTING_IP = '1.1.1.1'

const ALLOWLIST_REQUESTING_IP = '127.0.0.1'

export const getIpFromRequest = async (
  req: IRequestOrHandshake,
  defaultIp: string = DEFAULT_REQUESTING_IP
): Promise<string> => {
  // Only use the allowed ip (Canada) if the country the staff user is in is blocked
  if (isRequestingUserAllowed(req)) {
    return ALLOWLIST_REQUESTING_IP
  }

  return getRawIpFromRequest(req, defaultIp)
}

export const getRawIpFromRequest = (
  req: IRequestOrHandshake,
  defaultIp: string = DEFAULT_REQUESTING_IP
): string => {
  return first(req.headers['cf-connecting-ip']) ?? defaultIp
}

export const isRequestingUserAllowed = (req: IRequestOrHandshake): boolean => {
  const ip = getRawIpFromRequest(req)

  // @ts-expect-error user not on Handshake
  const { user } = req

  return true
}
