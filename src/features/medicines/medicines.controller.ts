import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { Medicine, MedicineDocument } from './entities/medicine.schema';
import { PrognosisDto } from './dto/prognosis.dto';

@Controller('/api/medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Post()
  create(@Body() createMedicineDto: Medicine) {
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

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMedicineDto: Medicine) {
    return this.medicinesService.update(id, updateMedicineDto);
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
