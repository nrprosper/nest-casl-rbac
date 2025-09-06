import { CanActivate, ExecutionContext, ForbiddenException, Injectable, } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory';
import { RequiredRule } from '../interfaces/required-rule.interface';
import { CHECK_ABILITY_KEY } from '../decorators/abilities.decorator';
import { User } from '../entities/user.entity';

@Injectable()
export class AbilitiesGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const rules = this.reflector.get<RequiredRule[]>(CHECK_ABILITY_KEY, context.getHandler()) || [];

    if (rules.length === 0) {
      return true;
    }

    const request: {user?: User} = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (!user) {
      throw new ForbiddenException('User not Authenticated');
    }

    const ability = this.caslAbilityFactory.createForUser(user);

    for (const rule of rules) {
      const isAllowed = ability.can(rule.action, this.caslAbilityFactory.mapSubjectToType(rule.subject));
      if (!isAllowed) {
        throw new ForbiddenException(
          `Insufficient permissions: Cannot ${rule.action} ${rule.subject}`,
        );
      }
    }

    return true;
  }
}