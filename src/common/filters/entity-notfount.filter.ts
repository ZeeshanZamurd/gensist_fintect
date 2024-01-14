import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter implements ExceptionFilter {
  public catch(exception: EntityNotFoundError, host: ArgumentsHost): Response {
    const response = host.switchToHttp().getResponse<Response>();
    return response.status(400).json({
      statusCode: 400,
      error: ' Not Found',
      message: 'record not found',
    });
  }
}
