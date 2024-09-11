import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { ProductsModule } from './products/products.module';
import { ArticlesModule } from './articles/articles.module';
import { CategoriesProductsModule } from './categories-products/categories-products.module';
import { CategoriesArticlesModule } from './categories-articles/categories-articles.module';
import { BrotherhoodModule } from './brotherhood/brotherhood.module';
import { CategoriesBrotherhoodModule } from './categories-brotherhood/categories-brotherhood.module';
import { WallModule } from './wall/wall.module';
import { SkillsModule } from './skills/skills.module';
import { CronJobService } from './cron-job/cron-job.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { WebsocketModule } from './websockets/websocket.module';
import { EventsModule } from './events/events.module';
import { RolesGuard } from './guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import { SessionsModule } from './sessions/sessions.module';
import { ContactsModule } from './contacts/contacts.module';
import * as path from 'path';
import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import { SliderModule } from './slider/slider.module';
import { TelegramService } from './telegram/telegram.service';
import { TelegramModule } from './telegram/telegram.module';
import { LastreadingModule } from './lastreading/lastreading.module';
import { UsersreadingModule } from './usersreading/usersreading.module';
import { LanguageInterceptor } from './interceptors/language/language.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ImageService } from './image/image.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que el ConfigModule esté disponible globalmente
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, './i18n/'),
        watch: true,
      },
      resolvers: [
        // Utiliza HeaderResolver para obtener el idioma desde el encabezado 'lang'
        { use: HeaderResolver, options: ['lang'] },
      ],
    }),
    AuthModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule,
    MailerModule.forRoot({
      transport: {
        service: 'Gmail',
        auth: {
          user: 'RatWave1999@gmail.com',
          pass: 'mkdb ubsm inkx qixl',
        },
      },
      defaults: {
        from: 'RatWave1999@gmail.com',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    EmailModule,
    ProductsModule,
    ArticlesModule,
    CategoriesProductsModule,
    CategoriesArticlesModule,
    BrotherhoodModule,
    CategoriesBrotherhoodModule,
    WallModule,
    SkillsModule,
    WebsocketModule,
    EventsModule,
    SessionsModule,
    ContactsModule,
    SliderModule,
    TelegramModule,
    LastreadingModule,
    UsersreadingModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
    EmailService,
    CronJobService,
    JwtStrategy,
    Reflector,
    TelegramService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LanguageInterceptor, // Agregar el interceptor globalmente
    },
    ImageService,
  ],
  exports: [CronJobService, EmailService],
})
export class AppModule {}
