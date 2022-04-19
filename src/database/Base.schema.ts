import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Base {
  @Prop({ isRequired: true })
  _id: string;

  @Prop({ isRequired: true })
  createdAt: string;

  @Prop({ isRequired: true })
  updatedAt: string;
}
