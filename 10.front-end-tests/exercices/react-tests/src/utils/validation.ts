export function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateName(name: string): boolean {
    return name.trim().length >= 2;
}

export function validateForm(name: string, email: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!validateName(name)) errors.push("Name must be at least 2 characters");
    if (!validateEmail(email)) errors.push("Email must be valid");
    return { valid: errors.length === 0, errors };
}
