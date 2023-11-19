#!/usr/bin/env node

// node imports
import Fs from 'fs';
import Path from 'path';

// npm imports
import ZodTypingHelper from '../src/zod_typing_helper.js';
import { ZodTypingBase, ZodTypingType } from '../src/zod_typing_base.js';
import CliColor from "cli-color"
import * as Commander from "commander"
import { zodToJsonSchema } from "zod-to-json-schema";
import JsoncParser from 'jsonc-parser'

// define __dirname for ESM modules - https://stackoverflow.com/a/66790591/1954789
import Url from 'url';
import { type } from 'os';
const __filename = Url.fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Build the Zod schema
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

async function mainAsync() {
	// parse command line
	const cmdline = new Commander.Command()
	cmdline.name(`${Path.basename(__filename)}`)
		.version('0.0.3')
		.description(`Tool to handle zod typing`)

	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	//	.validate_json_schema()
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	cmdline.command('validate_json_schema')
	.description(`Validate all json files against the zod schema`)
		.argument('<typeFilePaths...>', 'Path to the type files')
		.requiredOption('-d, --rootFolder <string>', 'Path to the root folder')
		.option('-v, --verbose', 'verbose mode', false)
		.action(async function (typeFilePaths, options) {
			for (const typeFilePath of typeFilePaths) {
				// NOTE: import path is relative to the location of the script, NOT the current working directory
				const absolutePath = Path.resolve(typeFilePath)
				const { myZodTyping } = await import(absolutePath)

				const allFilesValid = await ZodTypingHelper.validateFilesByJsonSchema(myZodTyping, options.rootFolder, options.verbose)

				if (allFilesValid === true) {
					console.log(`${CliColor.green('✓')} all files are valid`)
				} else {
					console.log(`${CliColor.red('✘')} Some files are invalid`)
					process.exit(1)
				}
			}
		});

	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	//	.generate_json_schema()
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	cmdline.command('generate_json_schema')
		.description(`Generate a json schema from a zod schema`)
		.argument('typeFilePath', 'Path to the type file')
		.argument('typeName', 'Path to the type files')
		.action(async function (typeFilePath, typeName) {
			// NOTE: import path is relative to the location of the script, NOT the current working directory
			const absolutePath = Path.resolve(typeFilePath)
			const importResult = await import(absolutePath)
			if (importResult.myZodTyping === undefined) {
				console.error(`myZodTyping is undefined in ${typeFilePath}`)
				process.exit(1)
			}
			const myZodTyping = /** @type {ZodTypingBase} */(importResult.myZodTyping)

			// check if typeName exists
			const zodType = /** @type {ZodTypingType} */(myZodTyping.types.find(zodType => zodType.typeName === typeName))

			if (zodType === undefined) {
				console.error(`type '${typeName}' does not exists`)
				process.exit(1)
			}


			const jsonSchema = zodToJsonSchema(zodType.zodSchema, "myJsonSchema");
			console.log(JSON.stringify(jsonSchema?.definitions?.myJsonSchema, null, '\t'))
		});

	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	//	.read_file()
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	cmdline.command('read_file')
		.description(`Read a file and validate it against the zod schema. Able to read JSON and JSONC files`)
		.argument('typeFilePath', 'Path to the type file')
		.argument('fileName', 'Path to the file to read')
		.action(async function (typeFilePath, fileName) {
			// NOTE: import path is relative to the location of the script, NOT the current working directory
			const absolutePath = Path.resolve(typeFilePath)
			const importResult = await import(absolutePath)
			if (importResult.myZodTyping === undefined) {
				console.error(`myZodTyping is undefined in ${typeFilePath}`)
				process.exit(1)
			}
			const myZodTyping = /** @type {ZodTypingBase} */(importResult.myZodTyping)

			// check if we have a fileExtension for it
			const zodType = myZodTyping.types.find(zodType => fileName.endsWith(zodType.fileExtention))
			if( zodType === undefined) {
				console.error(`No file extension found for ${fileName}`)
				process.exit(1)
			}

			// read the file
			const fileContent = await Fs.promises.readFile(fileName, 'utf8')

			// parse the file as JSON, and if failed, try JSONC, and if failed, exit
			let fileContentJson = null
			try {
				fileContentJson = JSON.parse(fileContent)
			} catch (error) {
				if( error instanceof SyntaxError) {
					try {
						fileContentJson = JsoncParser.parse(fileContent)
					}catch(error) {
						console.error('Failed to parse file as JSON or JSONC')
						process.exit(1)
					}
				}
			}

			// do Zod validation
			const parseResult = zodType.zodSchema.safeParse(fileContentJson)
			if (parseResult.success) {
				// console.log(`file '${fileName}' is valid`)
				process.stdout.write(JSON.stringify(parseResult.data, null, '\t'))
				console.log()
			} else {
				console.error(`file '${fileName}' is invalid`)
				console.error(parseResult.error)
			}
		});


	// parse command line
	cmdline.parse(process.argv)
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	call mainAsync()
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

void mainAsync()