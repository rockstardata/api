import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();
//import { execSync } from 'child_process';
// try {
//   console.log('⏳ Sincronizando datos antes de iniciar la app...');
//   execSync('node scripts/sync-all.js', { stdio: 'inherit' });
//   console.log('✅ Sincronización de datos completada.');
// } catch (error) {
//   console.error('❌ Error al sincronizar datos:', error.message);
// }
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('API ROCKSTARDATA')
    .setDescription('Documentación de la API ROCKSTARDATA.')
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
bootstrap().catch((err) => console.error('Application failed to start', err));
