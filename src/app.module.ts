import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
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
@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule,
    MailerModule.forRoot({
      transport: {
        service: 'Gmail',
        auth: {
          user: 'critijo@gmail.com',
          pass: 'rujt irkh zwfj uzbl',
        },
      },
      defaults: {
        from: 'critijo@gmail.com',
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
  ],
  controllers: [AppController],
  providers: [AppService, EmailService, CronJobService, JwtStrategy],
  exports: [CronJobService, EmailService],
})
export class AppModule {}
