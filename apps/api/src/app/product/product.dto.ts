import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty()
  @IsString()
  name: string

  @ApiPropertyOptional()
  @IsString()
  description: string

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  categories: string[]

  @ApiProperty()
  @IsString()
  storeId: string
}
