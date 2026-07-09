import { PartialType } from '@nestjs/mapped-types';
import { CreateModelo3dDto } from './create-modelo3d.dto';

export class UpdateModelo3dDto extends PartialType(CreateModelo3dDto) {}
