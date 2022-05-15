import { Injectable, NotFoundException } from '@nestjs/common';
import { AdministrativePurchaseDto } from './dto/administrative-purchase.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AdministrativePurchase,
  AdministrativePurchaseDocument,
} from './entities/administrative-purchase.schema';
import { Budget, BudgetDocument } from '../../database/budget.schema';
import { UserDocument } from '../users/user.schema';
import { BudgetEnum } from '../../types/budget.types';

@Injectable()
export class AdministrativePurchasesService {
  constructor(
    @InjectModel(AdministrativePurchase.name)
    private administrativePurchaseModel: Model<AdministrativePurchaseDocument>,
    @InjectModel(Budget.name)
    private budgetModel: Model<BudgetDocument>,
  ) {}

  async create({
    name,
    amount,
  }: AdministrativePurchaseDto): Promise<UserDocument> {
    const budget = await this.budgetModel
      .findOne({ name: BudgetEnum.PROFIT })
      .lean();

    await this.budgetModel.updateOne(
      { name: BudgetEnum.PROFIT },
      { amount: (budget as Budget).amount - amount },
    );

    return await this.administrativePurchaseModel.create({
      amount,
      name,
    });
  }

  async findAll(
    dateFrom: Date | null,
    name: string,
  ): Promise<AdministrativePurchaseDocument[]> {
    const regex = new RegExp(name, 'i'); // i for case insensitive
    const options = dateFrom
      ? {
          createdAt: {
            $gte: dateFrom,
          },
        }
      : undefined;

    const results = await this.administrativePurchaseModel
      .find(options)
      .sort({ createdAt: -1 })
      .exec();

    return results.filter((value: AdministrativePurchaseDocument) => {
      if (name) {
        return (value as AdministrativePurchase).name.match(regex);
      }
      return value;
    });
  }

  async update(
    id: string,
    { _id, name, amount }: AdministrativePurchaseDto,
  ): Promise<void> {
    const administrativePurchase =
      await this.administrativePurchaseModel.findById(id);
    if (!administrativePurchase) {
      throw new NotFoundException('Административный расход не найден');
    }

    const budget = await this.budgetModel
      .findOne({ name: BudgetEnum.PROFIT })
      .lean();

    await this.budgetModel.updateOne(
      { name: BudgetEnum.PROFIT },
      {
        amount:
          (budget as Budget).amount +
          (administrativePurchase as AdministrativePurchase).amount -
          amount,
      },
    );

    await this.administrativePurchaseModel
      .updateOne({ _id: id }, { amount, name })
      .exec();
  }
}
