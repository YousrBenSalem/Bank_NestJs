/* eslint-disable prettier/prettier */
import { IsString } from "class-validator";
export class HachagePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;

}