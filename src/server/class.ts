import { Player } from '@nativewrappers/fivem/server';
import type {Player, SquadInterface, Status} from '../types/index'

export const Squads: { [name: string]: Squad } = {};
export const Players: Map<number, Player> = new Map();
export const Invites: Map<number, string> = new Map()

function isPlayerInSquad(player: number): boolean {
    return Players.has(player)
}

function isPlayerInvited(squad: Squad, player: number) {
    if (squad.invites.includes(player)) return true
    return false
}

function invitePlayer(squad: Squad, player: number){
    squad.invites.push(player)
    Invites.set(player, squad.name)
}

function removeFromList<T>(list: T[], property: T): void {
    const index = list.indexOf(property);
    if (index !== -1) {
        list.splice(index, 1);
    }
}

function isSquadEmpty(squad: Squad){
    return squad.players.length == 0
}

function isPlayerOnline(target: number){
    return GetPlayerPing(target.toString()) !== 0
}

function GetPlayerInfo(player: number){
    return {
        id: player,
        name: GetPlayerName(player),
        pfp: ''
    }
}

function AddPlayer(squad: SquadInterface, target: number) {
    const PlayerInfo = GetPlayerInfo(target)
    squad.players[target] = PlayerInfo
    Players.set(target, PlayerInfo)
}

function RemovePlayer(squad: SquadInterface, target:number) {
    removeFromList(squad.players, target)
    Players.delete(target)
}

export class Squad implements SquadInterface {
    public leader: number;
    public name: string;
    public status: Status;
    public identifier: number;
    public players: {[id: number]: Player};
    public invites: number[];

    constructor(leader: number, name:string , status: Status) {
        this.leader = leader;
        this.identifier = leader;
        this.name = name;
        this.status = status
        this.players = {}
        this.invites = []

        this.addSquad()
        this.addPlayer(leader, true)
    }

    private set SetLeader(player: number){
        this.leader = player
    }

    private get GetLeader(){
        return this.leader
    }

    public isInSquad(targetPlayer: number) {
        return this.players[targetPlayer]
    }

    private isLeader(leader: number) {
        return this.leader === +leader
    }

    private addSquad() {
        Squads[this.identifier] = this;
    }

    private removeSquad() {
        return delete Squads[this.identifier]
    }

    public addPlayer(player: number, ignoreInvite: boolean) {
        if (isPlayerInSquad(player)) return { success: false, message: 'Player is already in squad' };;
        if (!ignoreInvite && !isPlayerInvited(this, player)) return { success: false, message: 'Player is not invited' };;
    
        removeFromList(this.invites, player)
        AddPlayer(this, player)
        return { success: true, message: 'Player was invited'};;
    }
    
    public removePlayer(player: number) {
        if (!isPlayerInSquad(player)) return;

        RemovePlayer(this, player)

        if (isSquadEmpty(this)) {
            this.removeSquad()
        }
        return this;
    }

    public invitePlayer(targetPlayer: number): { success: boolean; message: string, squad?: Squad } {
        if (!isPlayerOnline(targetPlayer)) return { success: false, message: 'Player is not online' };
        if (Players.has(targetPlayer)) return { success: false, message: 'Player is already in a squad' };
        if (isPlayerInvited(this, targetPlayer)) return { success: false, message: 'Player is already invited'};
    
        invitePlayer(this, targetPlayer);
        return { success: true, message: `Player ${targetPlayer} received your invite`, squad: this };
    }

    public kickPlayer(iniciator: number, targetPlayer: number): {success: boolean, message: string} {
        const isLeader = this.isLeader(iniciator)

        if (!isLeader) return {success: false, message: 'You cannot kick bruv'};

        if (iniciator === +targetPlayer) return {success: false, message: 'Why is blud trying to kick himself, just leave the squad'}

        this.removePlayer(targetPlayer)

        return {success: true, message: `Player ${targetPlayer} was kicked by ${iniciator} successfully`}
    }

    public emit(eventName: string, ...args: any[]): void{
        for (const [_, player] of Object.entries(this.players)) {
            emitNet(eventName, player.id, ...args)
        }
    }
}

export function GetSquad(squad: number){
    return Squads[squad]
}

export function GetSquadByPlayer(player: number): SquadInterface | null {
    const playerLobby = Players.get(player)
    if (!playerLobby) return;

    return Squads[playerLobby.id] || null
}

export function GetSquadPlayer(){
    return Players
}

export function GetSquadInvites(){
    return Invites
}

export function GetSquads() {
    return Squads
}