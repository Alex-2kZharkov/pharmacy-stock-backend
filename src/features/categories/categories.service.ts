import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './entities/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async create({ name }: CategoryDto) {
    return await this.categoryModel.create({
      name,
    });
  }

  async findAll(
    dateFrom: Date | null,
    name: string,
  ): Promise<CategoryDocument[]> {
    const regex = new RegExp(name, 'i'); // i for case insensitive
    const options = dateFrom
      ? {
          createdAt: {
            $gte: dateFrom,
          },
        }
      : undefined;

    const results = await this.categoryModel
      .find(options)
      .sort({ createdAt: -1 })
      .exec();

    return results.filter((value: CategoryDocument) => {
      if (name) {
        return (value as Category).name.match(regex);
      }
      return value;
    });
  }

  async update(id: string, { name }: CategoryDto) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    await this.categoryModel.updateOne({ _id: id }, { name }).exec();
  }
}
