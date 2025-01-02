import { Permission } from '@kwa/database'
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { hash } from 'bcryptjs'
import { Response } from 'express'

import { PaginationDto } from '~/app/app.dto'
import { AppRequest } from '~/app/app.types'
import { Roles } from '~/app/auth/auth.decorator'
import { JwtAuthGuard } from '~/app/guards/auth.guard'
import { RoleGuard } from '~/app/guards/role.guard'
import { SessionService } from '~/app/session/session.service'
import { CreateUserDto, UpdateUserDto } from '~/app/user/user.dto'
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

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto, @Req() req: AppRequest, @Res() res: Response) {
    const isMe = id === 'me'

    const session = req.user
    const user = session.user

    if (!isMe && !user.owner) throw new UnauthorizedException()

    const data = await this.userService.updateById(isMe ? user.id : id, body)

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
