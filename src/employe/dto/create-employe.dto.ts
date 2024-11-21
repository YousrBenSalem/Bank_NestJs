/* eslint-disable prettier/prettier */



import { Type } from "class-transformer";
import { IsNumber } from "class-validator";
import { Types } from "mongoose";
import { CreatePersonneDto } from "src/personne/dto/create-personne.dto";
export class CreateEmployeDto extends CreatePersonneDto {
  @IsNumber()
  @Type(()=>Number)

readonly salaire:number ;
@IsNumber()
@Type(()=>Number)
readonly numINSEE:number ;

readonly banqueId:Types.ObjectId ;
   clientId: Types.ObjectId[];

item : string;
}
