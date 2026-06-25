import { PartialType } from '@nestjs/mapped-types';
import { CreateCustoDto } from './create-custo.dto';

export class UpdateCustoDto extends PartialType(
  CreateCustoDto
) {}