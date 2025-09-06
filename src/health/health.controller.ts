import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('HealthCheck Controller')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  @Version(VERSION_NEUTRAL)
  check() {
    return this.health.check([
      () => this.db.pingCheck('database')
    ]);
  }

}
