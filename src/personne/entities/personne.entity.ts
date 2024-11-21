/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
//import * as argon2 from'argon2';

@Schema({discriminatorKey :'item'})
export class Personne extends Document{
@Prop()
nom: string;

@Prop()
prenom: string;

@Prop()
adresse :string ;

@Prop()
image : string ;

@Prop()
cin : string ;

@Prop()
email : string ;

@Prop()
username : string ;

@Prop()
password : string ;

@Prop()
photoCin : string ;

@Prop()
autreFichier : string[] ;

@Prop()
refreshToken : string ;
  @Prop()
  code : string ;
  
  @Prop({default : false })
  verify : boolean ;
}

export const PersonneSchema = SchemaFactory.createForClass(Personne)

/* .pre('save', async function (){
  this.password = await argon2.hash(this.password)
}); */
