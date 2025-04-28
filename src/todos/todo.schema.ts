// todo.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Schema({ timestamps: true })
@ObjectType()
export class Todo extends Document {
  @Field(() => ID)
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  @Field()
  title: string;

  @Prop()
  @Field({ nullable: true })
  description?: string;

  @Prop({ default: false })
  @Field()
  completed: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @Field(() => ID)
  user: Types.ObjectId; // Keep as ObjectId in schema
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
