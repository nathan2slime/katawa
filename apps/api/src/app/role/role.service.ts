import { Injectable } from '@nestjs/common'
import { PrismaService } from '~/database/prisma/prisma.service'

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  getByUser(userId: string) {
    return this.prisma.role.findMany({
      where: {
        userRole: {
          some: {
            userId
          }
        }
      }
    })
  }
}
