// src/auth/auth.resolver.ts

import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';
import { AuthPayload } from './models/auth-payload.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async signup(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<AuthPayload> {
    return this.authService.signup({ email, password });
  }

  @Mutation(() => AuthPayload)
  async login(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<AuthPayload> {
    return this.authService.login({ email, password });
  }
}
