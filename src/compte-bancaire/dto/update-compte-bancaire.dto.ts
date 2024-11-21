import { PartialType } from '@nestjs/mapped-types';
import { CreateCompteBancaireDto } from './create-compte-bancaire.dto';

export class UpdateCompteBancaireDto extends PartialType(CreateCompteBancaireDto) {}
