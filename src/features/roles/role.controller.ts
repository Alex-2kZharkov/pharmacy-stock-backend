import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDocument } from './Role.schema';
import { CreateUserDto } from './role.dto';
import { JwtAuthGuard } from '../auth-module/jwt-auth.guard';

@Controller('/api/roles')
export class RoleController {
  constructor(private readonly appService: RoleService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(): Promise<RoleDocument[]> {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDto: CreateUserDto): Promise<RoleDocument> {
    return this.appService.create(createDto);
  }
}
