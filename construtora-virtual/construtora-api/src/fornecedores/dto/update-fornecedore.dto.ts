import { PartialType } from '@nestjs/mapped-types';

import { CreateFornecedorDto }
from './create-fornecedore.dto';

export class UpdateFornecedorDto
extends PartialType(
  CreateFornecedorDto
) {}