import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { addMinutes } from 'date-fns';
import { RecommendationDocument } from './entities/recommendation.schema';
import { JwtAuthGuard } from '../auth-module/jwt-auth.guard';

@Controller('api/recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('dateFrom') dateFrom: string,
    @Query('name') name: string,
  ): Promise<RecommendationDocument[]> {
    const dateFromWithoutTimeZone = dateFrom
      ? addMinutes(new Date(dateFrom), -new Date(dateFrom).getTimezoneOffset())
      : null;
    return this.recommendationsService.findAll(dateFromWithoutTimeZone, name);
  }
}
