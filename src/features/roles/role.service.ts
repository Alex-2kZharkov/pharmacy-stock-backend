import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './Role.schema';
import { CreateUserDto } from './role.dto';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async getHello(): Promise<RoleDocument[]> {
    return await this.roleModel.find().exec();
  }

  async create(createDto: CreateUserDto): Promise<RoleDocument> {
    return await this.roleModel.create(createDto);
  }
}
