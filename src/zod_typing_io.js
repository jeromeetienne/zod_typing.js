// npm imports
import Fs from 'fs'

// local imports
import {ZodTypingBase} from './zod_typing_base.js';

export default class ZodTypingIo {

        /**
         * @param {ZodTypingBase} zodTypingBase 
         */
        constructor(zodTypingBase) {
                this._zodTypingBase = zodTypingBase
        }

        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////
        //	
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////
        
        /**
	 * Read a JSON file and parse it with the corresponding Zod schema based on the file extention.
	 * 
	 * @param {string} fileName 
	 */
	 async readFileJson(fileName) {
		const zodType = this._zodTypingBase.types.find(zodType => zodType.fileExtention !== null && fileName.endsWith(zodType.fileExtention))
		if (zodType === undefined) {
			throw new Error(`no zodType found for ${fileName}`)
		}

		const fileContent = await Fs.promises.readFile(fileName, 'utf8')
		const untypedContent = JSON.parse(fileContent)
		const parseResult = zodType.zodSchema.safeParse(untypedContent)
		if( parseResult.success === false ) {
			throw new Error(`Error parsing ${fileName} : ${parseResult.error}`)
		}
		return untypedContent
	}

        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////
        //	
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////
        
	/**
	 * Write a JSON file and parse it with the corresponding Zod schema based on the file extention.
	 * 
	 * @param {string} fileName 
	 * @param {string} fileContent
	 */
	 async writeFileJson(fileName, fileContent) {
		const zodType = this._zodTypingBase.types.find(zodType =>  zodType.fileExtention !== null && fileName.endsWith(zodType.fileExtention))
		if (zodType === undefined) {
			throw new Error(`no zodType found for ${fileName}`)
		}

		const untypedContent = JSON.parse(fileContent)
		const parseResult = zodType.zodSchema.safeParse(untypedContent)
		if( parseResult.success === false ) {
			throw new Error(`Error parsing ${fileName} : ${parseResult.error}`)
		}

		await Fs.promises.writeFile(fileName, fileContent, 'utf8')
	}
}