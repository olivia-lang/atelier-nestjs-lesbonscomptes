import {InjectRepository} from "@nestjs/typeorm";
import {Injectable, NotFoundException, NotImplementedException} from "@nestjs/common";
import {Participer} from "../portemonnaies/entities/participer.entity.js";
import {IsNull, Repository} from "typeorm";

@Injectable()
export class InvitationsService {
    constructor(@InjectRepository(Participer) private participerRepository: Repository<Participer>,) {
    }

    // invitations reçues par le compte et pas encore acceptées
    findInvitations(compteId: number): Promise<Participer[]> {
        // TODO
        throw new NotImplementedException();
    }

    async accepter(id: number, compteId: number): Promise<Participer> {
        // TODO
        throw new NotImplementedException();
    }

    async refuser(id: number, compteId: number): Promise<void> {
        // TODO
        throw new NotImplementedException();
    }

    private async findInvitation(id: number, compteId: number): Promise<Participer> {
        // TODO
        throw new NotImplementedException();
    }
}
