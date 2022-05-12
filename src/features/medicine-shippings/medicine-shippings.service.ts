import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicineShippingDto } from './dto/create-medicine-shipping.dto';
import { UpdateMedicineShippingDto } from './dto/update-medicine-shipping.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Medicine,
  MedicineDocument,
} from '../medicines/entities/medicine.schema';
import { Model } from 'mongoose';
import {
  MedicineShipping,
  MedicineShippingDocument,
} from './entities/medicine-shipping.schema';
import { Budget, BudgetDocument } from '../../database/budget.schema';
import { BudgetEnum } from '../../types/budget.types';

@Injectable()
export class MedicineShippingsService {
  constructor(
    @InjectModel(Medicine.name) private medicineModel: Model<MedicineDocument>,
    @InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>,
    @InjectModel(MedicineShipping.name)
    private medicineShippingModel: Model<MedicineShippingDocument>,
  ) {}

  async create({
    _id,
    buyingQuantity,
    expirationDate,
    totalAmount,
  }: CreateMedicineShippingDto) {
    const medicine: Medicine = await this.medicineModel.findById(_id).lean();

    if (!medicine) {
      throw new NotFoundException('Товар не найден');
    }

    await this.medicineModel
      .updateOne({ _id }, { quantity: medicine.quantity + buyingQuantity })
      .exec();

    const budget = await this.budgetModel
      .findOne({ name: BudgetEnum.PROFIT })
      .lean();

    await this.budgetModel.updateOne(
      { name: BudgetEnum.PROFIT },
      { amount: (budget as Budget).amount - totalAmount },
    );

    const medicineSale = await this.medicineShippingModel.create({
      medicine,
      quantity: buyingQuantity,
      expirationDate,
      totalAmount,
    });
    await medicineSale.save();

    return 'This action adds a new medicineShipping';
  }

  findAll() {
    return `This action returns all medicineShippings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} medicineShipping`;
  }

  update(id: number, updateMedicineShippingDto: UpdateMedicineShippingDto) {
    return `This action updates a #${id} medicineShipping`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicineShipping`;
  }
}
