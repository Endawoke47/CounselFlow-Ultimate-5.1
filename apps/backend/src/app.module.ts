import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MattersModule } from './modules/matters/matters.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { ClientsModule } from './modules/clients/clients.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { AiModule } from './modules/ai/ai.module';
import { RisksModule } from './modules/risks/risks.module';
import { DisputesModule } from './modules/disputes/disputes.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CasesModule } from './modules/cases/cases.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    MattersModule,
    ContractsModule,
    ClientsModule,
    DocumentsModule,
    CasesModule,
    AiModule,
    RisksModule,
    DisputesModule,
    AnalyticsModule,
    NotificationsModule,
  ],
})
export class AppModule {}