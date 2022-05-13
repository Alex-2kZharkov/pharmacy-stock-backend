import { Injectable } from '@nestjs/common';
import { CreateMedicineSaleDto } from './dto/create-medicine-sale.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Medicine,
  MedicineDocument,
} from '../medicines/entities/medicine.schema';
import {
  MedicineSale,
  MedicineSaleDocument,
} from './entities/medicine-sales.schema';
import { Budget, BudgetDocument } from '../../database/budget.schema';
import {
  MedicineShipping,
  MedicineShippingDocument,
} from '../medicine-shippings/entities/medicine-shipping.schema';
import { BudgetEnum } from '../../types/budget.types';

@Injectable()
export class MedicineSalesService {
  constructor(
    @InjectModel(Medicine.name) private medicineModel: Model<MedicineDocument>,
    @InjectModel(MedicineSale.name)
    private medicineSaleModel: Model<MedicineSaleDocument>,
    @InjectModel(MedicineShipping.name)
    private medicineShippingModel: Model<MedicineShippingDocument>,
    @InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>,
  ) {}

  async create({
    medicineId,
    purchaseId,
    sellQuantity,
    totalAmount,
  }: CreateMedicineSaleDto): Promise<string> {
    const medicine: Medicine = await this.medicineModel
      .findById(medicineId)
      .lean();
    const shipping: Medicine = await this.medicineShippingModel
      .findById(purchaseId)
      .lean();
    const budget = await this.budgetModel
      .findOne({ name: BudgetEnum.PROFIT })
      .lean();

    const medicineSale = await this.medicineSaleModel.create({
      medicine,
      quantity: sellQuantity,
      amountPerUnit: medicine.finalAmount,
      totalAmount,
    });
    await medicineSale.save();

    await this.medicineShippingModel.updateOne(
      { _id: purchaseId },
      { quantity: shipping.quantity - sellQuantity },
    );

    await this.medicineModel.updateOne(
      { _id: medicineId },
      { quantity: medicine.quantity - sellQuantity },
    );

    await this.budgetModel.updateOne(
      { name: BudgetEnum.PROFIT },
      { amount: (budget as Budget).amount + totalAmount },
    );

    return 'This action adds a new medicineSale';
  }

  async findAll(dateFrom: Date | null): Promise<MedicineSaleDocument[]> {
    const options = dateFrom
      ? {
          createdAt: {
            $gte: dateFrom,
          },
        }
      : undefined;

    return await this.medicineSaleModel
      .find(options)
      .sort({ createdAt: -1 })
      .populate('medicine')
      .exec();
  }
}
