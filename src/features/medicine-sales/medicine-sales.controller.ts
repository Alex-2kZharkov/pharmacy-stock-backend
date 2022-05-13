import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MedicineSalesService } from './medicine-sales.service';
import { CreateMedicineSaleDto } from './dto/create-medicine-sale.dto';
import { MedicineSaleDocument } from './entities/medicine-sales.schema';
import { addMinutes } from 'date-fns';

@Controller('/api/medicine-sales')
export class MedicineSalesController {
  constructor(private readonly medicineSalesService: MedicineSalesService) {}

  @Post()
  create(@Body() createMedicineSaleDto: CreateMedicineSaleDto) {
    return this.medicineSalesService.create(createMedicineSaleDto);
  }

  @Get()
  findAll(
    @Query('dateFrom') dateFrom: string,
  ): Promise<MedicineSaleDocument[]> {
    const dateFromWithoutTimeZone = dateFrom
      ? addMinutes(new Date(dateFrom), -new Date(dateFrom).getTimezoneOffset())
      : null;
    return this.medicineSalesService.findAll(dateFromWithoutTimeZone);
  }
}
