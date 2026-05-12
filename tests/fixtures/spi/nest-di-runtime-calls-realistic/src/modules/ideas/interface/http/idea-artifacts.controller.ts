import { Body, Controller, Get, Req } from '@nestjs/common'

import { BuildPerspectiveService } from '../../infrastructure/services/build-perspective.service'
import { requireIdeasUserId, type AuthenticatedIdeasRequest } from './ideas-authenticated-request'

@Controller('ideas/artifacts')
export class IdeaArtifactsController {
  constructor(private readonly buildPerspectiveService: BuildPerspectiveService) {}

  @Get('build-perspective')
  async generateBuildPerspective(
    @Body() dto: { ideaId: string },
    @Req() req: AuthenticatedIdeasRequest,
  ): Promise<string> {
    return this.buildPerspectiveService.generateBuildPerspective(
      requireIdeasUserId(req),
      dto.ideaId,
    )
  }

  @Get('pdf')
  async exportIdeaToPdf(
    @Body() dto: { ideaId: string },
    @Req() req: AuthenticatedIdeasRequest,
  ): Promise<string> {
    return `${requireIdeasUserId(req)}:${dto.ideaId}:pdf`
  }

  @Get('lets-build')
  async generateLetsBuild(
    @Body() dto: { ideaId: string },
    @Req() req: AuthenticatedIdeasRequest,
  ): Promise<string> {
    return this.buildPerspectiveService.generateLetsBuild(
      requireIdeasUserId(req),
      dto.ideaId,
    )
  }

  @Get('build-perspective/:id')
  async getBuildPerspective(
    @Body() dto: { ideaId: string },
    @Req() req: AuthenticatedIdeasRequest,
  ): Promise<string> {
    return this.buildPerspectiveService.getBuildPerspective(
      requireIdeasUserId(req),
      dto.ideaId,
    )
  }
}
