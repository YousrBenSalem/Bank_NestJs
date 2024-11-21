/* eslint-disable prettier/prettier */

import { Types } from "mongoose";
import { IPersonne } from "src/personne/interface/personne.interface";
 export interface IEmploye extends IPersonne {
    readonly salaire:number ;
    readonly numINSEE:number ;
     item : string;
    readonly banqueId:Types.ObjectId ;
       clientId: Types.ObjectId[];


 }