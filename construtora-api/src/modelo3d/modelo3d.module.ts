import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modelo3d } from './entities/modelo3d.entity';
import { Modelo3dService } from './modelo3d.service';
import { Modelo3dController } from './modelo3d.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Modelo3d])],
  controllers: [Modelo3dController],
  providers: [Modelo3dService],
  exports: [Modelo3dService],
})
export class Modelo3dModule {}
