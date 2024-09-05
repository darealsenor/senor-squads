export function Notify(source: number, description: string, type: string){
    return emitNet('ox_lib:notify', source, {
        id: 'Squads',
        title: 'Squads',
        description,
        position: 'center-right',
        type
    })
}