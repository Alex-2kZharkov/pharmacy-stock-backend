import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Budget, BudgetDocument } from '../../database/budget.schema';
import { Model } from 'mongoose';
import { BudgetEnum } from '../../types/budget.types';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>,
  ) {}

  async findOne() {
    return this.budgetModel.findOne({ name: BudgetEnum.PROFIT }).lean();
  }
}
