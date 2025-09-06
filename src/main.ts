import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const apiPrefix = 'api';

  const config = new DocumentBuilder()
    .setTitle('NESTJS CASL RBAC')
    .addServer('http://localhost:3000', 'Local Server')
    .setDescription(`
        Mini Blog API with Role-Based Access Control (RBAC).
      
        This API combines NestJS, Passport, and CASL to provide secure and flexible access control.
    `)
    .setVersion('1.0')
    .build();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'NESTJS CASL RBAC API',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.setGlobalPrefix(apiPrefix, {
    exclude: ['/', 'api/v1'],
  });

  await app.listen(process.env.APP_PORT ?? 3000);
}

bootstrap();
