import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDocument } from './user.schema';
import { CreateUserDto } from './user.dto';

@Controller('/api/users')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get()
  getAll(): Promise<UserDocument[]> {
    return this.appService.getAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.appService.create(createUserDto);
  }
}
