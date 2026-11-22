import { faker } from '@faker-js/faker'
import { argonHashing, verifyPassword } from './argon2id'
import { InvalidPasswordFormatError } from '../errors/invalid-password-format-error'

describe('Argon2', () => {
  let password: string
  let differentPassword: string
  let hashedPassword: string

  beforeEach(async () => {})

  it('should match a hashed password', async () => {
    password = faker.lorem.word()
    hashedPassword = await argonHashing(password)
    const result = await verifyPassword(hashedPassword, password)

    expect(result).toBe(true)
  })

  it('should not match a different hashed password', async () => {
    password = 'password1'
    differentPassword = 'password2'

    hashedPassword = await argonHashing(password)
    const result = await verifyPassword(hashedPassword, differentPassword)

    expect(result).toBe(false)
  })

  it('should not match a twice hashed password', async () => {
    password = faker.lorem.word()
    hashedPassword = await argonHashing(password)
    let hashedPassword2 = await argonHashing(password)
    expect(hashedPassword === hashedPassword2).toBe(false)
  })

  it('should reject with InvalidPasswordFormatError', async () => {
    password = faker.lorem.word()
    hashedPassword = 'asdsqweqewfadszzxcxvfdgw123rwe'
    await expect(verifyPassword(hashedPassword, password)).rejects.toThrow(
      InvalidPasswordFormatError,
    )
  })
})
