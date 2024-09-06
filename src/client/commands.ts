import { Invites, mySquad, Squads } from ".";
import { Status } from "../types";
import { doesInviteExist, isPlayerInSquad } from "./functions";
import { Notify } from "./util";

RegisterCommand('createsquad', (playerId?: number, args) => {
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
  
  RegisterCommand('kicksquad', (playerId: number, args: string[]) => {
    const target = +args[0]
    const _isPlayerInSquad = isPlayerInSquad(target)
  
    if (!_isPlayerInSquad) return Notify(_isPlayerInSquad.message, 'error')
  
      emitNet('senor-squads:server:KickPlayer', _isPlayerInSquad.targetPlayer)
  }, false)