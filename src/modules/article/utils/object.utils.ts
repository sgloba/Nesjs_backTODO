export const pick = <T extends Record<string, any>>(obj: T, fields: keyof T | (keyof T)[]) => {
    return (Array.isArray(fields) ? fields : [fields])
        .reduce((output, field) => ({
            ...output,
            [field]: obj[field]
        }), {});
}