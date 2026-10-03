import { Module } from '@nestjs/common';
import { McpController } from './mcp.controller';
import { McpService } from './mcp.service';
import { HiveModule } from '../hives/hive.module';
import { ApiariesModule } from '../apiaries/apiaries.module';
import { WorkerTokensModule } from '../worker-tokens/worker-tokens.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [HiveModule, ApiariesModule, WorkerTokensModule],
  controllers: [McpController],
  providers: [McpService, PrismaService],
})
export class McpModule {}
