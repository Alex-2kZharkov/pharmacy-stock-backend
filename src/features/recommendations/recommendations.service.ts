import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Recommendation,
  RecommendationDocument,
} from './entities/recommendation.schema';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectModel(Recommendation.name)
    private recommendationModel: Model<RecommendationDocument>,
  ) {}

  async findAll(
    dateFrom: Date | null,
    name: string,
  ): Promise<RecommendationDocument[]> {
    const regex = new RegExp(name, 'i'); // i for case insensitive
    const options = dateFrom
      ? {
          createdAt: {
            $gte: dateFrom,
          },
        }
      : undefined;

    const results = await this.recommendationModel
      .find(options)
      .sort({ createdAt: -1 })
      .populate('medicine')
      .exec();

    return results.filter((value: RecommendationDocument) => {
      if (name) {
        return (value as Recommendation).medicine.name.match(regex);
      }
      return value;
    });
  }
}
