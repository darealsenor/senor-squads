enum Status {
    Open = 1,
    Private = 2
}

interface GroupInterface {
    leader: number;
    name: string;
    status: Status;
    players: number[];
    invites: number[];
}


export const Groups: { [name: string]: Group } = {};
export const Players: Map<number, number> = new Map();
export const Invites: Map<number, string> = new Map()

function isPlayerInGroup(player: number): boolean {
    return Players.has(player)
}

function isPlayerInvited(group: Group, player: number) {
    if (group.invites.includes(player)) return true
    return false
}

function invitePlayer(group: Group, player: number){
    group.invites.push(player)
    Invites.set(player, group.name)
}

function removeFromList<T>(list: T[], property: T): void {
    const index = list.indexOf(property);
    if (index !== -1) {
        list.splice(index, 1);
    }
}

function isGroupEmpty(group: Group){
    return group.players.length == 0
}

function isPlayerOnline(target: number){
    return GetPlayerPing(target.toString()) !== 0
}

export class Group implements GroupInterface {
    leader: number;
    name: string;
    status: Status;
    players: number[];
    invites: number[];

    constructor(leader: number, name:string , status: Status) {
        this.leader = leader;
        this.name = name;
        this.status = status
        this.players = []
        this.invites = []

        this.addGroup()
        this.addPlayer(leader, true)
    }

    set SetLeader(player: number){
        this.leader = player
    }

    get GetLeader(){
        return this.leader
    }

    isInGroup(targetPlayer: number) {
        return this.players.includes(targetPlayer)
    }

    isLeader(leader: number) {
        return this.leader === +leader
    }

    addGroup() {
        Groups[this.leader] = this;
    }

    removeGroup() {
        return delete Groups[this.leader]
    }

    addPlayer(player: number, ignoreInvite: boolean) {
        if (isPlayerInGroup(player)) return;
        if (!ignoreInvite && isPlayerInvited(this, player)) return;
    
        removeFromList(this.invites, player)
        this.players.push(player);
        Players.set(player, this.leader)
        return this;
    }
    
    removePlayer(player: number) {
        if (!isPlayerInGroup(player)) return;
        removeFromList(this.players, player)
        Players.delete(player)

        if (isGroupEmpty(this)) {
            this.removeGroup()
        }
        return this;
    }

    invitePlayer(targetPlayer: number){
        if (!isPlayerOnline(targetPlayer)) return 'Not online';

        const doesHaveGroup = Players.has(+targetPlayer)
        if (doesHaveGroup) return 'Have group';

        if (isPlayerInvited(this, targetPlayer)) return 'Already Invited';

        invitePlayer(this, targetPlayer)
        return this
    }

    kickPlayer(iniciator: number, targetPlayer: number) {
        const isLeader = this.isLeader(iniciator)

        if (!isLeader) return 'You cannot kick bruv';

        if (iniciator === +targetPlayer) return 'Why is blud trying to kick himself, just leave the group'

        this.removePlayer(targetPlayer)

        return this
    }
}

export function GetGroup(group: number){
    return Groups[group]
}

export function GetGroupByPlayer(player: number){
    const playerLobby = Players.get(player)
    if (!playerLobby) return;

    return Groups[playerLobby] || false
}