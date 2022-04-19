import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicineSaleDto } from './create-medicine-sale.dto';

export class UpdateMedicineSaleDto extends PartialType(CreateMedicineSaleDto) {}
