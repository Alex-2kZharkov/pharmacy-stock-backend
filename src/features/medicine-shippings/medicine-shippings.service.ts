import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicineShippingDto } from './dto/create-medicine-shipping.dto';
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
import { MedicineSaleDocument } from '../medicine-sales/entities/medicine-sales.schema';

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

  async findAll(dateFrom: Date | null): Promise<MedicineSaleDocument[]> {
    const options = dateFrom
      ? {
          createdAt: {
            $gte: dateFrom,
          },
        }
      : undefined;

    return await this.medicineShippingModel
      .find(options)
      .sort({ createdAt: -1 })
      .populate('medicine')
      .exec();
  }
}
