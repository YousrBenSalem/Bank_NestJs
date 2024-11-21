/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BanqueModule } from './banque/banque.module';
import { CompteBancaireModule } from './compte-bancaire/compte-bancaire.module';
import { ClientModule } from './client/client.module';
import { PersonneModule } from './personne/personne.module';
import { EmployeModule } from './employe/employe.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017',{dbName:'BankProject'}),
    BanqueModule,
    CompteBancaireModule,
    ClientModule,
    PersonneModule,
    EmployeModule,
    AuthModule,
    ConfigModule.forRoot({isGlobal : true})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
