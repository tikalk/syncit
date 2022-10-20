import { ApiProperty } from '@nestjs/swagger';

export class RegisterInput {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  name: string;
}

export class LoginInput {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class UserData {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  bio?: string;
  @ApiProperty()
  avatar?: string;
  @ApiProperty()
  created: string;
  @ApiProperty()
  theme: string;
}
