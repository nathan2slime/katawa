import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { PaginationDto } from '~/app/app.dto'

import { AppRequest } from '~/app/app.types'
import { JwtAuthGuard } from '~/app/guards/auth.guard'
import { OwnerGuard } from '~/app/guards/owner.guard'
import { CreateRoleDto, UpdateRoleDto } from '~/app/role/role.dto'
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

  @Get('paginate')
  @UseGuards(OwnerGuard)
  async paginate(@Query() query: PaginationDto, @Res() res: Response) {
    const roles = await this.roleService.paginate(query)

    return res.status(HttpStatus.CREATED).json(roles)
  }

  @Post('create')
  @UseGuards(OwnerGuard)
  async create(@Body() body: CreateRoleDto, @Res() res: Response) {
    const role = await this.roleService.create(body)

    return res.status(HttpStatus.CREATED).json(role)
  }

  @Put('update/:id')
  @UseGuards(OwnerGuard)
  async update(@Param('id') id: string, @Body() payload: UpdateRoleDto, @Res() res: Response) {
    const data = await this.roleService.update(id, payload)

    return res.status(HttpStatus.OK).json(data)
  }

  @Delete('delete/:id')
  @UseGuards(OwnerGuard)
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.roleService.delete(id)

    return res.status(HttpStatus.OK).json({ id })
  }
}
