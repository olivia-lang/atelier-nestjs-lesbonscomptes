import { ApiPropertyOptional } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, Matches, MaxLength, MinLength} from 'class-validator';

export class CreateCompteDto {
    // TODO
    // un pseudo (minimum 3 caractères, maximum 30 cractères) 
    // un prenom
    // un email 
    // un mot de passe (minimum 8 caractères)
}
