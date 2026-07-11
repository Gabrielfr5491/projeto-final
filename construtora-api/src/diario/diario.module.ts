import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DiarioController } from './diario.controller';
import { DiarioService } from './diario.service';
import { DiarioEntrada } from './entities/diario-entrada.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiarioEntrada])
  ],

  controllers: [DiarioController],

  providers: [DiarioService]
})
export class DiarioModule {}
