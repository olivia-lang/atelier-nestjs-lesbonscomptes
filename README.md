# Atelier NestJS sur Les Bons Comptes

Les Bons Comptes est une petite appli pour partager des dépenses entre amis. On crée un porte-monnaie, on invite des gens dedans et chacun ajoute ce qu'il a payé. Le back est fait avec NestJS et TypeORM, le front avec React.

Le front est déjà fini. Pendant l'atelier, vous allez recoder des morceaux du back, et chaque étape débloque quelque chose qu'on voit dans l'appli. Les étapes 1 et 2 sont guidées, puis vous aurez de plus en plus d'autonomie.

La base de données est en ligne et commune à toute la classe. Vous verrez donc les comptes des autres, et c'est ce qui vous permettra de vous inviter entre vous à l'étape 4.

Si une erreur vous bloque ou qu'un passage n'est pas clair, appelez les animateurs.

Pour retrouver la syntaxe en cours de route :

- la doc de NestJS, https://docs.nestjs.com
- la doc de TypeORM, https://typeorm.io

## Ce qu'il faut installer

- Node.js 24 (la version LTS), en 24.11 ou plus récent. Node 22.13 ou plus marche aussi. npm est installé avec Node.
- Git.
- Un éditeur de code. On conseille VS Code.

Vérifiez votre version de Node avec cette commande.

```bash
node -v
```

Avec une version plus ancienne, npm affiche des avertissements `EBADENGINE` pendant l'installation, parce que TypeORM demande au moins ces versions.

Le reste (NestJS 12, TypeORM 1.1, React 19, Vite 8) s'installe tout seul avec `npm install`.

## Étape 0 - Installer et lancer le projet

Clonez le dépôt, puis installez les dépendances du back et du front.

```bash
git clone https://github.com/olivia-lang/atelier-nestjs-lesbonscomptes.git
cd atelier-nestjs-lesbonscomptes
npm install
cd frontend
npm install
cd ..
```

Copiez ensuite le fichier `.env.example` en `.env`, à la racine du projet.

```bash
# Windows
copy .env.example .env
# Mac / Linux
cp .env.example .env
```

Remplissez le `.env` avec les valeurs données par les animateurs. Laissez bien `DB_SYNCHRONIZE=false`. Les tables existent déjà dans la base partagée et vous n'avez pas les droits pour les modifier.

Lancez le back dans un premier terminal, à la racine du projet.

```bash
npm run start:dev
```

Puis le front dans un deuxième terminal.

```bash
cd frontend
npm run dev
```

Le front est sur http://localhost:5173 et le back sur http://localhost:3000. Le front appelle toujours le port 3000, il doit donc être libre.

Pour l'instant le back ne démarre pas et affiche cette erreur.

```
Entity metadata for Compte#participations was not found
```

C'est normal, c'est justement l'étape 1. Laissez le terminal ouvert. Avec `start:dev`, le back se relance tout seul à chaque fois que vous enregistrez un fichier.

## Comment est rangé le back

Le code du back est dans `src/`, avec un dossier par partie de l'appli (`comptes`, `portemonnaies`, `invitations`, `depenses`...). On retrouve à peu près les mêmes fichiers dans chaque dossier.

- `*.entity.ts` correspond à une table de la base. TypeORM s'en sert pour faire les requêtes.
- `*.controller.ts` contient les routes HTTP. Une méthode correspond à une route, avec un décorateur comme `@Get()` ou `@Post()`.
- `*.service.ts` fait le vrai travail, en général des requêtes à la base. Le controller ne fait qu'appeler le service.
- `*.module.ts` déclare le controller, le service et les entités de cette partie. Si quelque chose n'est pas déclaré dans un module, Nest ne le voit pas.
- `dto/` contient les classes qui décrivent ce que le front envoie, avec les règles de validation.

Les `@Quelquechose()` placés au-dessus des classes, des méthodes et des champs sont des décorateurs. Ça ressemble aux annotations en Java (`@Entity`, `@GetMapping`...). Nest et TypeORM les lisent pour savoir quoi faire de la classe.

Toutes les routes demandent d'être connecté, sauf celles marquées avec `@Public()`. Dans une route, `@CurrentUser()` donne le compte connecté.

## Étape 1 - L'entité Participer

Une ligne de la table `participer` relie un compte à un porte-monnaie. Tant que `dateAccepte` est vide, c'est une invitation en attente. Une fois qu'elle est remplie, le compte fait partie du porte-monnaie.

