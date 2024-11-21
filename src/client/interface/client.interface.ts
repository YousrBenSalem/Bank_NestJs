/* eslint-disable prettier/prettier */

import { Types } from "mongoose";
import { IPersonne } from "src/personne/interface/personne.interface";

export interface IClient extends IPersonne {
     item : string;

  readonly numero:string ;

   compteBancaireId : Types.ObjectId []
     employeId : Types.ObjectId 





}