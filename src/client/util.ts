import lib from '@overextended/ox_lib/client';

export function Notify(description: string, type: 'error' | 'inform' | 'success'){
    return lib.notify({
        id: 'Squads',
        title: 'Squads',
        description,
        position: 'center-right',
        type})
}