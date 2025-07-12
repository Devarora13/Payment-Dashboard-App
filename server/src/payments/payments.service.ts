import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Model } from 'mongoose';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(paymentDto: any) {
    const payment = new this.paymentModel(paymentDto);
    return payment.save();
  }

  async findAll(filters: any) {
    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.method) query.method = filters.method;

    if (filters.startDate && filters.endDate) {
      query.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      };
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;

    return this.paymentModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async findOne(id: string) {
    return this.paymentModel.findById(id);
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 6);
    oneWeekAgo.setHours(0, 0, 0, 0);

    const [totalToday, failedCount, totalRevenue, last7Days] = await Promise.all([
      this.paymentModel.countDocuments({
        createdAt: { $gte: today },
      }),
      this.paymentModel.countDocuments({ status: 'failed' }),
      this.paymentModel.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      this.paymentModel.aggregate([
        {
          $match: {
            createdAt: { $gte: oneWeekAgo },
            status: 'success',
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return {
      totalToday,
      failedCount,
      totalRevenue: totalRevenue[0]?.total || 0,
      last7Days,
    };
  }
}
