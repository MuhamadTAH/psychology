/**
 * 🔒 SECURITY: Input Validation & Sanitization Module
 * 
 * Implements schema-based validation following OWASP guidelines:
 * - Type checking
 * - Length limits
 * - Pattern validation
 * - Reject unexpected fields
 * - XSS prevention through sanitization
 * 
 * OWASP Reference: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
 */

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * Schema definition for validation
 */
export interface FieldSchema {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email' | 'uuid';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: readonly (string | number)[];
    items?: FieldSchema;          // For arrays
    properties?: ValidationSchema; // For nested objects
    sanitize?: boolean;           // Whether to sanitize HTML/XSS
}

export type ValidationSchema = Record<string, FieldSchema>;

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    sanitizedData?: Record<string, unknown>;
}

// ============================================================================
// COMMON SCHEMAS FOR REUSE
// ============================================================================

export const COMMON_SCHEMAS = {
    // Email validation (OWASP compliant)
    email: {
        type: 'email' as const,
        required: true,
        maxLength: 254, // RFC 5321 max email length
    },

    // Short text (names, titles)
    shortText: {
        type: 'string' as const,
        minLength: 1,
        maxLength: 100,
        sanitize: true,
    },

    // Medium text (descriptions)
    mediumText: {
        type: 'string' as const,
        maxLength: 1000,
        sanitize: true,
    },

    // Long text (content, messages)
    longText: {
        type: 'string' as const,
        maxLength: 10000,
        sanitize: true,
    },

    // Lesson ID format
    lessonId: {
        type: 'string' as const,
        pattern: /^[A-D]\d+-\d+$/,
        maxLength: 10,
    },

    // Positive integer
    positiveInt: {
        type: 'number' as const,
        min: 1,
        max: 1000000,
    },

    // Coupon code
    couponCode: {
        type: 'string' as const,
        pattern: /^[A-Z0-9]{4,20}$/,
        maxLength: 20,
    },
} as const;

// ============================================================================
// ENDPOINT-SPECIFIC SCHEMAS
// ============================================================================

/**
 * Schema for analytics-ai endpoint
 */
export const ANALYTICS_AI_SCHEMA: ValidationSchema = {
    question: {
        type: 'string',
        required: true,
        minLength: 1,
        maxLength: 1000,
        sanitize: true,
    },
};

/**
 * Schema for chat endpoint
 */
export const CHAT_SCHEMA: ValidationSchema = {
    message: {
        type: 'string',
        required: true,
        minLength: 1,
        maxLength: 50000, // Allow longer content for lesson generation
        sanitize: false, // Don't sanitize as it may contain valid content
    },
};

/**
 * Schema for send-coupon endpoint
 */
export const SEND_COUPON_SCHEMA: ValidationSchema = {
    email: {
        type: 'email',
        required: true,
        maxLength: 254,
    },
    couponCode: {
        type: 'string',
        required: true,
        pattern: /^[A-Za-z0-9_-]{3,50}$/,
        maxLength: 50,
    },
    name: {
        type: 'string',
        required: false,
        maxLength: 100,
        sanitize: true,
    },
};

/**
 * Schema for delete-dark-psychology-lesson endpoint
 */
export const DELETE_LESSON_SCHEMA: ValidationSchema = {
    lessonNumber: {
        type: 'number',
        required: false,
        min: 1,
        max: 10000,
    },
    lessonId: {
        type: 'string',
        required: false,
        pattern: /^[A-D]\d+-\d+(_Part_\d+)?$/,
        maxLength: 30,
    },
};

/**
 * Schema for edit-dark-psychology-lesson endpoint
 */
export const EDIT_LESSON_SCHEMA: ValidationSchema = {
    lessonNumber: {
        type: 'number',
        required: false,
        min: 1,
        max: 10000,
    },
    lessonId: {
        type: 'string',
        required: false,
        pattern: /^[A-D]\d+-\d+(_Part_\d+)?$/,
        maxLength: 30,
    },
    updatedLesson: {
        type: 'object',
        required: true,
        properties: {
            number: { type: 'number', required: false },
            title: { type: 'string', maxLength: 200, sanitize: true },
            lessonId: { type: 'string', maxLength: 30 },
        },
    },
};

