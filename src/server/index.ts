import { addCommand, cache } from '@overextended/ox_lib/server';
import { GetGroup, GetGroupByPlayer, Group, Groups, Players } from './class';

  addCommand('creategroup', async (playerId) => {
    if (!playerId) return;

    const group = new Group(playerId, 'senor', 1)
    console.log(Groups);
    console.log(Players);
  });

  addCommand('leavegroup', async (playerId) => {
    const myGroup = GetGroupByPlayer(playerId)
    myGroup.removePlayer(playerId)
    console.log(Groups);
    console.log(Players);
  })

addCommand('mygroup', async (playerId) => {
  console.log(GetGroupByPlayer(playerId));
})

addCommand('invite', async (playerId, args) => {
  const myGroup = GetGroupByPlayer(playerId)
  const invite = myGroup.invitePlayer(args[0])
  console.log(invite);
})

addCommand('kick', async (playerId, args) => {
  const myGroup = GetGroupByPlayer(playerId)
  const target = args[0]
  const kickAttmpt = myGroup.kickPlayer(playerId, target)

  console.log(kickAttmpt);
})