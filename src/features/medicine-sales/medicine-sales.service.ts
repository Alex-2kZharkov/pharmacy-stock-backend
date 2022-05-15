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
import * as mongoose from 'mongoose';
import { sortBy } from 'lodash';
import { format, subDays } from 'date-fns';

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

  async findAll(dateFrom: Date | null, name): Promise<MedicineSaleDocument[]> {
    const regex = new RegExp(name, 'i'); // i for case insensitive
    const options = dateFrom
      ? {
          createdAt: {
            $gte: dateFrom,
          },
        }
      : undefined;

    const results = await this.medicineSaleModel
      .find(options)
      .sort({ createdAt: -1 })
      .populate('medicine')
      .exec();

    return results.filter((value: MedicineSaleDocument) => {
      if (name) {
        return (value as MedicineSale).medicine.name.match(regex);
      }
      return value;
    });
  }
  async getDemandById(id, dateFrom: Date | null): Promise<any> {
    const res = await this.medicineSaleModel.aggregate([
      {
        $match: {
          createdAt: { $gte: dateFrom ?? subDays(new Date(), 2) },
          medicine: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          quantity: { $push: '$quantity' },
        },
      },
    ]);

    return sortBy(res, '_id').reduce(
      (accum, value: { _id: string; quantity: number[] }) => {
        const quantity = value.quantity.reduce(
          (quantityAccum, quantity) => quantity + quantityAccum,
          0,
        );
        return [
          ...accum,
          {
            createdAt: format(new Date(value._id), 'dd-MM-yyyy'),
            Продано: quantity,
          },
        ];
      },
      [],
    );
  }

  async getDemand(dateFrom: Date | null): Promise<any> {
    const res = await this.medicineSaleModel.aggregate([
      {
        $match: {
          createdAt: { $gte: dateFrom ?? subDays(new Date(), 7) },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          quantity: { $push: '$quantity' },
        },
      },
    ]);

    return sortBy(res, '_id').reduce(
      (accum, value: { _id: string; quantity: number[] }) => {
        const quantity = value.quantity.reduce(
          (quantityAccum, quantity) => quantity + quantityAccum,
          0,
        );
        return [
          ...accum,
          {
            createdAt: format(new Date(value._id), 'dd-MM-yyyy'),
            Продано: quantity,
          },
        ];
      },
      [],
    );
  }

  async getProfit(dateFrom: Date | null): Promise<number> {
    const res = await this.medicineSaleModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: dateFrom ?? new Date('2021-01-01'),
          },
        },
      },
      {
        $group: {
          _id: null,
          quantity: { $sum: '$quantity' },
        },
      },
    ]);
    return res[0]?.quantity ?? 0;
  }
}
