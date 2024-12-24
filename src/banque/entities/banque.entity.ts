/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import  mongoose, { Document, Types } from "mongoose";
@Schema()
export class Banque extends Document {
@Prop()
  nom:string;
  @Prop()
  email:string;

  @Prop()
  password:string;

  @Prop()
  username:string;

  @Prop()
  numero : string ;

  @Prop()
  capital: number ;

  @Prop()
  adresseSiege: string ;

  @Prop()
  ville:string ;

  @Prop()
  logo:string;

    @Prop()
  code :string;
    @Prop({default : false })
  verify : boolean ;
  	@Prop()
  refreshToken: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Personne' }] })
  employeId : Types.ObjectId[]

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CompteBancaire' }] })
  compteBancaireId : Types.ObjectId[]

  
    
}
export const BanqueSchema = SchemaFactory.createForClass(Banque);
