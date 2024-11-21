/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { PersonneModule } from 'src/personne/personne.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
    imports: [JwtModule.register({}) ,
              MailerModule.forRoot({  
      transport: {  
        host: 'sandbox.smtp.mailtrap.io',  
        port: Number('2525'),  
        secure: false,  
        auth: {  
          user: '5eb65c03cb943e',  
          pass: '0d8fa1526d3e9d',  
        },  
      },  
      defaults: {  
        from: '"Yosr ben salem" <yousrbensalem@gmail.com>',  
      },  
    
    }),   PersonneModule],

  controllers: [AuthController],
  providers: [AuthService , AccessTokenStrategy , RefreshTokenStrategy],
})
export class AuthModule {}
