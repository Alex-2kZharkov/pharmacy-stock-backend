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
import { Medicine } from './entities/medicine.schema';
import { PrognosisDto } from './dto/prognosis.dto';
import { JwtAuthGuard } from '../auth-module/jwt-auth.guard';
import { addMinutes } from 'date-fns';

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
  findAll(@Query('dateFrom') dateFrom: string, @Query('name') name: string) {
    const dateFromWithoutTimeZone = dateFrom
      ? addMinutes(new Date(dateFrom), -new Date(dateFrom).getTimezoneOffset())
      : null;
    return this.medicinesService.findAll(dateFromWithoutTimeZone, name);
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
