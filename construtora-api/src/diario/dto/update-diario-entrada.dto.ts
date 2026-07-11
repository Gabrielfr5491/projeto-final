import { PartialType } from '@nestjs/mapped-types';
import { CreateDiarioEntradaDto } from './create-diario-entrada.dto';

export class UpdateDiarioEntradaDto extends PartialType(CreateDiarioEntradaDto) {}
