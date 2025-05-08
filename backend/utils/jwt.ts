import jwt from 'jsonwebtoken'

export interface AuthClaim {
  id: string
  email: string
  name: string
  role: string
}

function getRefreshTokenExpiry() {
  const jwtExpiryTime = process.env.JWT_EXPIRATION
  if (!jwtExpiryTime) {
    return process.env.JWT_EXPIRATION
  }
  const match = jwtExpiryTime.match(/(\d+)([a-zA-Z])/)

  if (match) {
    const digits = parseInt(match[1])
    const char = match[2]

    if (isNaN(digits)) return process.env.JWT_EXPIRATION

    return `${2 * digits}${char}`
  }

  return jwtExpiryTime
}

export function generateToken(payload: AuthClaim, refreshToken = false): string {
  const secret = refreshToken ? process.env.JWT_REFRESH_TOKEN_SECRET : process.env.JWT_SECRET
  const expiresIn = refreshToken ? getRefreshTokenExpiry() : process.env.JWT_EXPIRATION
  
  if (!secret || !expiresIn) {
    return "";
  }
  
  const tokenOptions: jwt.SignOptions = { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] };

  const accessToken = jwt.sign(payload, secret, tokenOptions)

  return accessToken
}

export function verifyToken(token: string, refreshToken = false): AuthClaim {

  const secret = refreshToken ? process.env.JWT_REFRESH_TOKEN_SECRET : process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT secret is not defined");
  }
  
  const decoded = jwt.verify(token?.toString(), secret) as AuthClaim
  return decoded
}
