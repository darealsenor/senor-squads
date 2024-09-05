import {SquadInterface, Status} from '../types/index'
import './events'
import { Notify } from './util';


export let Squads = {}
export let mySquad = {}
export let Invites: SquadInterface[] = [];

export const ReassignSquads = (newSquads: SquadInterface[]) => {
  Squads = newSquads
};

export const ReassignmySquads = (updatedSquad: SquadInterface) => {
  mySquad = updatedSquad
};

export const addInvite = (invite: SquadInterface) => {
  Invites.push(invite)
};

function doesInviteExist(inviteNumber: number): { success: boolean, invite?: SquadInterface, message?: string } {
  console.log(Invites, typeof(Invites), Invites.length);

  const foundInvite = Invites.find((invite: SquadInterface) => invite.identifier === inviteNumber);

  if (foundInvite) {
    return { success: true, invite: foundInvite };
  }

  return { success: false, message: 'Invite was not found' };
}


RegisterCommand('createsquad', (playerId: number, args) => {
  emitNet('senor-squads:server:CreateSquad', 'senor', Status.Open)
}, false)

RegisterCommand('availablesquads', (playerId: number) => {
  console.log(Squads);
}, false)

RegisterCommand('mysquad', (playerId: number, args) => {
  console.log(mySquad);
}, false)

RegisterCommand('invite', (playerId: number, args) => {
  emitNet('senor-squads:server:Invite', +args[0])
}, false)

RegisterCommand('myinvites', (playerId: number) => {
  console.log(Invites);
}, false)

RegisterCommand('acceptInvite', (playerId: number, args: string[]) => {
  if (Invites.length === 0) return Notify('You dont have any invites', 'error')

  const checkInvite = doesInviteExist(+args[0])

  console.log(checkInvite);

  if (!checkInvite.success) {
    return Notify(checkInvite.message, 'error')
  }

  emitNet('senor-squads:server:InviteAccepted', checkInvite.invite)
}, false)