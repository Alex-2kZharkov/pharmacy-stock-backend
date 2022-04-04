import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDocument } from './user.schema';

@Controller('/api/users')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get()
  getHello(): Promise<UserDocument[]> {
    return this.appService.getAll();
  }
}
