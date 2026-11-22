import {Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Body,Query} from "@nestjs/common";
import {PortemonnaiesService} from "./porte-monnaies.service.js";
import {CreatePortemonnaieDto} from "./dto/create-portemonnaie.dto.js";
import {CurrentUser} from "@nestjs/authentication";
import {Compte} from "../comptes/comptes.entity.js";

@Controller('portemonnaies')
export class PortemonnaiesController {
    constructor(private readonly portemonnaiesService: PortemonnaiesService) {}

    @Post()
    create(@Body() dto: CreatePortemonnaieDto, @CurrentUser() user: Compte) {
        return this.portemonnaiesService.create(dto.libelle, user.id);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() compte: Compte) {
        return this.portemonnaiesService.findOneForCompte(id, compte.id);
    }

    @Delete(':id/members/:memberId')
    @HttpCode(204)
    removeMember(@Param('id', ParseIntPipe)walletId : number, @Param('memberId', ParseIntPipe)memberId : number,@CurrentUser() compte: Compte){
        return this.portemonnaiesService.removeMember(walletId,memberId,compte.id)
    }

    @Get(':id/members/excluded')
    @HttpCode(200)
    findInvitableMembers(@Param('id', ParseIntPipe)id : number, @Query('emailOrName') emailOrName: string, @CurrentUser() compte: Compte){
        return this.portemonnaiesService.findInvitableMembers(id,emailOrName,compte.id);
    }

    // TODO : lister tous les portemonnaies d'un compte (GET /portemonnaies, étape 3)

    // TODO : ajouter un participant (POST /portemonnaies/:id/members, étape 4)

    // TODO : clôturer un portemonnaie (POST /portemonnaies/:id/cloturer, bonus)
}