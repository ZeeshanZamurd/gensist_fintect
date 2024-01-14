import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from 'src/account/account.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { BeneficiaryModule } from 'src/beneficiary/beneficiary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ConfigModule should be imported first
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_DATABASE'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_USERNAME'),
        entities: ['dist/**/*.entity.{ts,js}'],
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
        autoLoadEntities: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    // AccountModule,
    TransactionModule,
    BeneficiaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
