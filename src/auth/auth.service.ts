// src/auth/auth.service.ts

import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './user.schema';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(input: SignupInput) {
    // Prevent duplicate emails
    const exists = await this.userModel.findOne({ email: input.email });
    if (exists) {
      throw new ConflictException('Email already in use');
    }

    const hash = await bcrypt.hash(input.password, 10);
    const user = await this.userModel.create({ ...input, password: hash });
    return this.signToken((user as any)._id.toString());
  }
  async validateUser(email: string, pass: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const matches = await bcrypt.compare(pass, user.password);
    if (!matches) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  /**
   * Login: validate credentials then return JWT
   */
  async login(input: LoginInput) {
    const user = await this.validateUser(input.email, input.password);
    return this.signToken((user as any)._id.toString());
  }

  /**
   * Generate JWT for a given user ID
   */
  private signToken(userId: string) {
    const payload = { sub: userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
