import { Test, TestingModule } from '@nestjs/testing'
import { PermissionsService } from './permissions.service'
import { PermissionsRepository } from './permissions.repository'
import { faker } from '@faker-js/faker'

describe('PermissionsService', () => {
  let service: PermissionsService
  const results = [
    {
      id: faker.string.uuid(),
      code: faker.lorem.words(1),
      description: faker.lorem.sentence(6),
    },
    {
      id: faker.string.uuid(),
      code: faker.lorem.words(1),
      description: faker.lorem.sentence(6),
    },
  ]

  const fakePermissionRepository = {
    getAll: jest.fn().mockResolvedValue(results),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: PermissionsRepository,
          useValue: fakePermissionRepository,
        },
      ],
    }).compile()

    service = module.get<PermissionsService>(PermissionsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return all permissions registered', async () => {
    const permissions = await service.getAll()
    expect(permissions).toEqual(results)
    expect(fakePermissionRepository.getAll).toHaveBeenCalledTimes(1)
  })
})
