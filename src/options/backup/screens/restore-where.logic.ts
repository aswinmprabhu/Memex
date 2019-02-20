import {
    reactEventHandler,
    handleEvent,
    compositeEventProcessor,
} from 'src/util/ui-logic'

interface Providers {
    [provider: string]: boolean
}
interface State {
    provider: 'google-drive' | 'local'
    valid: boolean
    backupPath: string
    overlay: string
}

export const PROVIDERS: Providers = {
    'google-drive': true,
    local: true,
}

export const INITIAL_STATE: State = {
    provider: null,
    valid: false,
    backupPath: null,
    overlay: null,
}

export const processEvent = compositeEventProcessor({
    onChangeOverlay: ({ event }) => {
        const overlay = event.overlay
        return {
            updateState: { overlay },
        }
    },
    onChangeBackupPath: ({ event }) => {
        const backupPath = event.backupPath
        return {
            updateState: { backupPath },
        }
    },
    onProviderChoice: ({ state, event }) => {
        const provider = event.value
        const valid = !!PROVIDERS[provider]
        return {
            updateState: { provider: valid ? provider : state.provider, valid },
        }
    },
    onConfirm: ({ state, event }) => {
        return {
            dispatch: state.valid && {
                type: 'onChoice',
                args: {
                    choice: state.provider,
                },
            },
        }
    },
})

export { reactEventHandler, handleEvent }
