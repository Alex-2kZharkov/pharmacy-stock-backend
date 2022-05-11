import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine, MedicineDocument } from './entities/medicine.schema';
import { Base } from '../../database/Base.schema';
import { sub } from 'date-fns';
import {
  countByBrownDoubleSmoothing,
  countBySimpleExponentialSmoothing,
  countLosses,
  countLossesByAction,
  countMaxConditionalProfitsByEvent,
  countProfit,
  getMaxExpectedMonetaryValue,
  getMinExpectedLosses,
  getMinimumByTolerance,
} from '../../utils/algorithm.utils';
import { countProbabilityUsingPoissonDistribution } from '../../utils/algorithm.utils';
import {
  MedicineSale,
  MedicineSaleDocument,
} from '../medicine-sales/entities/medicine-sales.schema';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectModel(Medicine.name) private medicineModel: Model<MedicineDocument>,
    @InjectModel(MedicineSale.name)
    private medicineSaleModel: Model<MedicineSaleDocument>,
  ) {}

  async create(createMedicineDto: Medicine) {
    return await this.medicineModel.create({
      ...createMedicineDto,
      quantity: createMedicineDto.quantity || 0,
      orderPoint: createMedicineDto.orderPoint || 0,
      _id: undefined,
    });
  }

  async findAll(): Promise<MedicineDocument[]> {
    return await this.medicineModel.find().sort({ name: 1 }).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} medicine`;
  }

  async update(id: string, updateMedicineDto: UpdateMedicineDto) {
    try {
      const medicine = await this.medicineModel.findById(id);
      await medicine.update({ $set: { ...updateMedicineDto } }).exec();
    } catch {
      throw new NotFoundException('Товар не найден');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} medicine`;
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
    return medicineSales.reduce((accum, medicineSale: MedicineSale & Base) => {
      const monthIndex = new Date(medicineSale.createdAt).getMonth();
      const quantity = quantitiesByMonths[monthIndex];
      if (quantity) {
        accum.push(quantitiesByMonths[monthIndex]);
        delete quantitiesByMonths[monthIndex];
      }
      return accum;
    }, []);
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

    const expectedMonetaryValues = countProfit(
      events,
      medicine.primaryAmount,
      medicine.finalAmount,
    );
    console.log(expectedMonetaryValues);
    const maxExpectedProfit = getMaxExpectedMonetaryValue(
      expectedMonetaryValues,
    );
    const losses = countLosses(
      events,
      medicine.primaryAmount,
      medicine.finalAmount,
    );
    const maxConditionalProfits = countMaxConditionalProfitsByEvent(losses);
    const expectedLosses = countLossesByAction(
      events,
      medicine.primaryAmount,
      medicine.finalAmount,
      maxConditionalProfits,
    );
    console.log(expectedLosses);
    const minExpectedLose = getMinExpectedLosses(expectedLosses);
    console.log(maxExpectedProfit, minExpectedLose);

    if (maxExpectedProfit.x === minExpectedLose.x) {
      medicine.prognosis = maxExpectedProfit.x;
      medicine.prognosisUpdatedAt = new Date();
      await this.medicineModel.updateOne(
        { _id: id },
        {
          $set: {
            prognosis: maxExpectedProfit.x,
            prognosisUpdatedAt: new Date(),
          },
        },
      );
      return {
        message: `Менеджеру рекомендуется заказать товар "${
          medicine.name
        }" в количестве ${maxExpectedProfit.x} ед., поскольку 
        выбор данного решения позволит получить максимальную среднюю ожидаемую прибыль (${maxExpectedProfit.weightedProfit.toFixed(
          2,
        )})
        и обеспечит минимальное среднее ожидаемое денежное значение потери (${minExpectedLose.weightedLoss.toFixed(
          2,
        )}).`,
      };
    }
    return {
      message: 'Не удалось вычислить оптимальное количество товаров к заказу.',
    };
  }
}
