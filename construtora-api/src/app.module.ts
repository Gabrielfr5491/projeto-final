import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ObrasModule } from './obras/obras.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { FuncionariosModule } from './funcionarios/funcionarios.module';
import { FornecedoresModule } from './fornecedores/fornecedores.module';
import { MateriaisModule } from './materiais/materiais.module';
import { EquipamentosModule } from './equipamentos/equipamentos.module';
import { CustosModule } from './custos/custos.module';
import { RelatoriosModule } from './relatorios/relatorios.module';
import { Modelo3dModule } from './modelo3d/modelo3d.module';
import { DiarioModule } from './diario/diario.module';
import { AlertasModule } from './alertas/alertas.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');

        if (!url) {
          throw new Error('❌ DATABASE_URL não definida!');
        }

        return {
          type: 'postgres',
          url,
          ssl: {
            rejectUnauthorized: false,
          },
          autoLoadEntities: true,
          // synchronize recria as tabelas se não existirem, mas não dropa colunas existentes
          // Controlado por variável de ambiente: TYPEORM_SYNC=true apenas no primeiro deploy
          synchronize: config.get<string>('TYPEORM_SYNC') === 'true',
        };
      },
    }),

    ObrasModule,
    DashboardModule,
    AuthModule,
    UsuariosModule,
    FuncionariosModule,
    FornecedoresModule,
    MateriaisModule,
    EquipamentosModule,
    CustosModule,
    RelatoriosModule,
    Modelo3dModule,
    DiarioModule,
    AlertasModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}