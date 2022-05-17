import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtTokenService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = (await this.usersService.findOne(email)) as User;
    const compareResult = await bcrypt.compare(password, user?.password ?? '');

    if (user && compareResult) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async loginWithCredentials(user: User) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const payload = { email: user.email, sub: user?._id };
    const { password, ...cleanedUser } = user;
    return {
      access_token: this.jwtTokenService.sign(payload),
      user,
    };
  }
}
