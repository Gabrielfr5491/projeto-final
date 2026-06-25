import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterialDto } from './create-materiai.dto';

export class UpdateMaterialDto extends PartialType(
  CreateMaterialDto
) {}