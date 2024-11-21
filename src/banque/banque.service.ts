/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBanqueDto } from './dto/create-banque.dto';
import { UpdateBanqueDto } from './dto/update-banque.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IBanque } from './interface/banque.interface';
import { Model } from 'mongoose';

@Injectable()
export class BanqueService {
constructor (
  @InjectModel('Banque') private banqueModel :Model<IBanque> ,
){}

// fonction for create a new bank
async createBank (
  createBanqueDto:CreateBanqueDto 
):Promise<IBanque>{
  const newBank = new this.banqueModel(createBanqueDto);
  return newBank.save();
}

// fonction for update bank 
async updateBank (
  bankId:string , upadetBanqueDto:UpdateBanqueDto
):Promise<IBanque>{
  const existingBank = await this.banqueModel.findByIdAndUpdate(bankId, upadetBanqueDto ,{new:true});
  if(!existingBank){
    throw new NotFoundException ( `Bank #${bankId} not found`);
  }
  return existingBank ;
}

// fonction to get bank by id 
async getBankById (bankId: string): Promise<IBanque> {
  const existingBank = await this.banqueModel.findById(bankId).exec();
  if (!existingBank) {
    throw new NotFoundException(`Bank #${bankId} not found`);
    }
    return existingBank ;
}

//fonction to get all banks
async getAllBanks ():Promise<IBanque[]>{
  const bankData = await this.banqueModel.find();
  if (! bankData || bankData.length==0){
    throw new NotFoundException('No bank found');
  }
  return bankData;
}


// function to delete banks
async deleteBank (bankId:string):Promise<IBanque>{
   const deletedBank = await this.banqueModel.findByIdAndDelete(bankId);

   if(! deletedBank){
    throw new NotFoundException(`Bank #${bankId} not found`)
   }
   return deletedBank ;

}





}
