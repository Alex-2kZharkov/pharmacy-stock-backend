import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MedicineSalesService } from './medicine-sales.service';
import { CreateMedicineSaleDto } from './dto/create-medicine-sale.dto';
import { UpdateMedicineSaleDto } from './dto/update-medicine-sale.dto';

@Controller('/api/medicine-sales')
export class MedicineSalesController {
  constructor(private readonly medicineSalesService: MedicineSalesService) {}

  @Post()
  create(@Body() createMedicineSaleDto: CreateMedicineSaleDto) {
    return this.medicineSalesService.create(createMedicineSaleDto);
  }

  @Get()
  findAll() {
    return this.medicineSalesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicineSalesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicineSaleDto: UpdateMedicineSaleDto,
  ) {
    return this.medicineSalesService.update(+id, updateMedicineSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicineSalesService.remove(+id);
  }
}
