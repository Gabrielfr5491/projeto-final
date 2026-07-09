import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modelo3d } from './entities/modelo3d.entity';
import { CreateModelo3dDto } from './dto/create-modelo3d.dto';
import { UpdateModelo3dDto } from './dto/update-modelo3d.dto';

@Injectable()
export class Modelo3dService {
  constructor(
    @InjectRepository(Modelo3d)
    private readonly repo: Repository<Modelo3d>,
  ) {}

  create(dto: CreateModelo3dDto): Promise<Modelo3d> {
    const modelo = this.repo.create(dto);
    return this.repo.save(modelo);
  }

  findAll(): Promise<Modelo3d[]> {
    return this.repo.find({ order: { criadoEm: 'DESC' } });
  }

  findByObra(obraId: number): Promise<Modelo3d[]> {
    return this.repo.find({
      where: { obraId },
      order: { criadoEm: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Modelo3d> {
    const modelo = await this.repo.findOne({ where: { id } });
    if (!modelo) throw new NotFoundException(`Modelo 3D #${id} não encontrado`);
    return modelo;
  }

  async update(id: number, dto: UpdateModelo3dDto): Promise<Modelo3d> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.repo.delete(id);
    return { message: 'Modelo 3D removido com sucesso' };
  }
}
