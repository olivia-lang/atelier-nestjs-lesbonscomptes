import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation} from "typeorm";
import {Portemonnaie} from "./porte-monnaies.entity.js";
import {Depense} from "../../depenses/depenses.entity.js";
import {Compte} from "../../comptes/comptes.entity.js";

// TODO : transformer cette classe en entité TypeORM
// et ajouter le bon décorateur sur chaque champ
// les numéros 1 à 6 montrent où il manque un décorateur
// 1
export class Participer {
    // 2
    id: number;

    // 3
    dateInvitation: Date;

    // 4
    dateAccepte: Date | null;

    // 5
    portemonnaie: Relation<Portemonnaie>;

    // 6
    compte: Relation<Compte>;
}
