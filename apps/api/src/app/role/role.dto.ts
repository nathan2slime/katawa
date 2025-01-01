import { Permission } from '@kwa/database'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

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
