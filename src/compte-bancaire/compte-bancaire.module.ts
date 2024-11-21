/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { CompteBancaireService } from './compte-bancaire.service';
import { CompteBancaireController } from './compte-bancaire.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CompteBancaireSchema } from './entities/compte-bancaire.entity';
import { PersonneSchema } from 'src/personne/entities/personne.entity';
import { BanqueSchema } from 'src/banque/entities/banque.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'CompteBancaire',
        schema: CompteBancaireSchema,
      },
        {
        name: 'Personne',
        schema: PersonneSchema,
      },
      {
        name: 'Banque',
        schema: BanqueSchema,
      }
    ])
  ],
  controllers: [CompteBancaireController],
  providers: [CompteBancaireService],
})
export class CompteBancaireModule {}
