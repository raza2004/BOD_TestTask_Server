// src/todos/todo.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TodosService } from './todo.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateTodoInput } from '../auth/dto/create-todo.input';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/user.schema';
import { Todo } from './todo.schema';

@UseGuards(GqlAuthGuard)
@Resolver(() => Todo)
export class TodosResolver {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('user')
  @Mutation(() => Todo)
  async createTodo(
    @Args('createTodoInput') createTodoInput: CreateTodoInput,
    @CurrentUser() user: User,
  ) {
    return this.todosService.create(createTodoInput, user._id.toString());
  }

  @Mutation(() => Todo)
  async updateTodo(
    @Args('id') id: string, // Matches String! in schema
    @Args('completed') completed: boolean,
    @CurrentUser() user: User,
  ) {
    try {
      return await this.todosService.update(
        id,
        { completed },
        user._id.toString(),
      );
    } catch (error) {
      throw new Error(`Failed to update todo: ${error.message}`);
    }
  }

  @Mutation(() => Todo)
  async deleteTodo(
    @Args('id') id: string, // Matches String! in schema
    @CurrentUser() user: User,
  ) {
    try {
     
      return await this.todosService.delete(id, user._id.toString());
    } catch (error) {
      throw new Error(`Failed to delete todo: ${error.message}`);
    }
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('user')
  @Query(() => [Todo])
  async getTodos(@CurrentUser() user: User) {
    if (!user?._id) {
      throw new Error('User ID not found in request');
    }
    return this.todosService.findAll(user._id.toString());
  }
}
