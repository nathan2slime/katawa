import { Permission } from '@kwa/database'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  color: string

  @ApiProperty({ enum: Permission, type: 'array' })
  @IsNotEmpty()
  permissions: Permission[]
}

export class UpdateRoleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  color: string

  @ApiProperty({ enum: Permission, required: false, type: 'array' })
  @IsOptional()
  permissions: Permission[]
}
