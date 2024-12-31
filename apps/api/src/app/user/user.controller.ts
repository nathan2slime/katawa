import { Controller, Get, HttpStatus, Query, Res, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { PaginationDto } from '~/app/app.dto'
import { JwtAuthGuard } from '~/app/auth/auth.guard'
import { RoleGuard } from '~/app/auth/role.guard'
import { UserService } from '~/app/user/user.service'

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('paginate')
  async paginate(@Query() query: PaginationDto, @Res() res: Response) {
    const data = await this.userService.paginate(query)

    return res.status(HttpStatus.OK).json(data)
  }
}
