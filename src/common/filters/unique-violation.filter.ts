import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { DBErrorCode } from '../enum/db-error-code.enum';

@Catch(QueryFailedError)
export class UniqueViolationErrorFilter extends BaseExceptionFilter {
  protected readonly POSTGRES_UNIQUE_VIOLATION = DBErrorCode.PgUniqueConstraintViolation; // https://www.postgresql.org/docs/14/errcodes-appendix.html

  public catch(exception: QueryFailedError, host: ArgumentsHost): Response {
    const response = host.switchToHttp().getResponse<Response>();
    if (exception['code'] === this.POSTGRES_UNIQUE_VIOLATION) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        error: 'CONFLICT',
        message: 'duplicate record',
        // errorMessage: exception.message,
      });
    } else {
      super.catch(exception, host);
    }
  }
}
