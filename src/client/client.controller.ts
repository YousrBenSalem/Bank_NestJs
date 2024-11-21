/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Param, Delete, Res, HttpStatus, Put, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
@ApiTags('client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema:{
    type: 'object',
    properties: {
      name: { type: 'string' },
      prenom:{type:'string'},
      adresse :{type:'string'},
      email:{type:'string'},
      password :{type:'string'},
      image:{
        type:'string',
        format: 'binary',
      },
      cin:{type:'string'},
      photoCin:{
        type:'string',
        format: 'binary',
      },
      autreFichier:{
        type:'array',
        items:{
          type:'string',
          format: 'binary',
        }
      },
      numero:{
        type:'string',
      },
      item:{
        type : 'string',
        default:'Client'
      },
      employeId:{
        type:'string',
      }

    }
  }
})
  @Post()
    @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 }, 
        { name: 'photoCin', maxCount: 1 }, 
        { name: 'autreFichier', maxCount: 5 }, 
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            cb(null, `${new Date().getTime()}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async createClient(
    @Res()  response ,
    @Body() createClientDto: CreateClientDto,
    @UploadedFiles() files: {
      image;
      photoCin;
      autreFichier;
    },
  ){
          //console.log(files); 

    try {
      createClientDto.image = files.image && files.image[0] ? files.image[0].filename : null;
          console.log('Image filename:', createClientDto.image);

      createClientDto.photoCin = files.photoCin &&  files.photoCin[0] ? files.photoCin[0].filename : null;

          console.log('PhotoCin filename:', createClientDto.photoCin);


      
      if (files.autreFichier) {
        createClientDto.autreFichier = files.autreFichier.map((file) => file.filename);
              console.log('AutreFichier filenames:', createClientDto.autreFichier);

      } else {
        createClientDto.autreFichier = [];
      }
      
      const newClient = await this.clientService.createClient(createClientDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Client created successfully',
        newClient,
      })
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode :400,
        message: 'Error creating client'+err,
        })  
    }
  }
  @ApiConsumes('multipart/form-data')
@ApiBody({
  schema:{
    type: 'object',
    properties: {
      name: { type: 'string' },
      prenom:{type:'string'},
      adresse :{type:'string'},
      email:{type:'string'},
      password :{type:'string'},
      image:{
        type:'string',
        format: 'binary',
      },
      cin:{type:'string'},
      photoCin:{
        type:'string',
        format: 'binary',
      },
      autreFichier:{
        type:'array',
        items:{
          type:'string',
          format: 'binary',
        }
      },
      numero:{
        type:'string',
      },
      item:{
        type : 'string',
        default:'Client'
      }

    }
  }
})
  @Put('/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 }, 
        { name: 'photoCin', maxCount: 1 }, 
        { name: 'autreFichier', maxCount: 5 }, 
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            cb(null, `${new Date().getTime()}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async updateClient(
    @Res()  response ,
    @Param('id') clientId: string,
    @Body() updateClientDto:UpdateClientDto,
    @UploadedFiles() files: {
      image;
      photoCin;
      autreFichier;
    },
  ){

    try {
      updateClientDto.image = files.image ? files.image[0].filename : null;
      updateClientDto.photoCin = files.photoCin ? files.photoCin[0].filename : null;

      updateClientDto.autreFichier= files.autreFichier ? files.autreFichier.map((file) => file.filename)
  : [];
    
      const updatedClient = await this.clientService.updateClient(clientId, updateClientDto);
      return response.status(HttpStatus.OK).json({
        message: 'Client updated successfully',
        updatedClient,
      })
      
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err.response)
    }
  }

  @Get('/:id')
  async getClientById(@Res() response, @Param('id') clientId: string){
    try {
      const clientData = await this.clientService.getClientById(clientId);
      return response.status(HttpStatus.OK).json({
        message: 'Client retrieved successfully',
        clientData,
      })
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err.response)
      
    }
  }
  
  @Get()
  async getAllClients(@Res() response) {
    try {
      const clientsData = await this.clientService.getAllClients();
      return response.status(HttpStatus.OK).json({
        message: 'Clients retrieved successfully',
        clientsData
      });
    } catch (err) {
      return response.status(err.status).json(err.response)
      
    }
  }


  @Delete('/:id')
  async deleteClient(@Res() response, @Param('id') clientId: string) {
    try {
      const deletedClient = await this.clientService.deleteClient(clientId);
      return response.status(HttpStatus.OK).json({
        message: 'Client deleted successfully',
        deletedClient,  
        })
      
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err.response)
      
    }
  }
  

  

  

  
}
