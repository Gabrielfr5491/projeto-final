import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FornecedoresController } from './fornecedores.controller';
import { FornecedoresService } from './fornecedores.service';

import { Fornecedor } from './entities/fornecedore.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Fornecedor
    ])
  ],

  controllers: [
    FornecedoresController
  ],

  providers: [
    FornecedoresService
  ]
})
export class FornecedoresModule {}