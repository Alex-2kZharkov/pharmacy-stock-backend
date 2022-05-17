import { Controller, Get, UseGuards } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { JwtAuthGuard } from '../auth-module/jwt-auth.guard';

@Controller('api/budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findOne() {
    return this.budgetService.findOne();
  }
}