Ouvrez `src/portemonnaies/entities/participer.entity.ts`. Les champs sont là mais il manque les décorateurs, donc TypeORM ne sait pas que cette classe correspond à une table. C'est ce qui fait planter le back au démarrage.

Voici les six décorateurs qui manquent, dans le désordre.

```ts
// a)
@ManyToOne(() => Compte, (compte) => compte.participations)

// b)
@Column({ type: 'date', nullable: true })

// c)
@Entity()

// d)
@ManyToOne(() => Portemonnaie, (pm) => pm.participations)

// e)
@PrimaryGeneratedColumn()

// f)
@Column({ type: 'date' })
```

Placez-les dans `participer.entity.ts`, au-dessus de la classe et des champs. Les numéros montrent où il en manque un. Les imports en haut du fichier sont déjà bons.

```ts
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
```

- `@Entity()` indique que la classe correspond à une table. Par défaut la table porte le nom de la classe.
- `@PrimaryGeneratedColumn()` est une clé primaire. C'est la base qui choisit la valeur.
- `@Column({ type: 'date' })` est une colonne qui stocke une date sans l'heure. `nullable: true` autorise une valeur vide.
- `@ManyToOne(...)` crée une clé étrangère vers une autre entité. Le deuxième paramètre donne le champ de l'autre côté de la relation, un `@OneToMany`.

Si vous bloquez, regardez `porte-monnaies.entity.ts` dans le même dossier. Elle est complète et montre à quoi ressemble une entité.

Enregistrez. Le back doit redémarrer et afficher `Nest application successfully started`.

Sur le front, la page d'accueil s'affiche. Si vous essayez de créer un compte, vous aurez l'erreur `Cannot POST /comptes`, c'est l'étape suivante.

## Étape 2 - Créer un compte

Le formulaire d'inscription envoie `prenom`, `pseudo`, `email` et `motDePasse` sur `POST /comptes` (voir `frontend/src/api/comptes.js`). Il faut écrire le DTO puis la route.

### Le DTO

Ouvrez `src/comptes/dto/create-compte.dto.ts`. Le prénom vous est donné en exemple.

```ts
export class CreateCompteDto {
    @IsNotEmpty({ message: 'Le prénom est obligatoire' })
    prenom: string;

    // à vous : pseudo, email et motDePasse
}
```

Ajoutez les trois autres champs, avec les règles écrites dans le TODO du fichier. Les décorateurs utiles sont déjà importés en haut du fichier.

- `@IsNotEmpty()` refuse une valeur vide.
- `@IsEmail()` vérifie que c'est un email.
- `@MinLength(n)` et `@MaxLength(n)` limitent le nombre de caractères.

Un champ peut avoir plusieurs décorateurs. Chaque décorateur accepte un message, `{ message: '...' }`, et c'est ce message que le front affiche. Attention, pour `@IsEmail` le message se met en deuxième paramètre, `@IsEmail({}, { message: '...' })`.

Ces décorateurs viennent de la librairie class-validator. Le projet active un `ValidationPipe` dans `src/main.ts`, donc Nest vérifie ces règles avant d'entrer dans le controller. Si une règle n'est pas respectée, il renvoie une erreur 400 avec le message.

Le pipe supprime aussi les champs qui n'ont aucun décorateur. Un champ oublié dans le DTO arrive donc vide dans le controller.

### La route

Dans `src/comptes/comptes.controller.ts`, remplacez le TODO par cette méthode.

```ts
    @Public()
    @Post()
    create(@Body() dto: CreateCompteDto) {
        return this.comptesService.create(dto.prenom, dto.pseudo, dto.email, dto.motDePasse);
    }
```

- Le controller a `@Controller('comptes')`, donc `@Post()` répond sur `POST /comptes`.
- `@Public()` est obligatoire ici. Quand on crée son compte, on n'est pas encore connecté.
- `@Body()` donne le corps de la requête, déjà vérifié avec le DTO.
- `comptesService.create` existe déjà. Il vérifie que l'email n'est pas pris et hache le mot de passe. Nest renvoie en JSON ce que la méthode retourne.

### Tester

Créez un compte sur http://localhost:5173/comptes/nouveau, puis connectez-vous.

La base est partagée, donc si l'email est déjà utilisé par quelqu'un d'autre vous aurez une erreur. Prenez un pseudo que les autres reconnaîtront, ils en auront besoin pour vous inviter. Et ne mettez pas un mot de passe que vous utilisez ailleurs.

Après la connexion, la page reste sur "Chargement...". C'est normal, la liste des porte-monnaies est l'étape 3.

## Étape 3 - Lister ses porte-monnaies

