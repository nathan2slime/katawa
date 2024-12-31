import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class SignUpDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @ApiProperty()
  @MinLength(4)
  password: string
}

export class SignInDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  password: string
}
