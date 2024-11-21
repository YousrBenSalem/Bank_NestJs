/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Param, Delete, Res, HttpStatus, Put } from '@nestjs/common';
import { CompteBancaireService } from './compte-bancaire.service';
import { CreateCompteBancaireDto } from './dto/create-compte-bancaire.dto';
import { UpdateCompteBancaireDto } from './dto/update-compte-bancaire.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
@ApiTags('compte-bancaire')

@Controller('compte-bancaire')
export class CompteBancaireController {
  constructor(private readonly compteBancaireService: CompteBancaireService) {}

  @ApiBody({
  schema:{
    type: 'object',
    properties: {
      numero: { type: 'string' },
      solde:{type:'number'},
      dateOuverture :{type:'string'},
      item:{
        type : 'string',
        default:'Employe'
      },
      clientId:{
        type:'string'
      },
      banqueId:{
        type:'string'
      }

    }
  }
})
  @Post()
  async createAccount(
    @Res()  response ,
    @Body() createCompteBancaireDto: CreateCompteBancaireDto,
  ){
    try {
      const newAccount = await this.compteBancaireService.createCompteBancaire(createCompteBancaireDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Account created successfully',
        newAccount,
      })
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode :400,
        message: 'Error creating account'+err,
        })  
    }
  }
  @ApiBody({
  schema:{
    type: 'object',
    properties: {
      numero: { type: 'string' },
      solde:{type:'number'},
      dateOuverture :{type:'string'},
      item:{
        type : 'string',
        default:'Employe'
      },
    

    }
  }
})
  @Put('/:id')
  async updateAccount(
    @Res()  response ,
    @Param('id') compteBancaireId: string,
    @Body() updateCompteBancaireDto:UpdateCompteBancaireDto,
  ){
    try {
      const updatedaccount = await this.compteBancaireService.UpdateCompteBancaire(compteBancaireId, updateCompteBancaireDto);
      return response.status(HttpStatus.OK).json({
        message: 'account updated successfully',
        updatedaccount,
      })
      
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err.response)
    }
  }

  @Get()
  async getAllAccounts(@Res() response) {
    try {
      const accountsData = await this.compteBancaireService.getAllComptesBancaire();
      return response.status(HttpStatus.OK).json({
        message: 'Accounts retrieved successfully',
        accountsData
      });
    } catch (err) {
      return response.status(err.status).json(err.response)
      
    }
  }

  @Get('/:id')
  async getAccountById(@Res() response, @Param('id') accountId: string){
    try {
      const accountData = await this.compteBancaireService.getCompteBnacaireById(accountId);
      return response.status(HttpStatus.OK).json({
        message: 'account retrieved successfully',
        accountData,
      })
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err.response)
      
    }
  }

  @Delete('/:id')
  async deleteAccount(@Res() response, @Param('id') accountId: string) {
    try {
      const deletedAccount = await this.compteBancaireService.deleteCompteBancaire(accountId);
      return response.status(HttpStatus.OK).json({
        message: 'account deleted successfully',
        deletedAccount,  
        })
      
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err.response)
      
    }
  }
}
