import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { MedicineShippingsService } from './medicine-shippings.service';
import { CreateMedicineShippingDto } from './dto/create-medicine-shipping.dto';
import { MedicineSaleDocument } from '../medicine-sales/entities/medicine-sales.schema';
import { addMinutes } from 'date-fns';
import { JwtAuthGuard } from '../auth-module/jwt-auth.guard';

@Controller('api/medicine-shippings')
export class MedicineShippingsController {
  constructor(
    private readonly medicineShippingsService: MedicineShippingsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createMedicineShippingDto: CreateMedicineShippingDto) {
    return this.medicineShippingsService.create(createMedicineShippingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('dateFrom') dateFrom: string,
    @Query('name') name: string,
  ): Promise<MedicineSaleDocument[]> {
    const dateFromWithoutTimeZone = dateFrom
      ? addMinutes(new Date(dateFrom), -new Date(dateFrom).getTimezoneOffset())
      : null;
    return this.medicineShippingsService.findAll(dateFromWithoutTimeZone, name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/cost')
  getShippingCost(@Query('dateFrom') dateFrom: string): Promise<number> {
    const dateFromWithoutTimeZone = dateFrom
      ? addMinutes(new Date(dateFrom), -new Date(dateFrom).getTimezoneOffset())
      : null;
    return this.medicineShippingsService.getShippingCost(
      dateFromWithoutTimeZone,
    );
  }
}
