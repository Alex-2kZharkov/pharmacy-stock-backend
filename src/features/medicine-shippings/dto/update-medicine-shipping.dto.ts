import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicineShippingDto } from './create-medicine-shipping.dto';

export class UpdateMedicineShippingDto extends PartialType(CreateMedicineShippingDto) {}
