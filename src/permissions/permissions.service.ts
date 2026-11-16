import { Injectable } from '@nestjs/common'
import { PermissionsRepository } from './permissions.repository'

@Injectable()
export class PermissionsService {
  constructor(private readonly repository: PermissionsRepository) {}

  async getAll() {
    return await this.repository.getAll()
  }
}
