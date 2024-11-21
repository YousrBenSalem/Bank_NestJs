/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import mongoose, { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { IClient } from './interface/client.interface';
import { IEmploye } from 'src/employe/interface/employe.interface';
import * as argon2 from "argon2";
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';  

@Injectable()
export class ClientService {
  constructor (
  @InjectModel("Personne") private clientModel :Model<IClient> ,
  @InjectModel("Personne") private employeModel :Model<IEmploye> ,
    private mailerService : MailerService ,
){}

      hashData(data: string) {
    return argon2.hash(data);
  }

    // fonction pour generate un code de verification d'email avec crypto
  async generateCode() : Promise <string> {
    return crypto.randomBytes(3).toString('hex').toUpperCase();

    }
  
// fonction for create a new client
async createClient (
  createClientDto:CreateClientDto 
):Promise<IClient>{

     const hashedPassword = await this.hashData(createClientDto.password);

      const code = await this.generateCode();

     const newClient = await new this.clientModel({... createClientDto, password:hashedPassword, code :code}); 

        // envoi du code de verification par email
       const mailOptions = {
      from: '"yousrbensalem@gmail.com"',
      to: createClientDto.email,
      subject: 'Vérification de votre adresse email',
      text: `Votre code de vérification est : ${code}`,
      html: `<p>Votre code de vérification est : <strong><a href=http://localhost:3000/personne/verify/${code}>${code}</a></strong></p>`,
    };
      await this.mailerService.sendMail(mailOptions);
  
  //const newClient = new this.clientModel(createClientDto);
  const savedClient = await newClient.save() as IClient;

  const employeData = await this.employeModel.findById(createClientDto.employeId);

  if(employeData){
    employeData.clientId.push(savedClient._id as mongoose.Types.ObjectId);
    const savedEmploye = await employeData.save();
    console.log(savedEmploye)

  }else{
    throw new NotFoundException('Employe not found');
  }

  return savedClient;
} 

// fonction for update client 
async updateClient (
  clientId:string , upadetClientDto:UpdateClientDto
):Promise<IClient>{
  const existingClient = await this.clientModel.findById(clientId);
  if(!existingClient){
    throw new NotFoundException ( `Client #${clientId} not found`);
  }
  // Assignez les modifications
    Object.assign(existingClient, upadetClientDto);

    // Sauvegardez les changements
    return await existingClient.save();
}

// fonction to get client by id 
async getClientById (clientId: string): Promise<IClient> {
  const existingClient = await this.clientModel.findById(clientId).exec();
  if (!existingClient) {
    throw new NotFoundException(`Client #${clientId} not found`);
    }
    return existingClient ;
}

//fonction to get all clients
async getAllClients ():Promise<IClient[]>{
  const clientData = await this.clientModel.find({item :"Client"});
  if (! clientData || clientData.length==0){
    throw new NotFoundException('No client found');
  }
  return clientData;
}

// function to delete clients
async deleteClient (clientId:string):Promise<IClient>{
   const deletedClient = await this.clientModel.findByIdAndDelete(clientId);

   if(! deletedClient){
    throw new NotFoundException(`Client #${clientId} not found`)
   }
   return deletedClient ;

}




}