/**
 * Schema for add-dark-psychology-lesson endpoint
 */
export const ADD_LESSON_SCHEMA: ValidationSchema = {
    // Accept complex nested lesson data
    // Main validation is structural - lesson can have many properties
    sectionId: { type: 'string', required: false, maxLength: 10 },
    lessonId: { type: 'string', required: false, maxLength: 30 },
    title: { type: 'string', required: false, maxLength: 200, sanitize: true },
    lessonTitle: { type: 'string', required: false, maxLength: 200, sanitize: true },
    number: { type: 'number', required: false, min: 1, max: 10000 },
    lessons: { type: 'array', required: false },
    practice: { type: 'array', required: false },
    contentScreens: { type: 'array', required: false },
};

// ============================================================================
// SANITIZATION FUNCTIONS
// ============================================================================

/**
 * Sanitize string to prevent XSS attacks
 * OWASP: Encode HTML entities in user input
 */
export function sanitizeString(input: string): string {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        // Remove null bytes - OWASP: Null byte injection prevention
        .replace(/\0/g, '')
        // Normalize whitespace
        .trim();
}

/**
 * Sanitize for safe file paths
 * OWASP: Path traversal prevention
 */
export function sanitizePath(input: string): string {
    return input
        // Remove path traversal sequences
        .replace(/\.\./g, '')
        .replace(/\.\//g, '')
        .replace(/\/\//g, '/')
        // Remove null bytes
        .replace(/\0/g, '')
        // Remove shell special chars
        .replace(/[;&|`$]/g, '')
        .trim();
}

/**
 * Validate email format
 * OWASP: Use strict email validation
 */
function isValidEmail(email: string): boolean {
    // RFC 5322 compliant email regex (simplified but effective)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate UUID format
 */
function isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

// ============================================================================
// MAIN VALIDATION FUNCTION
// ============================================================================

/**
 * Validate input data against a schema
 * OWASP: Reject unexpected fields (strict mode)
 */
export function validateInput(
    data: unknown,
    schema: ValidationSchema,
    options: { strictMode?: boolean } = {}
): ValidationResult {
    const { strictMode = true } = options;
    const errors: string[] = [];
    const sanitizedData: Record<string, unknown> = {};

    // OWASP: Check that input is an object
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        return {
            valid: false,
            errors: ['Input must be a valid JSON object'],
        };
    }

    const inputData = data as Record<string, unknown>;

    // OWASP: In strict mode, reject unexpected fields
    if (strictMode) {
        const allowedFields = new Set(Object.keys(schema));
        const inputFields = Object.keys(inputData);

        for (const field of inputFields) {
            if (!allowedFields.has(field)) {
                errors.push(`Unexpected field: ${field}`);
            }
        }
    }

    // Validate each field in schema
    for (const [fieldName, fieldSchema] of Object.entries(schema)) {
        const value = inputData[fieldName];
        const fieldErrors = validateField(fieldName, value, fieldSchema);

        if (fieldErrors.length > 0) {
            errors.push(...fieldErrors);
        } else if (value !== undefined) {
            // Apply sanitization if needed
            if (fieldSchema.type === 'string' && fieldSchema.sanitize && typeof value === 'string') {
                sanitizedData[fieldName] = sanitizeString(value);
            } else {
                sanitizedData[fieldName] = value;
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        sanitizedData: errors.length === 0 ? sanitizedData : undefined,
    };
}

/**
 * Validate a single field against its schema
 */
function validateField(
    name: string,
    value: unknown,
    schema: FieldSchema
): string[] {
    const errors: string[] = [];

    // Check required
    if (value === undefined || value === null) {
        if (schema.required) {
            errors.push(`${name} is required`);
        }
        return errors;
    }

    // Type validation
    switch (schema.type) {
        case 'string':
            if (typeof value !== 'string') {
                errors.push(`${name} must be a string`);
                return errors;
            }
            if (schema.minLength !== undefined && value.length < schema.minLength) {
                errors.push(`${name} must be at least ${schema.minLength} characters`);
            }
            if (schema.maxLength !== undefined && value.length > schema.maxLength) {
                errors.push(`${name} must be at most ${schema.maxLength} characters`);
            }
            if (schema.pattern && !schema.pattern.test(value)) {
                errors.push(`${name} has invalid format`);
            }
            if (schema.enum && !schema.enum.includes(value)) {
                errors.push(`${name} must be one of: ${schema.enum.join(', ')}`);
            }
            break;

        case 'email':
            if (typeof value !== 'string') {
                errors.push(`${name} must be a string`);
                return errors;
            }
            if (!isValidEmail(value)) {
                errors.push(`${name} must be a valid email address`);
            }
            if (schema.maxLength !== undefined && value.length > schema.maxLength) {
                errors.push(`${name} must be at most ${schema.maxLength} characters`);
            }
            break;

        case 'uuid':
            if (typeof value !== 'string') {
                errors.push(`${name} must be a string`);
                return errors;
            }
            if (!isValidUUID(value)) {
                errors.push(`${name} must be a valid UUID`);
            }
            break;

        case 'number':
            if (typeof value !== 'number' || isNaN(value)) {
                errors.push(`${name} must be a number`);
                return errors;
            }
            if (schema.min !== undefined && value < schema.min) {
                errors.push(`${name} must be at least ${schema.min}`);
            }
            if (schema.max !== undefined && value > schema.max) {
                errors.push(`${name} must be at most ${schema.max}`);
            }
            if (schema.enum && !schema.enum.includes(value)) {
                errors.push(`${name} must be one of: ${schema.enum.join(', ')}`);
            }
            break;

        case 'boolean':
            if (typeof value !== 'boolean') {
                errors.push(`${name} must be a boolean`);
            }
            break;

        case 'array':
            if (!Array.isArray(value)) {
                errors.push(`${name} must be an array`);
                return errors;
            }
            if (schema.minLength !== undefined && value.length < schema.minLength) {
                errors.push(`${name} must have at least ${schema.minLength} items`);
            }
            if (schema.maxLength !== undefined && value.length > schema.maxLength) {
                errors.push(`${name} must have at most ${schema.maxLength} items`);
            }
            // Validate array items if schema provided
            if (schema.items) {
                for (let i = 0; i < value.length; i++) {
                    const itemErrors = validateField(`${name}[${i}]`, value[i], schema.items);
                    errors.push(...itemErrors);
                }
            }
            break;

        case 'object':
            if (typeof value !== 'object' || value === null || Array.isArray(value)) {
                errors.push(`${name} must be an object`);
                return errors;
            }
            // Validate nested object if schema provided
            if (schema.properties) {
                for (const [propName, propSchema] of Object.entries(schema.properties)) {
                    const propValue = (value as Record<string, unknown>)[propName];
                    const propErrors = validateField(`${name}.${propName}`, propValue, propSchema);
                    errors.push(...propErrors);
                }
            }
            break;
    }

    return errors;
}

/**
 * Helper to create validation error response
 */
export function createValidationErrorResponse(errors: string[]): Response {
    return new Response(
        JSON.stringify({
            error: 'Validation Error',
            message: 'Invalid input data',
            details: errors,
        }),
        {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        }
    );
}

/**
 * Parse and validate JSON body from request
 * OWASP: Handle JSON parsing errors gracefully
 */
export async function parseAndValidateBody<T = Record<string, unknown>>(
    request: Request,
    schema: ValidationSchema,
    options?: { strictMode?: boolean }
): Promise<{ success: true; data: T } | { success: false; response: Response }> {
    try {
        // OWASP: Limit request body size (handled by Next.js config, but add check)
        const contentLength = request.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB max
            return {
                success: false,
                response: new Response(
                    JSON.stringify({ error: 'Request body too large' }),
                    { status: 413, headers: { 'Content-Type': 'application/json' } }
                ),
            };
        }

        const body = await request.json();
        const result = validateInput(body, schema, options);

        if (!result.valid) {
            return {
                success: false,
                response: createValidationErrorResponse(result.errors),
            };
        }

        return {
            success: true,
            data: (result.sanitizedData ?? body) as T,
        };
    } catch (error) {
        return {
            success: false,
            response: new Response(
                JSON.stringify({ error: 'Invalid JSON body' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            ),
        };
    }
}
