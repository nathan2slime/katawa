import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @ApiProperty()
  firstName: string

  @IsNotEmpty()
  @ApiProperty()
  lastName: string

  @IsNotEmpty()
  @ApiProperty()
  @MinLength(4)
  password: string
}
