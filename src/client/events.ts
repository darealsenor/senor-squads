import { addInvite, ReassignmySquads, ReassignSquads } from ".";
import { SquadInterface } from "../types";

onNet('senor-squads:client:SquadsUpdate', async (squads: SquadInterface[]) => {
    ReassignSquads(squads)
})

onNet('senor-squads:client:SquadUpdate', async (mySquad: SquadInterface) => {
    ReassignmySquads(mySquad)
})

onNet('senor-squads:client:Invited', async (invite) => {
    addInvite(invite)
})