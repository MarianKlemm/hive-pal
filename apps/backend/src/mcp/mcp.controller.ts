import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { McpService } from './mcp.service';
import {
  WorkerRequest,
  WorkerTokenAuthGuard,
} from '../worker-jobs/worker-token-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('mcp')
@Controller('mcp')
@UseGuards(WorkerTokenAuthGuard)
export class McpController {
  constructor(
    private readonly mcp: McpService,
    private readonly prisma: PrismaService,
  ) {}

  private async userId(req: WorkerRequest): Promise<string> {
    const token = await this.prisma.workerToken.findUniqueOrThrow({
      where: { id: req.workerToken.id },
      select: { createdById: true },
    });
    return token.createdById;
  }

  @Get('apiaries')
  async listApiaries(@Req() req: WorkerRequest) {
    return this.mcp.listApiaries(await this.userId(req));
  }

  @Get('hives')
  async listHives(
    @Req() req: WorkerRequest,
    @Query('apiaryId') apiaryId?: string,
  ) {
    return this.mcp.listHives(await this.userId(req), apiaryId);
  }
}
