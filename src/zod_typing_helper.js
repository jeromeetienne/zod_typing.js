// node imports
import Fs from 'fs';
import Path from 'path';

// npm imports
import Zod from 'zod';
import CliColor from "cli-color"

// local imports
import {ZodTypingBase} from './zod_typing_base.js';

export default class ZodTypingHelper {
	
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	//	.validateFilesByJsonSchema()
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 * @param {ZodTypingBase} zodTypeBase 
	 * @param {string} rootFolder
	 * @param {boolean=} verbose default to false.
	 */
	static async validateFilesByJsonSchema(zodTypeBase, rootFolder, verbose = false) {
		let allTypeFilesAreValid = true

		for (const zodType of zodTypeBase.types) {
			// if there is no file extention, skip it
			if (zodType.fileExtention === null) continue

			const zodSchema = zodType.zodSchema
			const fileExtention = zodType.fileExtention
			const allFilesAreValid = await ZodTypingHelper._validateJsonFileWithSchema(zodSchema, fileExtention, rootFolder, verbose)

			if (allFilesAreValid === false) {
				allTypeFilesAreValid = false
			}

			if (verbose) {
				if (allFilesAreValid === true) {
					console.log(`${CliColor.green('✓')} all files '${CliColor.bold(fileExtention)}' are valid`)
				} else {
					console.log(`${CliColor.red('✘')} Some files '${CliColor.bold(fileExtention)}' are invalid`)
				}
			}
		}
		return allTypeFilesAreValid
	}

	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	//	._validateJsonFileWithSchema()
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	/**
	 * 
	 * @param {Zod.Schema} zodSchema 
	 * @param {string} jsonFileExtention 
	 * @param {string} rootFolder
	 * @param {boolean=} verbose default to false.
	 */
	static async _validateJsonFileWithSchema(zodSchema, jsonFileExtention, rootFolder, verbose = false) {
		let fileNames = await ZodTypingHelper._reccursiveReadDir(rootFolder)
		// keep only the ones ending with proper extention
		fileNames = fileNames.filter(fileName => fileName.endsWith(jsonFileExtention))

		let errorCount = 0
		for (const fileName of fileNames) {
			const relativeFileName = Path.relative(rootFolder, fileName)
			const fileContent = await Fs.promises.readFile(fileName, 'utf8')
			const fileContentJson = JSON.parse(fileContent)
			const parseResult = zodSchema.safeParse(fileContentJson)
			if (parseResult.success) {
				if (verbose === true) {
					console.log(`${CliColor.green('✓')} valid ${relativeFileName}`)
				}
			} else {
				errorCount++
				if (verbose === true) {
					console.log(`${CliColor.red('✘')} invalid ${relativeFileName}`)
				}
				// console.log(parseResult.error)
			}
		}

		const allFilesAreValid = errorCount === 0
		return allFilesAreValid
	}

	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	//	._reccursiveReadDir()
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	/**
	 * from https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
	 * @param {string} folderName 
	 * @returns {Promise<string[]>}
	 */
	static async _reccursiveReadDir(folderName) {
		const dirents = await Fs.promises.readdir(folderName, { withFileTypes: true });
		const files = await Promise.all(dirents.map((dirent) => {
			// const resolvedName = Path.resolve(folderName, dirent.name);
			const resolvedName = Path.join(folderName, dirent.name);
			return dirent.isDirectory() ? ZodTypingHelper._reccursiveReadDir(resolvedName) : resolvedName;
		}));
		return Array.prototype.concat(...files);
	}

}
