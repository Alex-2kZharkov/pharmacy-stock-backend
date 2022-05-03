import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import {
  UpdateMedicineDto,
  UpdateOrderPointDto,
} from './dto/update-medicine.dto';
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
  create(createMedicineDto: CreateMedicineDto) {
    return 'This action adds a new medicine';
  }

  async findAll(): Promise<MedicineDocument[]> {
    return await this.medicineModel.find().sort({ name: 1 }).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} medicine`;
  }

  update(id: number, updateMedicineDto: UpdateMedicineDto) {
    return `This action updates a #${id} medicine`;
  }

  async updateOrderPoint(id: string, updateOrderPoint: UpdateOrderPointDto) {
    try {
      const medicine = await this.medicineModel.findById(id);
      await medicine
        .update({ $set: { orderPoint: updateOrderPoint.orderPoint } })
        .exec();
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
      return `Количество товаров к заказу в следующий месяц = ${maxExpectedProfit.x}`;
    }
    return 'Не удалось вычислить оптимальное количество товаров к заказу';
  }
}
