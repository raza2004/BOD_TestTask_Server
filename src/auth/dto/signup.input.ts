// src/auth/dto/signup.input.ts
// @InputType()
// export class SignupInput {
//   @Field() email: string;
//   @Field() password: string;
// }
// // src/auth/dto/login.input.ts
// @InputType()
// export class LoginInput {
//   /* same as above */
//   @Field() email: string;
//   @Field() password: string;
// }
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignupInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
