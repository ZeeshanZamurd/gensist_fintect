import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!roles) {
        request['user'] = payload;
        return true;
      }
      const role = payload.role;
      const hasRole = (): boolean => roles.indexOf(role) > -1; //we should get user from database here so that we can confirm the user really have the right role
      let hasPermission = false;
      if (hasRole()) {
        hasPermission = true;
      }
      request['user'] = payload;
      return hasPermission && role;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
