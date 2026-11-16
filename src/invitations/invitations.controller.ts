import {Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post} from "@nestjs/common";
import {CurrentUser} from "@nestjs/authentication";
import {InvitationsService} from "./invitations.service.js";
import {Compte} from "../comptes/comptes.entity.js";

@Controller('invitations')
export class InvitationsController {
    constructor(private readonly invitationsService: InvitationsService) {}

    // TODO
}
