type WithFingerprint = {
    ip: string
    country: string
    device: string
}

export interface IAuthToken {
    userId: string,
}

export interface ISession  {
    fingerprint?: WithFingerprint
    passport?: {
      userId: string
    }
}