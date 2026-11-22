import { argon2 as _argon2, randomBytes, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
import { InvalidPasswordFormatError } from '../errors/invalid-password-format-error'

const argon2 = promisify(_argon2)

const initialParams = {
  parallelism: 1,
  tagLength: 32,
  memory: 19456,
  passes: 2,
}

export const argonHashing = async (password: string) => {
  const params = {
    ...initialParams,
    message: password,
    nonce: randomBytes(16),
  }

  const hash = (await argon2('argon2id', params)) as Buffer

  return params.nonce.toString('hex') + '.' + hash.toString('hex')
}

export const verifyPassword = async (
  hashedPassword: string,
  password: string,
) => {
  const storedFormat = /^[0-9a-f]{32}\.[0-9a-f]{64}$/

  if (!storedFormat.test(hashedPassword)) {
    throw new InvalidPasswordFormatError()
  }
  const [stringNonce, pass] = hashedPassword.split('.')
  const registeredPassword = Buffer.from(pass, 'hex')
  const nonce = Buffer.from(stringNonce, 'hex')

  const params = {
    ...initialParams,
    message: password,
    nonce,
  }

  const hash = (await argon2('argon2id', params)) as Buffer

  return timingSafeEqual(hash, registeredPassword)
}
