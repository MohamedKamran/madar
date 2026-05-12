import { Body, Controller, Get, Post, Req } from '@nestjs/common'

import { PipelineTriggerService } from '../../../pipeline/api/pipeline-trigger.service'
import { requireIdeasUserId, type AuthenticatedIdeasRequest } from './ideas-authenticated-request'

@Controller('ideas/pipeline')
export class IdeaPipelineController {
  constructor(private readonly pipelineTriggerService: PipelineTriggerService) {}

  @Get('status')
  async getPipelineStatus(
    @Body() dto: { ideaId: string },
    @Req() req: AuthenticatedIdeasRequest,
  ): Promise<string> {
    return `${requireIdeasUserId(req)}:${dto.ideaId}:status`
  }

  @Post('retry')
  async retryPipeline(
    @Body() dto: { problem: string; ideaId: string },
    @Req() req: AuthenticatedIdeasRequest,
  ): Promise<unknown> {
    return this.pipelineTriggerService.startPipeline(
      requireIdeasUserId(req),
      dto.problem,
      dto.ideaId,
    )
  }
}
