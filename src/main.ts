import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { EntityNotFoundErrorFilter } from './common/filters/entity-notfount.filter';
import { UniqueViolationErrorFilter } from './common/filters/unique-violation.filter';
import { HttpErrorFilter } from './common/filters/httpexception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpErrorFilter());
  app.useGlobalFilters(new UniqueViolationErrorFilter(httpAdapter));
  app.useGlobalFilters(new EntityNotFoundErrorFilter());

  await app.listen(3000);
}
bootstrap();
