import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * DTO reutilizável para paginação via query params.
 *
 * Uso no controller:
 *   @Get()
 *   findAll(@Query() pagination: PaginationDto) { ... }
 *
 * Uso no service:
 *   const { skip, take } = pagination.toQuery();
 *   repository.find({ skip, take });
 */
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  /** Retorna os valores prontos para o TypeORM */
  toQuery(): { skip: number; take: number } {
    const page  = this.page  ?? 1;
    const limit = this.limit ?? 20;
    return {
      skip: (page - 1) * limit,
      take: limit,
    };
  }
}

/** Envolve a resposta paginada num envelope padrão */
export interface PaginatedResult<T> {
  data:       T[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export function toPaginatedResult<T>(
  [data, total]: [T[], number],
  pagination: PaginationDto,
): PaginatedResult<T> {
  const limit = pagination.limit ?? 20;
  const page  = pagination.page  ?? 1;
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
