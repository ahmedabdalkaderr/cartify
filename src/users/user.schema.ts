import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

@Schema()
export class User {
  @ApiProperty({ description: 'The name of the user', required: true })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    required: true,
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ description: 'The password of the user', required: true })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    description: 'The role of the user, either admin or customer',
    default: 'customer',
    enum: ['admin', 'customer'],
    required: true,
  })
  @Prop({
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer',
  })
  role: string;

  @ApiProperty({
    description: 'The date the user was created',
    default: () => Date.now(),
  })
  @Prop({ default: () => Date.now() })
  createdAt: Date;
}

export type UserDocument = User & mongoose.Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User & mongoose.Document>(['save'], async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});
