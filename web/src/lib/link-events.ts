// Evento customizado para comunicação entre abas
const CHANNEL_NAME = 'brevly-links'

export interface LinkAccessEvent {
  type: 'link-accessed'
  linkId: string
}

// Cria um broadcast channel para comunicação entre abas
export const linkEventsChannel = new BroadcastChannel(CHANNEL_NAME)

// Envia evento de acesso a um link
export function broadcastLinkAccess(linkId: string) {
  const event: LinkAccessEvent = {
    type: 'link-accessed',
    linkId,
  }
  linkEventsChannel.postMessage(event)
}

// Listener para eventos de acesso
export function onLinkAccessed(callback: (linkId: string) => void) {
  const handler = (event: MessageEvent<LinkAccessEvent>) => {
    if (event.data.type === 'link-accessed') {
      callback(event.data.linkId)
    }
  }

  linkEventsChannel.addEventListener('message', handler)

  // Retorna função de cleanup
  return () => {
    linkEventsChannel.removeEventListener('message', handler)
  }
}
