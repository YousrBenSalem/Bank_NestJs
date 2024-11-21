/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompteBancaireDto } from './dto/create-compte-bancaire.dto';
import { UpdateCompteBancaireDto } from './dto/update-compte-bancaire.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IComptebancaire } from './interface/compteBancaire.interface';
import mongoose, { Model } from 'mongoose';
import { IClient } from 'src/client/interface/client.interface';
import { IBanque } from 'src/banque/interface/banque.interface';

@Injectable()
export class CompteBancaireService {
  constructor(
    @InjectModel ('CompteBancaire') private compteBancaireModel : Model<IComptebancaire>, 
    @InjectModel ('Personne') private ClientModel : Model<IClient>,
    @InjectModel ('Banque') private BanqueModel : Model<IBanque>
  ){}

  // fonction to  create new compte bancaire 
  async createCompteBancaire (createCompteBancaireDto: CreateCompteBancaireDto):Promise <IComptebancaire> {
    const newCompteBancaire = await new this.compteBancaireModel(createCompteBancaireDto);
    const savedCompteBancaire = await newCompteBancaire.save() as IComptebancaire;

    const clientData = await this.ClientModel.findById(createCompteBancaireDto.clientId);
    if (clientData){
      clientData.compteBancaireId.push(savedCompteBancaire._id as mongoose.Types.ObjectId )
      const savedClient = await clientData.save() ;
      console.log(savedClient)
    }else{
      console.log('client not found')
    }

        /* const bankData = await this.BanqueModel.findById(createCompteBancaireDto.banqueId);
    if (bankData){
      bankData.compteBancaireId.push(savedCompteBancaire._id as mongoose.Types.ObjectId )
      const savedBank = await bankData.save() ;
      console.log(savedBank)
    }else{
      console.log('client not found')
    } */

      await this.BanqueModel.findByIdAndUpdate({
        _id:createCompteBancaireDto.banqueId
      },{$push:{compteBancaireId :newCompteBancaire._id }})
      await newCompteBancaire.save();

    return  savedCompteBancaire ;
  }

  // fonction to  update  compte bancaire 
async UpdateCompteBancaire (
  compteBancaireId : string ,
  updateCompteBancaireDto : UpdateCompteBancaireDto
):Promise<IComptebancaire>{
  const existingCompteBancaire = await this.compteBancaireModel.findByIdAndUpdate(compteBancaireId , updateCompteBancaireDto, {new:true});
  if(!existingCompteBancaire){
    throw new NotFoundException (`compte bancaire #${compteBancaireId} not found`)
  }
  return existingCompteBancaire ;
}

  // fonction to  get all compte bancaire 
async getAllComptesBancaire():Promise<IComptebancaire[]>{
  const compteBancaireData = await  this.compteBancaireModel.find();
  if(!compteBancaireData || compteBancaireData.length==0){
    throw new NotFoundException (`compte bancaire not found`)
  }
  return compteBancaireData ;
}

  // fonction to  get  compte bancaire by id
async getCompteBnacaireById(compteBancaireId : string): Promise <IComptebancaire>{
  const compteBancaireData = await this.compteBancaireModel.findById(compteBancaireId).exec();
  if(!compteBancaireData){
    throw new NotFoundException (`compte bancaire #${compteBancaireId} not
      found`)
}
return compteBancaireData ;
}

 // function to delete compte bancaire 
 async deleteCompteBancaire(compteBancaireId : string): Promise <IComptebancaire>{
  const DeletedCompteBancaire = await this.compteBancaireModel.findByIdAndDelete(compteBancaireId);
  if (!DeletedCompteBancaire){
    throw new NotFoundException (`compte bancaire #${compteBancaireId} not
      found`)

  }
  const clientData = await this.ClientModel.findById(DeletedCompteBancaire.clientId)
  if(clientData){
    clientData.compteBancaireId = clientData.compteBancaireId.filter ( compId =>compId.toString() !== compteBancaireId )
    await clientData.save()

  }else  {
    throw new NotFoundException (`client #${compteBancaireId} not found`)
  }

    const bankData = await this.BanqueModel.findById(DeletedCompteBancaire.banqueId)
  if(bankData){
    bankData.compteBancaireId = bankData.compteBancaireId.filter ( bankId =>bankId.toString() !== compteBancaireId )
    await bankData.save()

  }else  {
    throw new NotFoundException (`client #${compteBancaireId} not found`)
  } 

    
/*       await this.BanqueModel.findByIdAndUpdate({
        _id:DeletedCompteBancaire.banqueId
      },{$pull:{compteBancaireId :compteBancaireId }},{new :true})
      await DeletedCompteBancaire.save(); */


  return    DeletedCompteBancaire;
;
 }
}
