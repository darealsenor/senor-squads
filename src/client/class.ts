import { CSquadInterface, Player, SquadInterface } from "../types";

export class CSquad implements  CSquadInterface {
    public squads: SquadInterface[];
    public mySquad: SquadInterface;
    public Invites: SquadInterface[];

    constructor() {
        this.squads = {}
        this.mySquad = {}
        this.Invites = {}
    }

    public set setSquads(_squads: SquadInterface){
        this.squads = _squads
    }

    public set setMySquad(_mySquad: SquadInterface) {
        this.mySquad = _mySquad
    }

    public get GetInvites(){
        return this.Invites
    }

    public getMySquad(){
        return this.mySquad
    }

    public GetInvite(identifier: number): {success: boolean, message: string, invite: SquadInterface | null} {
        if (this.Invites[identifier]) return {success: true, message: 'Invite Found', invite: this.Invites[identifier]}
        return {success: false, message: 'Invite not found', invite: null}
    }

    public addInvite(invite: SquadInterface) {
        console.log('adding invite', invite);
        this.Invites[invite.identifier] = invite
        console.log(this.Invites[invite.identifier]);
    }

    public removeInvite(invite: SquadInterface) {
        delete this.Invites[invite.identifier]
    }

    public isPlayerInMySquad(player:number):{success: boolean, message: string, player: Player | null}{
        if (!this.mySquad || !this.mySquad.players) return {success: false, message: 'You dont have squad', player: null}
        if (!this.mySquad.players[player]) return {success: false, message: 'Player not found', player: null}
        if (this.mySquad.players[player]) return {success: true, message: `Player ${player} found!`, player: this.mySquad.players[player]}

        return {success: false, message: `Unexpected error`, player: null}
    }
}