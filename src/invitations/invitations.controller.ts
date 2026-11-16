import {Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post} from "@nestjs/common";
import {CurrentUser} from "@nestjs/authentication";
import {InvitationsService} from "./invitations.service.js";
import {Compte} from "../comptes/comptes.entity.js";

@Controller('invitations')
export class InvitationsController {
    constructor(private readonly invitationsService: InvitationsService) {}

    // TODO
    // GET /invitations : les invitations reçues et pas encore acceptées
    // POST /invitations/:id/accepter : accepter une invitation
    // DELETE /invitations/:id : refuser une invitation, répond avec le code 204
}
