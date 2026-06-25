import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MateriaisService } from './materiais.service';
import { CreateMaterialDto } from './dto/create-materiai.dto';
import { UpdateMaterialDto } from './dto/update-materiai.dto';

@Controller('materiais')
export class MateriaisController {
  constructor(private readonly materiaisService: MateriaisService) {}

  @Post()
  create(@Body() createMateriaiDto: CreateMaterialDto) {
    return this.materiaisService.create(createMateriaiDto);
  }

  @Get()
  findAll() {
    return this.materiaisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materiaisService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMateriaiDto: UpdateMaterialDto) {
    return this.materiaisService.update(+id, updateMateriaiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materiaisService.remove(+id);
  }
}
