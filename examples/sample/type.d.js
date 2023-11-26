// npm imports
import Zod from 'zod';

// local imports 
import { ZodTypingBase, ZodTypingType } from '../../src/zod_typing_base.js';
import ZodTypingIo from '../../src/zod_typing_io.js';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Declare Zod schemas
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const zodSchemaToolInvocation = Zod.object({
        toolName: Zod.string().describe('name of the tool'),
        inputObject: Zod.object({}).describe('input object for the tool'),
}).describe('Tool invocation')

const zodSchemaDatasetUserInput = Zod.object({
        datasetName: Zod.string().describe('name of the dataset'),
        userInputs: Zod.array(Zod.object({
                userInput: Zod.string().describe('user input'),
        })).describe('List of user inputs'),
}).describe('Dataset user input')

const zodSchemaDatasetResponse = Zod.object({
        datasetName: Zod.string().describe('name of the dataset'),
        modelName: Zod.string().describe('name of the model'),
        responses: Zod.array(Zod.object({
                userInput: Zod.string().describe('user input'),
                response: Zod.string().describe('generated response from the user input'),
                systemMessage: Zod.string().describe('system message used to generate the response'),
        })).describe('List of user inputs, the generated response and the system message used to generate the response'),
}).describe('Dataset response')

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Declare jsdoc from Zod schemas
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// it is possible to create jsdoc directly from the zod schema
// from https://blog.jim-nielsen.com/2023/types-in-jsdoc-with-zod/
/** @typedef { Zod.infer<typeof zodSchemaToolInvocation> } ToolInvocation */
/** @typedef { Zod.infer<typeof zodSchemaDatasetUserInput> } DatasetUserInput */
/** @typedef { Zod.infer<typeof zodSchemaDatasetResponse> } DatasetResponse */

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	export myZodTyping
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

class ZodTyping extends ZodTypingBase {
        types = [
                /** @type {ZodTypingType} */({
                        typeName: 'ToolInvocation',
                        zodSchema: zodSchemaToolInvocation,
                        fileExtention: null
                }),
                /** @type {ZodTypingType} */({
                        typeName: 'DatasetUserInput',
                        zodSchema: zodSchemaDatasetUserInput,
                        fileExtention: '.dataset_user_input.json'
                }),
                /** @type {ZodTypingType} */({
                        typeName: 'DatasetResponse',
                        zodSchema: zodSchemaDatasetResponse,
                        fileExtention: '.dataset_response.json'
                }),
        ]
}
export const myZodTyping = new ZodTyping()
export const myZodTypingIo = new ZodTypingIo(myZodTyping)


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Old jsdoc
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// /**
//  * @typedef {object} ToolInvocation
//  * @property {string} toolName
//  * @property {object} inputObject
//  */

// /**
//  * @typedef {object} DatasetUserInput
//  * @property {string} datasetName
//  * @property {object[]} userInputs
//  * @property {string} userInputs[].userInput
//  */

// /**
//  * @typedef {object} DatasetResponse
//  * @property {string} datasetName
//  * @property {string} modelName
//  * @property {object[]} responses
//  * @property {string} responses[].userInput
//  * @property {string} responses[].response
//  * @property {string} responses[].systemMessage
//  */

export default {}