La page d'accueil appelle `GET /portemonnaies` pour afficher les porte-monnaies du compte connecté.

### La route

Dans `src/portemonnaies/porte-monnaies.controller.ts`, à la place du TODO "lister tous les portemonnaies d'un compte", ajoutez la route `GET /portemonnaies`. Elle appelle `findAllForCompte` du service avec l'id du compte connecté.

Inspirez-vous de la route de l'étape 2 et de celles déjà présentes dans ce controller.

### Le service

Dans `src/portemonnaies/porte-monnaies.service.ts`, complétez `findAllForCompte` en remplissant les TODO.

```ts
    async findAllForCompte(compteId: number) {
        const participations = await this.participationRepository.find({
            where: // TODO1
            relations: // TODO2
            order: { portemonnaie: { dateCreation: 'DESC' } },
        });

        return participations
            .filter((p) => /* TODO3 */)
            .map((p) => ({
                id: p.portemonnaie.id,
                libelle: p.portemonnaie.libelle,
                status: p.portemonnaie.status,
                dateCreation: p.portemonnaie.dateCreation,
                nombreParticipants: // TODO4
            }));
    }
```

- TODO1 : récupérer les participations du compte connecté.
- TODO2 : charger aussi le porte-monnaie de chaque participation, et les participations de ce porte-monnaie (vous en aurez besoin pour le TODO4).
- TODO3 : garder seulement les invitations acceptées.
- TODO4 : compter les participants du porte-monnaie qui ont accepté.

`participationRepository` est donné au service par son constructeur (`@InjectRepository(Participer)`). Nest le crée tout seul, il n'y a jamais de `new` à écrire.

La méthode `find` prend des options.

- `where` filtre les lignes. On peut filtrer sur une relation, en écrivant un objet dans un objet.
- `relations` charge aussi les objets liés, comme une jointure. Sans ça, `p.portemonnaie` serait `undefined`. Les relations peuvent aussi s'imbriquer.
- `order` trie le résultat, ici du plus récent au plus ancien.

Ressources utiles :

- `findOneForCompte`, juste en dessous dans le même service, fait déjà un `find` avec un `where` et des relations imbriquées ;
- la page "Find Options" de la doc TypeORM ;
- `.filter(...)` garde les éléments pour lesquels la fonction renvoie `true`, et `.length` donne la taille d'un tableau.

### Tester

Rechargez la page. La liste s'affiche, vide pour l'instant. Créez un porte-monnaie avec le bouton "Nouveau porte-monnaie" et ajoutez-y une dépense, cette partie marche déjà.

Le panneau "Invitations" à droite affiche une erreur, il sera réglé à l'étape 5.

## Étape 4 - Inviter quelqu'un

Sur la page d'un porte-monnaie, le bouton "Ajouter un compte" ouvre une recherche. La recherche marche déjà, mais le bouton "Inviter" appelle `POST /portemonnaies/:id/members`, qui n'existe pas encore. Le front envoie dans le corps un tableau d'id de comptes, par exemple `[12]`.

Inviter quelqu'un revient à créer une ligne `participer` pour chaque compte invité, avec la date du jour en `dateInvitation` et `dateAccepte` vide.

À vous d'écrire la route à la place du TODO "ajouter un participant", puis la méthode `addMember` du service. Seul un participant du porte-monnaie (qui a accepté) peut inviter quelqu'un. Sinon, la route renvoie une 404.

Questions à se poser :

- Comment récupérer l'id du porte-monnaie qui est dans le chemin, et le tableau envoyé dans le corps ?
- Comment savoir si le compte connecté fait partie du porte-monnaie ?
- Comment créer une ligne `participer` qui pointe vers un porte-monnaie et un compte dont on ne connaît que l'id ?

Ressources utiles :

- `removeMember` et `findInvitableMembers`, dans le même controller et le même service, récupèrent déjà un id dans le chemin et vérifient déjà que le compte connecté est membre ;
- `create`, en haut du service, crée déjà une ligne `participer` ;
- `exists({ where })` renvoie `true` ou `false` selon qu'une ligne correspond ;
- `Not(IsNull())` veut dire "n'est pas vide", c'est déjà importé ;
- `repository.create({...})` construit l'objet sans l'enregistrer, et `save` fait l'insertion. On peut donner un tableau à `save` ;
- pour une relation, `{ id: ... }` suffit, pas besoin de charger tout l'objet.

### Tester

Ouvrez un de vos porte-monnaies, cliquez sur "Ajouter un compte", cherchez le pseudo de votre voisin et cliquez sur "Inviter". Il disparaît des résultats de la recherche, l'invitation est en attente.

