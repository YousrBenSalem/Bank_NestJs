/* eslint-disable prettier/prettier */

import {  IsString } from "class-validator";
import { Types } from "mongoose";
import { CreatePersonneDto } from "src/personne/dto/create-personne.dto";
export class CreateClientDto extends CreatePersonneDto {
     item : string;

  @IsString()
  readonly numero: string;

   compteBancaireId : Types.ObjectId[];
  employeId : Types.ObjectId 




}
