import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { AppRequest } from '~/app/app.types'
import { JwtAuthGuard } from '~/app/guards/auth.guard'
import { OwnerGuard } from '~/app/guards/owner.guard'
import { CreateRoleDto } from '~/app/role/role.dto'
import { RoleService } from '~/app/role/role.service'

@Controller('role')
@ApiTags('Role')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('my')
  async my(@Req() req: AppRequest, @Res() res: Response) {
    const roles = await this.roleService.getByUser(req.user.userId)

    return res.status(HttpStatus.OK).json(roles)
  }

  @Post('create')
  @UseGuards(OwnerGuard)
  async create(@Body() body: CreateRoleDto, @Res() res: Response) {
    const role = await this.roleService.create(body)

    return res.status(HttpStatus.CREATED).json(role)
  }
}