Votre voisin ne la voit pas encore, il faut l'étape 5. Si vous voulez tester seul, créez un deuxième compte dans une fenêtre de navigation privée.

## Étape 5 - Accepter ou refuser une invitation

Le panneau "Invitations" de la page d'accueil utilise trois routes.

- `GET /invitations` renvoie les invitations reçues et pas encore acceptées.
- `POST /invitations/:id/accepter` accepte une invitation.
- `DELETE /invitations/:id` la refuse.

Tout se passe dans `src/invitations/`, où il faut compléter le module, le controller et le service.

Ce que doivent faire les routes :

- la liste contient les invitations du compte connecté qui ne sont pas encore acceptées. Le front affiche le libellé du porte-monnaie et le pseudo de son créateur ;
- accepter une invitation met la date du jour dans `dateAccepte` ;
- refuser une invitation supprime la ligne ;
- on ne peut accepter ou refuser qu'une invitation en attente qui nous est adressée. Sinon, la route renvoie une 404.

Les signatures des méthodes du service sont déjà écrites. La méthode privée `findInvitation` sert à retrouver une invitation en vérifiant ces conditions, pour ne pas les réécrire dans `accepter` et `refuser`. Pensez à enlever les `throw new NotImplementedException();`, ils servaient juste à faire compiler le projet.

Attention, la route qui refuse doit répondre avec le code 204 (`@HttpCode(204)`). Le front attend une réponse vide sur ce code, sinon il essaie de lire du JSON qui n'existe pas et affiche une erreur.

Questions à se poser :

- Le module est vide. Que faut-il y déclarer pour que Nest connaisse le controller et le service ? Et pour que le service puisse recevoir le repository de `Participer` ? Comparez avec `porte-monnaies.module.ts`.
- Comment écrire "dateAccepte est vide" dans un `where` ?
- Quelles relations charger pour que le front puisse afficher le pseudo du créateur ?

Ressources utiles :

- `IsNull()` veut dire "est vide", c'est déjà importé dans le service ;
- `findOne({ where })` renvoie une ligne ou `null` ;
- `save` sur un objet qui a déjà un id fait une mise à jour au lieu d'une insertion ;
- `remove(objet)` supprime la ligne ;
- `@Delete()` existe comme `@Get()` et `@Post()`.

### Tester

Demandez à votre voisin de vous inviter, ou invitez-le. Rechargez la page d'accueil, l'invitation apparaît dans le panneau "Invitations". Acceptez-la, le porte-monnaie arrive dans votre liste et vous pouvez y ajouter des dépenses.

## Bonus - Clôturer un porte-monnaie

Le créateur d'un porte-monnaie voit un bouton "Clôturer" sur sa page, qui appelle `POST /portemonnaies/:id/cloturer`. Une fois le porte-monnaie clos, on ne peut plus ajouter de dépense et la page affiche le solde de chaque participant.

Implémentez la route et la méthode `cloturer` du service. Le front attend le porte-monnaie à jour dans la réponse.

Pour vous aider, vous pouvez vous poser les questions suivantes :

- Quel champ de `Portemonnaie` indique s'il est ouvert ou clos ?
- Qui a le droit de clôturer un porte-monnaie ?
- Que doit-il se passer si le porte-monnaie est déjà clos ?
- Y a-t-il déjà une méthode dans le service qui récupère le porte-monnaie en vérifiant que le compte en fait partie ?

## Si ça ne marche pas

- `npm install` dit qu'il ne trouve pas `package.json` : vous n'êtes pas dans le bon dossier. Faites `cd atelier-nestjs-lesbonscomptes` (ou `cd frontend` pour le front).
- Le back affiche `EADDRINUSE` : le port 3000 est déjà pris par un autre programme. Fermez-le, le front ne sait appeler que ce port.
- Le back n'arrive pas à se connecter à la base : vérifiez que le `.env` est bien à la racine et que les valeurs sont copiées sans espace en trop.
- La première requête met quelques secondes : la base se met en veille quand personne ne s'en sert, elle se réveille toute seule.
- Le front affiche `Cannot GET ...` ou `Cannot POST ...` : la route n'existe pas encore. Vérifiez le décorateur, le chemin, et que le controller est bien déclaré dans son module.
- Le back plante après un enregistrement : lisez le terminal, l'erreur TypeScript donne le fichier et la ligne.

## Fin de l'atelier

Merci d'avoir suivi l'atelier. N'hésitez pas à poser vos questions aux animateurs, sur NestJS ou sur le reste de l'appli.
