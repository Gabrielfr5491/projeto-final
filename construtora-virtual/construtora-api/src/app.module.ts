import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObrasModule } from './obras/obras.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),

        ssl: {
          rejectUnauthorized: false,
        },

        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    ObrasModule,

    DashboardModule,

    AuthModule,

    UsuariosModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}