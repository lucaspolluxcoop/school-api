import { Controller, Get } from '@nestjs/common'
import { PermissionsService } from './permissions.service'

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly service: PermissionsService) {}

  @Get()
  async getPermissions() {
    return await this.service.getAll()
  }
}
