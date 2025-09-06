import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { CaslModule } from './casl/casl.module';
import { ConfigModule } from '@nestjs/config';
import DataSource from '../db/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => DataSource.options
    }),
    AuthModule,
    BlogModule,
    CaslModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
