import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DefaultEmptyObjectPipe implements PipeTransform<unknown, unknown> {
  transform(value: unknown): unknown {
    if (typeof value !== 'undefined') return value;
    return {};
  }
}
