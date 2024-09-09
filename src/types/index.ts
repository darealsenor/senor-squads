export enum Status {
    Open = 1,
    Private = 2
}

export interface SquadInterface {
    players: { [id: number]: Player };
    leader: number;
    name: string;
    status: Status;
    identifier: number;
}

export type Player = {
    id: number;
    name: string;
    pfp: string;
    ped: number;
}


export interface CSquadInterface {
    squads: SquadInterface[];
    mySquad: SquadInterface;
    Invites: SquadInterface[]
}