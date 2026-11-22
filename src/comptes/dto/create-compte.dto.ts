import {IsEmail, IsNotEmpty, MaxLength, MinLength} from 'class-validator';

export class CreateCompteDto {
    @IsNotEmpty({ message: 'Le prénom est obligatoire' })
    prenom: string;

    // TODO
    // un pseudo (minimum 3 caractères, maximum 30 caractères)
    // un email
    // un mot de passe (minimum 8 caractères)
}
