import {Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Post} from "@nestjs/common";
import {CurrentUser, Public} from "@nestjs/authentication";
import {ComptesService} from "./comptes.service.js";
import {CreateCompteDto} from "./dto/create-compte.dto.js";
import {Compte} from "./comptes.entity.js";

@Controller('comptes')
export class ComptesController {
    constructor(private readonly comptesService: ComptesService) {
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() moi: Compte) {
        if (id !== moi.id) { throw new ForbiddenException(); } // on ne consulte que son propre compte
        return this.comptesService.findById(id);
    }

    // TODO
    // créer un compte (POST)
}
