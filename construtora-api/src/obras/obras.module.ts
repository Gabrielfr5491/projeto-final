import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ObrasService } from './obras.service';
import { ObrasController } from './obras.controller';
import { Obra } from './entities/obra.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Obra])
  ],
  controllers: [ObrasController],
  providers: [ObrasService],
})
export class ObrasModule {}