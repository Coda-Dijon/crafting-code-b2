export const MAX_LENGTH = 280;
export const WARNING_THRESHOLD = 20;

export function remainingCharacters(text) {
    return MAX_LENGTH - text.length;
}

export function canPublish(text) {
    return text.trim().length > 0 && text.length < MAX_LENGTH;
}

export function counterState(text) {
    const remaining = remainingCharacters(text);

    if (remaining < 0) return 'error';
    if (remaining < WARNING_THRESHOLD) return 'warning';
    return 'ok';
}
