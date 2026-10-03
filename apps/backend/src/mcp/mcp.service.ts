import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class McpService {
  constructor(private readonly prisma: PrismaService) {}

  async listApiaries(userId: string) {
    return this.prisma.apiary.findMany({
      where: {
        OR: [{ userId }, { members: { some: { userId, status: 'ACTIVE' } } }],
      },
      select: {
        id: true,
        name: true,
        location: true,
        _count: { select: { hives: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async listHives(userId: string, apiaryId?: string) {
    return this.prisma.hive.findMany({
      where: {
        ...(apiaryId ? { apiaryId } : {}),
        apiary: {
          OR: [
            { userId },
            { members: { some: { userId, status: 'ACTIVE' } } },
          ],
        },
      },
      select: {
        id: true,
        name: true,
        apiaryId: true,
        status: true,
        notes: true,
        updatedAt: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}
