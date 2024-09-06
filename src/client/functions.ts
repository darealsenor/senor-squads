import { Invites, mySquad, Squads } from ".";
import { SquadInterface } from "../types";

export const ReassignSquads = (newSquads: SquadInterface[]) => {
  Object.keys(Squads).forEach((key) => {
    delete Squads[key];
  });

  Object.keys(newSquads).forEach((key) => {
    Squads[key] = newSquads[key];
  });
};

export const ReassignMySquad = (updatedSquad: SquadInterface) => {
  Object.keys(mySquad).forEach((key) => {
    delete mySquad[key];
  });

  mySquad[updatedSquad.identifier] = updatedSquad;
};

export const addInvite = (invite: SquadInterface) => {
  if (!Invites[invite.identifier]) {
    Invites[invite.identifier] = invite;
  }
};

export const removeInvite = (invite: SquadInterface) => {
  delete Invites[invite.identifier];
};

export function doesInviteExist(inviteNumber: number): { success: boolean; invite?: SquadInterface; message?: string } {
  const foundInvite = Invites[inviteNumber];
  console.log(Invites, 'invites');
  console.log(foundInvite, 'found invite??');

  if (foundInvite) {
    return { success: true, invite: foundInvite };
  }

  return { success: false, message: 'Invite was not found' };
}

export function isPlayerInSquad(targetPlayer: number): { success: boolean; message?: string; targetPlayer?: number } {
  if (!mySquad || mySquad.length === 0) return { success: false, message: 'You dont have a squad' };
  if (typeof targetPlayer !== 'number') return { success: false, message: 'Player should be a number' };

  const isTargetInSquad = mySquad.players.includes(targetPlayer);

  if (isTargetInSquad) {
    return { success: true, message: `Player ${targetPlayer}, found.`, targetPlayer: targetPlayer };
  }

  return { success: false, message: `Player ${targetPlayer}, was not found` };
}
