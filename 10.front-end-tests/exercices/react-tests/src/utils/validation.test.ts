import { describe, it, expect } from 'vitest';
import { validateEmail, validateName, validateForm } from './validation';

describe('validateEmail', () => {
    it('should return true for a valid email', () => {
        expect(validateEmail('test@example.com')).toBe(true);
        expect(validateEmail('user.name+tag@domain.co')).toBe(true);
    });

    it('should return false for an invalid email', () => {
        expect(validateEmail('not-an-email')).toBe(false);
        expect(validateEmail('@example.com')).toBe(false);
        expect(validateEmail('missing-at-sign')).toBe(false);
        expect(validateEmail('')).toBe(false);
    });
});

describe('validateName', () => {
    it('should return true for a name with at least 2 characters', () => {
        expect(validateName('Jo')).toBe(true);
        expect(validateName('John Doe')).toBe(true);
    });

    it('should return false for an empty or too short name', () => {
        expect(validateName('')).toBe(false);
        expect(validateName('J')).toBe(false);
        expect(validateName('  ')).toBe(false);
    });
});

describe('validateForm', () => {
    it('should return valid when both fields are correct', () => {
        const result = validateForm('John Doe', 'john@example.com');
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('should return errors when both fields are invalid', () => {
        const result = validateForm('J', 'not-an-email');
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(2);
    });

    it('should return a single error when only name is invalid', () => {
        const result = validateForm('', 'valid@example.com');
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Name must be at least 2 characters');
    });
});
