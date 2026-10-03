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
  async getHive(userId: string, hiveId: string) {
    return this.prisma.hive.findFirstOrThrow({
      where: {
        id: hiveId,
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
        status: true,
        notes: true,
        installationDate: true,
        updatedAt: true,
        apiary: { select: { id: true, name: true, location: true } },
        queens: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            name: true,
            marking: true,
            color: true,
            year: true,
            source: true,
            installedAt: true,
          },
        },
      },
    });
  }

  async getHiveContext(userId: string, hiveId: string) {
    const hive = await this.prisma.hive.findFirstOrThrow({
      where: {
        id: hiveId,
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
        status: true,
        notes: true,
        installationDate: true,
        updatedAt: true,
        apiary: { select: { id: true, name: true, location: true } },
        queens: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            name: true,
            marking: true,
            color: true,
            year: true,
            source: true,
            installedAt: true,
          },
        },
        inspections: {
          orderBy: { date: 'desc' },
          take: 3,
          select: {
            id: true,
            date: true,
            status: true,
            temperature: true,
            weatherConditions: true,
            overallScore: true,
            populationScore: true,
            storesScore: true,
            queenScore: true,
            scoreWarnings: true,
            notes: { select: { text: true } },
          },
        },
        actions: {
          orderBy: { date: 'desc' },
          take: 10,
          select: {
            id: true,
            type: true,
            date: true,
            notes: true,
            feedingAction: true,
            treatmentAction: true,
          },
        },
        alerts: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            type: true,
            message: true,
            severity: true,
            createdAt: true,
          },
        },
        todos: {
          where: { completed: false },
          orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
          select: {
            id: true,
            title: true,
            description: true,
            dueDate: true,
          },
        },
        measurements: {
          orderBy: { recordedAt: 'desc' },
          take: 20,
          select: {
            id: true,
            metric: true,
            value: true,
            unit: true,
            recordedAt: true,
            source: true,
            side: true,
          },
        },
      },
    });

    return {
      hive,
      generatedAt: new Date().toISOString(),
    };
  }
}
