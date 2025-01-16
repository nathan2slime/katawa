import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsJSON, IsNumber, IsPositive, IsString } from 'class-validator'

export class CreateProductVariantDto {
  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty()
  @IsString()
  productId: string

  @ApiProperty()
  @IsString()
  sku: string

  @ApiProperty()
  @IsJSON()
  attributes: object

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  price: number

  @ApiProperty()
  @IsInt()
  @IsPositive()
  stock: number
}
