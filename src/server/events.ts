import type { SquadInterface, Status } from "../types";
import { GetSquad, GetSquadByPlayer, GetSquads, Squad } from "./class";
import { Notify } from "./utils";

onNet('senor-squads:server:CreateSquad', (name: string, status: Status) => {
    const Squads: Squad[] = GetSquads()
    if (Squads[source]) return Notify(source, 'You already own a squad baby', 'error');
    
    const createdSquad = new Squad(source, name, status)    
    Notify(source, `You created the squad: ${name} - ${status}`, 'success')

    emitNet('senor-squads:client:SquadsUpdate', -1, Squads)
    emitNet('senor-squads:client:SquadUpdate', source, createdSquad)
});

onNet('senor-squads:server:Invite', (targetPlayer: number) => {
    const squad = GetSquadByPlayer(source);

    if (!squad) {
        return Notify(source, 'You dont have any squad bruv', 'error');
    }

    const inviteAttempt = squad.invitePlayer(targetPlayer);

    if (!inviteAttempt.success) {
        return Notify(source, inviteAttempt.message, 'error');
    }

    Notify(source, inviteAttempt.message, 'success');
    emitNet('senor-squads:client:Invited', targetPlayer, inviteAttempt.squad)
});

onNet('senor-squads:server:InviteAccepted', (invite: SquadInterface) => {
    const squadID = invite.identifier
    const squad = GetSquad(squadID)
    const addPlayer = squad.addPlayer(source, false)
    console.log(addPlayer);
    emitNet('senor-squads:client:SquadUpdate', source, squad)
})