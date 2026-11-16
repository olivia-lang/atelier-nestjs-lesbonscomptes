import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation} from "typeorm";
import {Portemonnaie} from "./porte-monnaies.entity.js";
import {Depense} from "../../depenses/depenses.entity.js";
import {Compte} from "../../comptes/comptes.entity.js";

// TODO : transformer cette classe en entité TypeORM
// et ajouter le bon décorateur sur chaque champ
export class Participer {
    // clé primaire générée automatiquement
    id: number;

    // date (sans l'heure)
    dateInvitation: Date;

    // date (sans l'heure), vide tant que l'invitation n'est pas acceptée
    dateAccepte: Date | null;

    // le porte-monnaie associé
    portemonnaie: Relation<Portemonnaie>;

    // le compte qui participe
    compte: Relation<Compte>;
}
