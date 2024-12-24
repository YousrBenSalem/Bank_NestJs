/* eslint-disable prettier/prettier */
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PersonneService } from 'src/personne/personne.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import { MailerService } from '@nestjs-modules/mailer'; 
import { BanqueService } from 'src/banque/banque.service';

@Injectable()
export class AuthService {
    constructor(
    private usersService: PersonneService,
      private bankService: BanqueService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService : MailerService ,
  ) {}

	async signIn(data: AuthDto) {
    // Check if user exists
    const user = await this.usersService.findByUsername(data.email);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user._id.toString(), user.username);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);
    return tokens;
  }
  	async signInBank(data: AuthDto) {
    // Check if user exists
    const user = await this.bankService.findByUsername(data.email);
    if (!user) throw new BadRequestException('bank does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user?._id.toString(), user.username);
    await this.updateRefreshTokenBank(user?._id.toString(), tokens.refreshToken);
    return {tokens, user};
  }


  	async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null });
  }


    hashData(data: string) {
    return argon2.hash(data);
  }
    async updateRefreshTokenBank(bankId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.bankService.updateBank(bankId, {
      refreshToken: hashedRefreshToken,
    });
  }

    async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }


  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }


  async refreshTokens(userId: string, refreshToken: string) {
  const user = await this.usersService.findById(userId);
  if (!user || !user.refreshToken)
    throw new ForbiddenException('Access Denied');
  const refreshTokenMatches = await argon2.verify(
    user.refreshToken,
    refreshToken,
  );
  if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
  const tokens = await this.getTokens(user.id, user.username);
  await this.updateRefreshToken(user.id, tokens.refreshToken);
  return tokens;
}

    // forget password
    async forgetPassword ( email : string){
      try {
          const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
        }
    else {
      //create new token 
      const token = await this.jwtService.sign({
        id: user._id,  
      },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '5m',
        },)
       // update token
       await this.usersService.updateToken(user._id, token);
       // send email 
       const option = {
        to : user.email ,
        subject : 'Forget Password',
        template: './forgot-password', 
        context: {  
        token : token      },  
        html : `<h1> Update u password </h1> <a href=http://localhost:3000/${token}>Click here ${token}</a>`
       }
           await this.mailerService.sendMail(option)

           return {success: true , 
            message : "You can change your password ",
            data : user 
           }


    }
      
      } catch (err) {
        return err ;
        
      }
    }

        // reset password 
    async resetPassword (token : string, newPassword : string){
      try {
        const decoded = await this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          });
          if (!decoded) {
            throw new UnauthorizedException('Invalid token');
            }
            const user = await this.usersService.findById(decoded.id);
            if (!user) {
              throw new NotFoundException('User not found');
              }
              const hashedPassword = await argon2.hash(newPassword);
                user.password = hashedPassword;
                user.refreshToken = undefined ;
                await user.save();
              return {success: true ,
                message : "Password updated successfully",
                data : user
                }
                } catch (err) {
                  return {
                    success: false ,
                    message : "invalid token"+err ,
                    data:null
                  }
                }
    }
    



}
