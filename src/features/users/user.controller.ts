import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDocument } from './user.schema';
import { UserDto } from './user.dto';
import { JwtAuthGuard } from '../auth-module/jwt-auth.guard';

@Controller('/api/users')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(): Promise<UserDocument[]> {
    return this.appService.getAll();
  }

  @Post()
  create(@Body() userDto: UserDto): Promise<UserDocument> {
    return this.appService.create(userDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() userDto: UserDto): Promise<void> {
    return this.appService.update(id, userDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.appService.delete(id);
  }
}
