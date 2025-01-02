import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator'

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

export class UpdateUserDto {
  @IsOptional()
  @ApiProperty({ required: false })
  @IsEmail()
  email: string

  @IsNotEmpty()
  @ApiProperty({ required: false })
  firstName: string

  @IsOptional()
  @ApiProperty({ required: false })
  lastName: string
}

