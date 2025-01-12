import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreateCategoryDto {
  @IsString()
  @ApiProperty()
  title: string

  @IsString()
  @ApiProperty()
  slug: string
}

export class UpdateCategoryDto {
  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  title: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  slug: string
}
