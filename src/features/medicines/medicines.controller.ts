import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import {
  UpdateMedicineDto,
  UpdateOrderPointDto,
} from './dto/update-medicine.dto';
import { MedicineDocument } from './entities/medicine.schema';
import { PrognosisDto } from './dto/prognosis.dto';

@Controller('/api/medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Post()
  create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicinesService.create(createMedicineDto);
  }

  @Get()
  findAll(): Promise<MedicineDocument[]> {
    return this.medicinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicinesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ) {
    return this.medicinesService.update(+id, updateMedicineDto);
  }

  @Patch('order-point/:id')
  updateOrderPoint(
    @Param('id') id: string,
    @Body() updateOrderPointDto: UpdateOrderPointDto,
  ) {
    return this.medicinesService.updateOrderPoint(id, updateOrderPointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicinesService.remove(+id);
  }

  @Post('prognosis')
  createPrognosis(@Body() body: PrognosisDto) {
    return this.medicinesService.countPrognosis(body.id);
  }
}
