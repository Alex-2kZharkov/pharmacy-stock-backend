import { Base } from '../../database/Base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role | Document;

@Schema({ timestamps: true })
export class Role extends Base {
  @Prop({ isRequired: true })
  name: string;

  @Prop({ isRequired: true })
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
