// import { addInvite, ReassignMySquad, ReassignSquads, removeInvite } from "./functions";
import { SquadInterface } from "../types";
import { CSquadInstance } from ".";

onNet('senor-squads:client:SquadsUpdate', (squads: SquadInterface) => {
    CSquadInstance.setSquads = squads
})

onNet('senor-squads:client:SquadUpdate', (mySquad: SquadInterface) => {
    CSquadInstance.setMySquad = mySquad
})

onNet('senor-squads:client:Invited', (invite: SquadInterface) => {
    console.log('i got an invite', invite);
    CSquadInstance.addInvite(invite)
})

// onNet('senor-squads:client:RemoveInvite', async (invite: SquadInterface) => {
//     removeInvite(invite)
// })