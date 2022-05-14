import { Controller, Get } from '@nestjs/common';
import { BudgetService } from './budget.service';

@Controller('api/budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  findOne() {
    return this.budgetService.findOne();
  }
}
