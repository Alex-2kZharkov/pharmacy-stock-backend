import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { Medicine, MedicineDocument } from './entities/medicine.schema';
import { PrognosisDto } from './dto/prognosis.dto';
import { JwtAuthGuard } from '../auth-module/jwt-auth.guard';

@Controller('/api/medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createMedicineDto: Medicine) {
    return this.medicinesService.create(createMedicineDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('name') name: string): Promise<MedicineDocument[]> {
    return this.medicinesService.findAll(name);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicinesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateMedicineDto: Medicine) {
    return this.medicinesService.update(id, updateMedicineDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicinesService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('prognosis')
  createPrognosis(@Body() body: PrognosisDto) {
    return this.medicinesService.countPrognosis(body.id);
  }
}
