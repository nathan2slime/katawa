import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, Min } from 'class-validator'

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export class PaginationDto {
  @ApiProperty({ required: false })
  @Transform(params => {
    if (params.value) {
      if (params.value.trim().length === 0) return undefined
    }

    return params.value
  })
  query: string

  @ApiProperty({ default: 1, required: false, type: 'number' })
  @IsOptional()
  @IsNumber()
  @Transform(params => Number.parseInt(params.value))
  @Min(1)
  page = 1

  @ApiProperty({ enum: SortOrder, default: SortOrder.DESC, required: false })
  sortOrder: SortOrder

  @ApiProperty({ required: false })
  @IsOptional()
  sortField: string

  @ApiProperty({ default: 12, required: false, type: 'number' })
  @IsOptional()
  @Transform(params => Number.parseInt(params.value))
  @IsNumber()
  @Min(1)
  perPage = 12
}
