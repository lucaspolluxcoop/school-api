import { Controller, Get } from '@nestjs/common';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService : PermissionsService) {}

  @Get()
  async getPermissions() {
    const permissions = await this.permissionsService.getAll()

    return permissions
  }
}
