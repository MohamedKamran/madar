import { Body, Controller, Get, Post, Req } from '@nestjs/common'

import { requireIdeasUserId, type AuthenticatedIdeasRequest } from './ideas-authenticated-request'

@Controller('ideas/lifecycle')
export class IdeaLifecycleController {
  @Get(':id')
  async getIdea(
    @Body() dto: { ideaId: string },
    @Req() req: AuthenticatedIdeasRequest,
  ): Promise<string> {
    return `${requireIdeasUserId(req)}:${dto.ideaId}`
  }

  @Get()
  async listIdeas(@Req() req: AuthenticatedIdeasRequest): Promise<string[]> {
    return [requireIdeasUserId(req)]
  }

  @Post('publish')
  async publishIdea(
    @Body() dto: { ideaId: string },
    @Req() req: AuthenticatedIdeasRequest,
  ): Promise<string> {
    return `${requireIdeasUserId(req)}:${dto.ideaId}:published`
  }

  @Post('delete')
  async deleteIdea(
    @Body() dto: { ideaId: string },
    @Req() req: AuthenticatedIdeasRequest,
  ): Promise<string> {
    return `${requireIdeasUserId(req)}:${dto.ideaId}:deleted`
  }
}
