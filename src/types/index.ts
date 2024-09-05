export enum Status {
    Open = 1,
    Private = 2
}

export interface SquadInterface {
    leader: number;
    name: string;
    status: Status;
    identifier: number;
}