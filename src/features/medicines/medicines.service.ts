import { Injectable } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine, MedicineDocument } from './entities/medicine.schema';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectModel(Medicine.name) private medicineModel: Model<MedicineDocument>,
  ) {}
  create(createMedicineDto: CreateMedicineDto) {
    return 'This action adds a new medicine';
  }

  async findAll(): Promise<MedicineDocument[]> {
    return await this.medicineModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} medicine`;
  }

  update(id: number, updateMedicineDto: UpdateMedicineDto) {
    return `This action updates a #${id} medicine`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicine`;
  }
}
