export function simulateMouseEvent(typeArg, props = {
    cancelable: true,
    bubble: true,
    view: window
}) {
    return new MouseEvent(typeArg, props);
}

export function simulateInputEvent(typeArg, props = {
    inputType: 'insertText',
    data: '',
    dataTransfer: null,
    isComposing: false
}) {
    return new InputEvent(typeArg, props);
}

export function simulateKeyboardEvent(typeArg, props = {

}) {
    return new KeyboardEvent(typeArg, props);
}

