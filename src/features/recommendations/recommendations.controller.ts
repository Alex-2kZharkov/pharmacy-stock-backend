import { Controller, Get, Query } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { addMinutes } from 'date-fns';
import { RecommendationDocument } from './entities/recommendation.schema';

@Controller('api/recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}
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
