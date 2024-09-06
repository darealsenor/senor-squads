import { addInvite, ReassignMySquad, ReassignSquads, removeInvite } from "./functions";
import { SquadInterface } from "../types";

onNet('senor-squads:client:SquadsUpdate', async (squads: SquadInterface[]) => {
    ReassignSquads(squads)
})

onNet('senor-squads:client:SquadUpdate', async (mySquad: SquadInterface) => {
    ReassignMySquad(mySquad)
})

onNet('senor-squads:client:Invited', async (invite: SquadInterface) => {
    console.log('i got an invited', invite);
    addInvite(invite)
})

onNet('senor-squads:client:RemoveInvite', async (invite: SquadInterface) => {
    removeInvite(invite)
})