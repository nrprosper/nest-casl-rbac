import { Action, Subject } from '../entities/permission.entity';

export interface RequiredRule {
  action: Action;
  subject: Subject;
}