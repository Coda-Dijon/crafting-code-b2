import { describe, expect, it } from 'vitest';
import { canPublish, counterState, remainingCharacters } from '../../src/message.js';

describe('canPublish', () => {
    it('refuses an empty message', () => {
        expect(canPublish('')).toBe(false);
    });

    it('refuses a message made only of spaces', () => {
        expect(canPublish('   ')).toBe(false);
    });

    it('accepts a short message', () => {
        expect(canPublish('Bonjour Coda !')).toBe(true);
    });

    it('refuses a message that is too long', () => {
        expect(canPublish('a'.repeat(300))).toBe(false);
    });
});

describe('remainingCharacters', () => {
    it('counts down from 280', () => {
        expect(remainingCharacters('Bonjour')).toBe(273);
    });
});

describe('counterState', () => {
    it('is ok for a short message', () => {
        expect(counterState('Bonjour')).toBe('ok');
    });

    it('is in error when the message is too long', () => {
        expect(counterState('a'.repeat(281))).toBe('error');
    });
});
