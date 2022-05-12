import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MedicineShippingsService } from './medicine-shippings.service';
import { CreateMedicineShippingDto } from './dto/create-medicine-shipping.dto';
import { UpdateMedicineShippingDto } from './dto/update-medicine-shipping.dto';
import { MedicineSaleDocument } from '../medicine-sales/entities/medicine-sales.schema';
import { addMinutes } from 'date-fns';

@Controller('api/medicine-shippings')
export class MedicineShippingsController {
  constructor(
    private readonly medicineShippingsService: MedicineShippingsService,
  ) {}

  @Post()
  create(@Body() createMedicineShippingDto: CreateMedicineShippingDto) {
    return this.medicineShippingsService.create(createMedicineShippingDto);
  }

  @Get()
  findAll(
    @Query('dateFrom') dateFrom: string,
  ): Promise<MedicineSaleDocument[]> {
    const dateFromWithoutTimeZone = dateFrom
      ? addMinutes(new Date(dateFrom), -new Date(dateFrom).getTimezoneOffset())
      : null;
    return this.medicineShippingsService.findAll(dateFromWithoutTimeZone);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicineShippingsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicineShippingDto: UpdateMedicineShippingDto,
  ) {
    return this.medicineShippingsService.update(+id, updateMedicineShippingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicineShippingsService.remove(+id);
  }
}
