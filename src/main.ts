import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('API de Gestión')
    .setDescription('Documentación de la API para el sistema de gestión.')
    .setVersion('1.0')
    .addBearerAuth() // Importante si usas autenticación JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // La ruta para acceder a la documentación será http://localhost:PUERTO/docs
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { docExpansion: 'none' },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
