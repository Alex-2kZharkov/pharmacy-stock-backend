import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { Role, RoleDocument } from '../roles/Role.schema';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  async getAll(): Promise<UserDocument[]> {
    return await this.userModel
      .find()
      .populate('role', 'name description', Role.name)
      .exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const role = await this.roleModel.findOne({ name: createUserDto.role });
    return await this.userModel.create({ ...createUserDto, role });
  }
}
