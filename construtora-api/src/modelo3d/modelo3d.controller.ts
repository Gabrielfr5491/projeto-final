import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Modelo3dService } from './modelo3d.service';
import { CreateModelo3dDto } from './dto/create-modelo3d.dto';
import { UpdateModelo3dDto } from './dto/update-modelo3d.dto';

@Controller('modelo3d')
export class Modelo3dController {
  constructor(private readonly service: Modelo3dService) {}

  @Post()
  create(@Body() dto: CreateModelo3dDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('obra/:obraId')
  findByObra(@Param('obraId') obraId: string) {
    return this.service.findByObra(+obraId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateModelo3dDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
