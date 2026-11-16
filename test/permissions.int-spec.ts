import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from '../src/app.module'
import { DATABASE_CONN } from '../src/utils/constants/database'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { permissions } from '../src/schema/public'
import { faker } from '@faker-js/faker'

describe('Permissions (Integration)', () => {
  let app: INestApplication<App>
  let db: NodePgDatabase

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    db = moduleFixture.get(DATABASE_CONN)

    await db.delete(permissions)

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('GET /permissions return an empty list', async () => {
    const response = await request(app.getHttpServer()).get('/permissions')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })

  it('GET /permissions returns created permissions', async () => {
    const permission1 = {
      id: faker.string.uuid(),
      code: 'permission1',
      description: faker.lorem.sentence(3),
    }
    const permission2 = {
      id: faker.string.uuid(),
      code: 'permission2',
      description: faker.lorem.sentence(3),
    }

    await db.insert(permissions).values([permission1, permission2])

    const response = await request(app.getHttpServer()).get('/permissions')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(2)
    expect(response.body).toContainEqual(
      expect.objectContaining({
        id: permission1.id,
        code: permission1.code,
        description: permission1.description,
      }),
    )
    expect(response.body).toContainEqual(
      expect.objectContaining({
        id: permission2.id,
        code: permission2.code,
        description: permission2.description,
      }),
    )
  })

  afterEach(async () => {
    await app.close()
  })
})
