import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { AdministrativePurchasesService } from './administrative-purchases.service';
import { AdministrativePurchaseDto } from './dto/administrative-purchase.dto';
import { addMinutes } from 'date-fns';

@Controller('api/administrative-purchases')
export class AdministrativePurchasesController {
  constructor(
    private readonly administrativePurchasesService: AdministrativePurchasesService,
  ) {}

  @Post()
  create(@Body() createAdministrativePurchaseDto: AdministrativePurchaseDto) {
    return this.administrativePurchasesService.create(
      createAdministrativePurchaseDto,
    );
  }

  @Get()
  findAll(@Query('dateFrom') dateFrom: string, @Query('name') name: string) {
    const dateFromWithoutTimeZone = dateFrom
      ? addMinutes(new Date(dateFrom), -new Date(dateFrom).getTimezoneOffset())
      : null;
    return this.administrativePurchasesService.findAll(
      dateFromWithoutTimeZone,
      name,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() administrativePurchaseDto: AdministrativePurchaseDto,
  ): Promise<void> {
    return this.administrativePurchasesService.update(
      id,
      administrativePurchaseDto,
    );
  }
}
