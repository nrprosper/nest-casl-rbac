import { SetMetadata } from '@nestjs/common';
import { Action, Subject } from '../entities/permission.entity';
import { RequiredRule } from '../interfaces/required-rule.interface';

export const CHECK_ABILITY_KEY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY_KEY, requirements);

export const Can = (action: Action, subject: Subject): RequiredRule => ({
  action,
  subject,
});