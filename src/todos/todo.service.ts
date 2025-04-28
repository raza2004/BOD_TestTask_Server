// todo.service.ts
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
      user: new Types.ObjectId(userId), // Convert string to ObjectId
    });
    return createdTodo.save();
  }

  async update(
    id: string,
    updateData: Partial<Todo>,
    userId: string,
  ): Promise<Todo> {
    const updatedTodo = await this.todoModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), user: new Types.ObjectId(userId) },
        { $set: updateData },
        { new: true },
      )
      .exec();
    if (updatedTodo === null) {
      throw new Error('Todo not found or not authorized to update');
    }
    return updatedTodo;
  }

  async delete(id: string, userId: string): Promise<Todo> {
    const deletedTodo = await this.todoModel
      .findOneAndDelete({
        _id: new Types.ObjectId(id),
        user: new Types.ObjectId(userId),
      })
      .exec();
    if (deletedTodo === null) {
      throw new Error('Todo not found or not authorized to delete');
    }
    return deletedTodo;
  }

  async findAll(userId: string): Promise<Todo[]> {
    return this.todoModel
      .find({
        user: new Types.ObjectId(userId),
      })
      .exec();
  }
}
