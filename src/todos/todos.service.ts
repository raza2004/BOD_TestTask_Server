import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Todo } from './todo.schema';
import { CreateTodoInput } from '../auth/dto/create-todo.input';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  async create(
    createTodoInput: CreateTodoInput,
    userId: string,
  ): Promise<Todo> {
    const createdTodo = new this.todoModel({
      ...createTodoInput,
      user: userId,
    });
    return createdTodo.save();
  }

  // todo.service.ts
  async update(
    id: string,
    updateData: Partial<Todo>,
    userId: string,
  ): Promise<Todo> {
    const updatedTodo = await this.todoModel
      .findOneAndUpdate(
        {
          _id: id, // No need for ObjectId conversion since schema expects String
          user: new Types.ObjectId(userId),
        },
        { $set: updateData },
        { new: true },
      )
      .exec();

    if (!updatedTodo) {
      throw new Error('Todo not found or not authorized to update');
    }
    return updatedTodo;
  }

  async delete(id: string, userId: string): Promise<Todo> {
    const deletedTodo = await this.todoModel
      .findOneAndDelete({
        _id: id, // No need for ObjectId conversion
        user: new Types.ObjectId(userId),
      })
      .exec();

    if (!deletedTodo) {
      throw new Error('Todo not found or not authorized to delete');
    }
    return deletedTodo;
  }
  async findAll(userId: string): Promise<Todo[]> {
    return this.todoModel.find({ user: userId }).exec();
  }
}
