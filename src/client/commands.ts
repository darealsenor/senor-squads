import { CSquadInstance } from '.';
import { Status } from '../types';
import { Notify } from './util';

RegisterCommand(
  'createsquad',
  () => {
    emitNet('senor-squads:server:CreateSquad', 'senor', Status.Open);
  },
  false
);

RegisterCommand(
  'availablesquads',
  () => {
    console.log(CSquadInstance.squads);
  },
  false
);

RegisterCommand(
  'mysquad',
  () => {
    console.log(CSquadInstance.mySquad);
  },
  false
);

RegisterCommand(
  'invite',
  (playerId: number, args: string[]) => {
    emitNet('senor-squads:server:Invite', +args[0]);
  },
  false
);

RegisterCommand(
  'myinvites',
  () => {
    console.log(CSquadInstance.Invites);
  },
  false
);

RegisterCommand(
  'acceptInvite',
  (playerId: number, args: string[]) => {
    const { success, message, invite } = CSquadInstance.GetInvite(+args[0]);

    if (!success) return Notify(message, 'error');
    emitNet('senor-squads:server:InviteAccepted', invite);
    CSquadInstance.removeInvite(invite);
  },
  false
);

RegisterCommand(
  'kicksquad',
  (playerId: number, args: string[]) => {
    const target = +args[0];
    const { success, message, player } = CSquadInstance.isPlayerInMySquad(target);
    if (!success) return Notify(message, 'error');

    console.log(player);
    emitNet('senor-squads:server:KickPlayer', target);
  },
  false
);

RegisterCommand(
  'leavesquad', 
  () => {
    const mySquad = CSquadInstance.getMySquad()
    if (!mySquad) return Notify('No squad', 'error')

    emitNet('senor-squads:server:LeaveSquad')
  },
  false
)