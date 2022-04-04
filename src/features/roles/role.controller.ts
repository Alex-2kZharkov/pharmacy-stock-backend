import { Controller, Get } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDocument } from './Role.schema';

@Controller('/api/roles')
export class RoleController {
  constructor(private readonly appService: RoleService) {}

  @Get()
  getHello(): Promise<RoleDocument[]> {
    return this.appService.getHello();
  }
}
