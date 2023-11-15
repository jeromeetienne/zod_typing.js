// npm imports
import Zod from 'zod';

export class ZodTypingType {
        // @ts-ignore
        typeName = /** @type {string} */(null)
        // @ts-ignore
        zodSchema = /** @type {Zod.Schema} */(null)
        // @ts-ignore
        fileExtention = /** @type {String|null} */(null)
}


export class ZodTypingBase {
        types = /** @type {ZodTypingType[]} */([])
}


