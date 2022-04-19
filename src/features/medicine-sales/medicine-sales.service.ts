import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicineSaleDto } from './dto/create-medicine-sale.dto';
import { UpdateMedicineSaleDto } from './dto/update-medicine-sale.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Medicine,
  MedicineDocument,
} from '../medicines/entities/medicine.schema';
import { MedicineSale, MedicineSaleDocument } from './entities/medicine.schema';
import { convertToNumber } from '../../utils/conversion.utils';
import * as mongoose from 'mongoose';

@Injectable()
export class MedicineSalesService {
  constructor(
    @InjectModel(Medicine.name) private medicineModel: Model<MedicineDocument>,
    @InjectModel(MedicineSale.name)
    private medicineSaleModel: Model<MedicineSaleDocument>,
  ) {}

  async create({
    medicineName,
    quantity,
  }: CreateMedicineSaleDto): Promise<string> {
    const medicine: Medicine = await this.medicineModel
      .findOne({
        name: medicineName,
      })
      .lean();

    if (!medicine) {
      throw new NotFoundException('Товар не найден');
    }

    const amountPerUnit = convertToNumber(
      medicine.finalAmount / medicine.quantity,
    );
    console.log(
      medicine,
      amountPerUnit,
      quantity,
      medicine.finalAmount,
      medicineName,
    );
    const medicineSale = await this.medicineSaleModel.create({
      medicine,
      quantity,
      amountPerUnit,
      totalAmount: convertToNumber(quantity * amountPerUnit),
    });
    // await medicineSale.save();
    return 'This action adds a new medicineSale';
  }

  findAll() {
    return `This action returns all medicineSales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} medicineSale`;
  }

  update(id: number, updateMedicineSaleDto: UpdateMedicineSaleDto) {
    return `This action updates a #${id} medicineSale`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicineSale`;
  }
}
