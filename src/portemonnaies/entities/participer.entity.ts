import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation} from "typeorm";
import {Portemonnaie} from "./porte-monnaies.entity.js";
import {Depense} from "../../depenses/depenses.entity.js";
import {Compte} from "../../comptes/comptes.entity.js";

export class Participer {

    // TODO
    // Nous souhaitons avoir un id (primary key), 
    // une date d'invitation (date), une date d'acceptation (date, null autorisé), 
    // le portemonnaie associé et le compte qui participe
}