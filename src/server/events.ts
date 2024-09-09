import type { SquadInterface, Status } from "../types";
import { GetSquad, GetSquadByPlayer, GetSquads, Squad } from "./class";
import { Notify } from "./utils";

onNet('senor-squads:server:CreateSquad', (name: string, status: Status) => {
    const Squads = GetSquads()
    if (Squads[source]) return Notify(source, 'You already own a squad baby', 'error');
    
    const createdSquad = new Squad(source, name, status)    
    Notify(source, `You created the squad: ${name} - ${status}`, 'success')

    emitNet('senor-squads:client:SquadsUpdate', -1, Squads)
    emitNet('senor-squads:client:SquadUpdate', source, createdSquad)
});

onNet('senor-squads:server:Invite', (targetPlayer: number) => {
    const squad = GetSquadByPlayer(source) as Squad;

    if (!squad) {
        return Notify(source, 'You dont have any squad bruv', 'error');
    }

    const {success, message} = squad.invitePlayer(targetPlayer);

    if (!success) {
        return Notify(source, message, 'error');
    }

    Notify(source, message, 'success');
    emitNet('senor-squads:client:Invited', targetPlayer, squad)
    squad.emit('senor-squads:client:SquadUpdate', squad)
});

onNet('senor-squads:server:InviteAccepted', (invite: SquadInterface) => {
    const squadID = invite.identifier
    const squad = GetSquad(squadID)
    const addPlayer = squad.addPlayer(source, false)
    squad.emit('senor-squads:client:SquadUpdate', squad)
    squad.emit('ox_lib:notify', {
        id: 'Squads',
        title: 'Squads',
        description: addPlayer.message,
        position: 'center-right',
        type: 'success'
    })

    emitNet('senor-squads:client:RemoveInvite', squad)
})

onNet('senor-squads:server:KickPlayer', (targetPlayer: number) => {
    const squad = GetSquadByPlayer(source) as Squad

    if (!squad) return Notify(source, 'You dont have a squad bruv', 'error');

    const isPlayerInSquad = squad.isInSquad(targetPlayer);

    if (!isPlayerInSquad) return Notify(source, 'Target player is not in squad', 'error');

    if (isPlayerInSquad){
        const kickAttempt = squad.kickPlayer(source, targetPlayer)
        if (kickAttempt.success) {
            squad.emit('senor-squads:client:SquadUpdate', squad)
            emitNet('senor-squads:client:SquadUpdate', targetPlayer, {})
        }
        return squad.emit('ox_lib:notify', {
            id: 'Squads',
            title: 'Squads',
            description: kickAttempt.message,
            position: 'center-right',
            type: kickAttempt ? 'success' : 'error'
        })
    }
})

onNet('senor-squads:server:LeaveSquad', () => {
    const squad = GetSquadByPlayer(source) as Squad

    if (!squad) return Notify(source, 'You dont have a squad bruv', 'error');

    const {success} = squad.removePlayer(source)

    if (success) {
        squad.emit('senor-squads:client:SquadUpdate', squad)
        emitNet('senor-squads:client:SquadUpdate', source, {})
    }
})

on("playerDropped", () => {
    const squad = GetSquadByPlayer(global.source) as Squad
    if (!squad) return;

    const {success} = squad.removePlayer(source)

    if (success) {
        squad.emit('senor-squads:client:SquadUpdate', squad)
    }
});