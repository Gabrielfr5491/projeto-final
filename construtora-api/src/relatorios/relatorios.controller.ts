import { Controller, Get, Query } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';

@Controller('relatorios')
export class RelatoriosController {

  constructor(
    private readonly relatoriosService: RelatoriosService,
  ) {}

  @Get('custos-obra')
  custosPorObra() {
    return this.relatoriosService.custosPorObra();
  }

  @Get('financeiro')
  relatorioFinanceiro(@Query('obraId') obraId?: string) {
    return this.relatoriosService.relatorioFinanceiro(
      obraId ? Number(obraId) : undefined,
    );
  }

  @Get('funcionarios')
  relatorioFuncionarios() {
    return this.relatoriosService.relatorioFuncionarios();
  }

  @Get('materiais')
  relatorioMateriais() {
    return this.relatoriosService.relatorioMateriais();
  }

  @Get('equipamentos')
  relatorioEquipamentos() {
    return this.relatoriosService.relatorioEquipamentos();
  }

  @Get('obras')
  relatorioObras() {
    return this.relatoriosService.relatorioObras();
  }

}
