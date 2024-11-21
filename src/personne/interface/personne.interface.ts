/* eslint-disable prettier/prettier */

import { Document } from "mongoose";

export interface IPersonne extends Document {
  readonly nom:string ;
  readonly prenom:string ;
  readonly adresse:string ;
  readonly image:string ;
  readonly cin:string ;
  readonly username : string ;

  readonly photoCin:string ;
  readonly email:string ;
   password:string ;
  readonly autreFichier:string[] ;
  refreshToken : string ;
        code : string ;
    verify : boolean ;





}