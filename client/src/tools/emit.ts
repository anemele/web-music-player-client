import mitt from 'mitt'

export const emitter = mitt()
export const Events = {
    sendMusic: Symbol(),
    nextMusic: Symbol(),
    locateCurrent: Symbol(),
    test: Symbol()
}
