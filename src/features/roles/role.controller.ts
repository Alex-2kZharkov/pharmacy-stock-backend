import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDocument } from './Role.schema';
import { CreateUserDto } from './role.dto';

@Controller('/api/roles')
export class RoleController {
  constructor(private readonly appService: RoleService) {}

  @Get()
  getHello(): Promise<RoleDocument[]> {
    return this.appService.getHello();
  }

  @Post()
  create(@Body() createDto: CreateUserDto): Promise<RoleDocument> {
    return this.appService.create(createDto);
  }
}
