/* eslint-disable prettier/prettier */

import { IsString } from "class-validator";

export class CreatePersonneDto  {
    @IsString()
  readonly nom:string ;
      @IsString()
readonly prenom:string ;
      @IsString()
readonly adresse:string ;
      @IsString()
 image:string ;
      @IsString()
readonly cin:string ;
      @IsString()
 photoCin:string ;

 @IsString()
   readonly username : string ;

   @IsString()
readonly email:string ;
      @IsString()
  password:string ;
      @IsString()
 autreFichier:string[] ;

 @IsString()
 refreshToken : string ;
       code : string ;
    verify : boolean ;


}

