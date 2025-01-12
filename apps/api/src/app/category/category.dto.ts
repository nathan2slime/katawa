import { IsOptional, IsString } from 'class-validator'

export class CreateCategoryDto {
  @IsString()
  title: string

  @IsString()
  slug: string
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  title: string

  @IsOptional()
  @IsString()
  slug: string
}
