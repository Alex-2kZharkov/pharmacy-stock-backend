import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { Role, RoleDocument } from '../roles/Role.schema';
import { UserDto } from './user.dto';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  async getAll(): Promise<UserDocument[]> {
    const password = await bcrypt.hash('test-password', 10);
    await this.userModel.updateOne(
      {
        email: 'alexander.06.zharkov@gmail.com',
      },
      { password },
    );

    return await this.userModel.find().populate('role').exec();
  }

  async getOne(id: string): Promise<UserDocument> {
    if (id !== 'undefined') {
      return await this.userModel.findById(id).exec();
    }
  }

  async create(userDto: UserDto): Promise<UserDocument> {
    const role = await this.roleModel.findOne({ name: userDto.role });
    return await this.userModel.create({
      ...userDto,
      _id: undefined,
      role: role._id as mongoose.ObjectId,
    });
  }

  async update(id: string, userDto: UserDto): Promise<void> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const role = await this.roleModel.findOne({ name: userDto.role });

    await this.userModel.updateOne({ _id: id }, { ...userDto, role }).exec();
  }

  async delete(id: string): Promise<void> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    await user.delete();
  }

  async findOne(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email }).exec();
  }
}
