import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/payment-dashboard'),
    AuthModule,
    PaymentsModule,
    // other modules will go here
  ],
})
export class AppModule {}
