import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Participer} from "../portemonnaies/entities/participer.entity.js";
import {InvitationsController} from "./invitations.controller.js";
import {InvitationsService} from "./invitations.service.js";

@Module({
    // TODO
})
export class InvitationsModule {}
