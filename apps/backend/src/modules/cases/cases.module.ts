import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { Case } from './entities/case.entity';
import { CaseDocument } from './entities/case-document.entity';
import { CaseAnalysis } from './entities/case-analysis.entity';
import { CaseUpdatesGateway } from './gateways/case-updates.gateway';
import { AiModule } from '../ai/ai.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Case, CaseDocument, CaseAnalysis]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        limits: {
          fileSize: 50 * 1024 * 1024, // 50MB
        },
      }),
      inject: [ConfigService],
    }),
    AiModule,
    UsersModule,
    ConfigModule,
  ],
  controllers: [CasesController],
  providers: [CasesService, CaseUpdatesGateway],
  exports: [CasesService],
})
export class CasesModule {}