import { Injectable } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine, MedicineDocument } from './entities/medicine.schema';
import {
  MedicineSale,
  MedicineSaleDocument,
} from '../medicine-sales/entities/medicine.schema';
import { Base } from '../../database/Base.schema';
import { sub } from 'date-fns';
import {
  countByBrownDoubleSmoothing,
  countBySimpleExponentialSmoothing,
  getMinimumByTolerance,
} from '../../utils/algorithm.utils';
import { countProbabilityUsingPoissonDistribution } from '../../utils/algorithm.utils';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectModel(Medicine.name) private medicineModel: Model<MedicineDocument>,
    @InjectModel(MedicineSale.name)
    private medicineSaleModel: Model<MedicineSaleDocument>,
  ) {}
  create(createMedicineDto: CreateMedicineDto) {
    return 'This action adds a new medicine';
  }

  async findAll(): Promise<MedicineDocument[]> {
    return await this.medicineModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} medicine`;
  }

  update(id: number, updateMedicineDto: UpdateMedicineDto) {
    return `This action updates a #${id} medicine`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicine`;
  }

  async countPrognosis(id: string) {
    const medicine: Medicine = await this.medicineModel.findById(id).lean();
    const medicineSales: MedicineSale[] = await this.medicineSaleModel
      .find({
        medicine,
        createdAt: {
          $gte: sub(new Date(), { months: 6 }),
          $lte: new Date(),
        },
      })
      .sort({ createdAt: 1 })
      .lean();

    const realDemands: number[] = this.getRealDemandByMonths(medicineSales);

    const simpleExponentialSmoothingPrognosis =
      countBySimpleExponentialSmoothing(realDemands);

    const brownDoubleSmoothingPrognosis =
      countByBrownDoubleSmoothing(realDemands);

    const orderPoint: number = getMinimumByTolerance(
      realDemands[realDemands.length - 2],
      ...simpleExponentialSmoothingPrognosis,
      ...brownDoubleSmoothingPrognosis,
    );
    const events = countProbabilityUsingPoissonDistribution(orderPoint);
    return orderPoint;
  }

  getRealDemandByMonths(medicineSales: MedicineSaleDocument[]): number[] {
    const quantitiesByMonths = medicineSales.reduce(
      (accum, { createdAt, quantity }: MedicineSale & Base) => {
        const monthNumber = new Date(createdAt).getMonth();
        const existedQuantity: number = accum[monthNumber];

        accum[monthNumber] = existedQuantity
          ? existedQuantity + quantity
          : quantity;

        return accum;
      },
      {},
    );
    const demand: number[] = medicineSales.reduce(
      (accum, medicineSale: MedicineSale & Base) => {
        const monthIndex = new Date(medicineSale.createdAt).getMonth();
        const quantity = quantitiesByMonths[monthIndex];
        if (quantity) {
          accum.push(quantitiesByMonths[monthIndex]);
          delete quantitiesByMonths[monthIndex];
        }
        return accum;
      },
      [],
    );
    return demand;
  }
}
