import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService], // Agrega el servicio de correo electrónico como proveedor
  exports: [EmailService], // Exporta el servicio para que esté disponible en otros módulos
})
export class EmailModule {}
