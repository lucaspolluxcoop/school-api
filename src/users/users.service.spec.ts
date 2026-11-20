import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { SelectUser } from '../schema/public'
import { UsersRepository } from './users.repository'

describe('UsersService', () => {
  let service: UsersService
  const fakeUserRepository = {
    getUserByEmail: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: fakeUserRepository,
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
