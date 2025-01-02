import { Permission } from '@kwa/database'
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query, Res, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { hash } from 'bcryptjs'
import { Response } from 'express'

import { PaginationDto } from '~/app/app.dto'
import { Roles } from '~/app/auth/auth.decorator'
import { JwtAuthGuard } from '~/app/guards/auth.guard'
import { RoleGuard } from '~/app/guards/role.guard'
import { SessionService } from '~/app/session/session.service'
import { CreateUserDto } from '~/app/user/user.dto'
import { UserService } from '~/app/user/user.service'

import { EMAIL_ALREADY_EXISTS_MESSAGE } from '~/errors'

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly sesssionService: SessionService
  ) {}

  @Get('paginate')
  async paginate(@Query() query: PaginationDto, @Res() res: Response) {
    const data = await this.userService.paginate(query)

    return res.status(HttpStatus.OK).json(data)
  }

  @Delete('remove/:id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.userService.removeById(id)
    await this.sesssionService.deleteAllByUserId(id)

    return res.status(HttpStatus.OK).send()
  }

  @Roles([Permission.CREATE_USER])
  @Post('create')
  async create(@Body() data: CreateUserDto, @Res() res: Response) {
    const userAlreadyExists = await this.userService.getByEmail(data.email)
    if (userAlreadyExists) throw new HttpException(EMAIL_ALREADY_EXISTS_MESSAGE, HttpStatus.CONFLICT)

    data.password = await hash(data.password, 10)

    const user = await this.userService.create(data)

    return res.status(HttpStatus.CREATED).json(user)
  }
}
