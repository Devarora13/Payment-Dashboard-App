import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';
import 'dotenv/config';


@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGODB_URI}/payment-dashboard`),
    AuthModule,
    PaymentsModule,
    // other modules will go here
  ],
})
export class AppModule {}
