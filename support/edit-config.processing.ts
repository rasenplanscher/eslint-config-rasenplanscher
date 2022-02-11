/// <reference path='_inquirer-autocomplete-prompt.d.ts'/>

import { spawn } from 'child_process'

import { printer } from '@spec2ts/core'
import { JSONSchema, parseSchema } from '@spec2ts/jsonschema'
import { outputFile, pathExists } from 'fs-extra'
import inquirer from 'inquirer'
import autocomplete from 'inquirer-autocomplete-prompt'
import open from 'open'
import { outdent } from 'outdent'

import { importable, root, support } from './paths'
import priorities, { HELPFUL, IMPORTANT, Priority, TASTE } from './priorities'
import { RuleBundle, RuleConfiguration, RuleConfigurationIgnore, RuleConfigurationOff, RuleConfigurationOptions, RuleConfigurationSet, RuleData } from './Rule.d'
import { Mutable } from './utility.d'


inquirer.registerPrompt(`autocomplete`, autocomplete)

export function processRule (bundle:RuleBundle) {
	return Promise.all(bundle.all.flatMap((item) => [
		(
			typeof item.rule.meta.docs?.url === `string`
			? open(item.rule.meta.docs.url) as Promise<unknown>
			: Promise.reject(`No documentation url found for rule ${item.rule.id}`)
		),
		(
			pathExists(item.typingFile)
			.then((exists) => (exists ? null : generateTypes(item, bundle)))
		),
		(
			pathExists(item.configFile)
			.then((exists) => (exists ? null : generateConfig(item, bundle)))
			.then(() => code(item.configFile))
		),
		(
			pathExists(item.reasonFile)
			.then((exists) => (exists ? null : generateDoc(item, bundle)))
			.then(() => code(item.reasonFile))
		),
	]))
}


//


const configToken = `configuration`
const extendedConfigKey = `base`
const extendedConfigToken = `baseConfiguration`
const configTypeToken = `Configuration`
const baseTypeToken = `RuleConfiguration`
const baseTypeTokenExtender = `RuleConfigurationOverride`
const extendedTypeToken = `BaseConfiguration`
const optionsTypeToken = `Options`

export function generateTypes (item:RuleData, bundle:RuleBundle) {
	return Promise.resolve([
		item === bundle.base,
		item.rule.meta.schema as (
			Mutable<
				Exclude<typeof item.rule.meta.schema, undefined>
			>
		),
	] as const)
	.then(([isBase, schema]) => ([
		isBase,
		normalizeSchema(schema),
	] as const))
	.then(([isBase, schema]) => (
		parseSchema(schema, { name: optionsTypeToken })
		.then((ast) => [
			isBase,
			ast,
		] as const)
	))
	.then(([isBase, ast]) => [isBase, printer.printNodes(ast)] as const)
	.then(([isBase, types]) => outdent`
		import { ${ isBase ? baseTypeToken : baseTypeTokenExtender } } from '${
			importable(support(`Rule.d`), item.typingFile)
		}'

		${
			isBase
			? ``
			: outdent`
				import ${extendedTypeToken} from '${
					importable(bundle.base.typingFile, item.typingFile)
				}'
			`
		}

		${
			types
			.replace(/;$/gm, ``)
			.replace(/(?<=(?:^|\n)( {4})*) {4}/g, `\t`)
			.replace(/\(\)\[\]$/, `never[]`)
		}

		type ${configTypeToken} = ${
			isBase
			? outdent`
				${baseTypeToken}<'${
					item.rule.id
				}', '${
					item.provider.id
				}', ${
					optionsTypeToken
				}>
			`
			: outdent`
				${baseTypeTokenExtender}<${
					extendedTypeToken
				}, '${
					item.rule.id
				}', '${
					item.provider.id
				}', ${
					optionsTypeToken
				}>
			`
		}

		export default ${
			// https://github.com/microsoft/TypeScript/issues/3792#issuecomment-303526468
			configTypeToken
		}
	`)
	.then((types) => outputFile(
		item.typingFile,
		`${types}\n`.replace(
			`\n`.repeat(4), // eslint-disable-line @typescript-eslint/no-magic-numbers
			`\n`.repeat(2), // eslint-disable-line @typescript-eslint/no-magic-numbers
		),
	))
}

function normalizeSchema (schema:JSONSchema | JSONSchema[]) : JSONSchema {
	if (Array.isArray(schema)) return wrapSchemaArray(schema)
	if (Object.prototype.hasOwnProperty.call(schema, `type`)) return schema

	const keys = Object.keys(schema) as Array<keyof typeof schema | number>

	if (keys.every((key) => Number.isNaN(Number.parseInt(key as string)))) return schema
	if (keys.some((key) => Number.isNaN(Number.parseInt(key as string)))) return fixWeirdWrongButWorkingSchema(schema)

	const schemaArray:JSONSchema[] = []

	;(keys as Array<number>).forEach((key) => {
		schemaArray[key] = (schema as Array<JSONSchema>)[key]!
	})

	return wrapSchemaArray(schemaArray)
}

function wrapSchemaArray (schemas:JSONSchema[]) : JSONSchema {
	return {
		type: `array`,
		items: schemas.map((schema) => normalizeSchema(schema)),
		minItems: 0,
		maxItems: schemas.length,
	}
}

import weirdSchemaThing from './.rules-definitions/@typescript-eslint/no-magic-numbers'

function fixWeirdWrongButWorkingSchema (schema:JSONSchema) : JSONSchema {
	// ./.rules-definitions/eslint/no-magic-numbers.ts
	// Strangely, eslint seems to be fine with that 👆 and handling all parameters…
	// @see https://github.com/typescript-eslint/typescript-eslint/blob/c8e650f0c124d24b24beaeb376eaf61ee8d9e6fb/packages/eslint-plugin/src/rules/no-magic-numbers.ts#L12
	const { 0: weird, properties } = schema as unknown as typeof weirdSchemaThing['meta']['schema'][number]

	return JSON.parse(JSON.stringify({
		...weird,
		properties: {
			...weird.properties,
			...properties,
		},
	}))
}

function generateConfig (item:RuleData, bundle:RuleBundle) {
	if (item !== bundle.base) {
		return outputFile(
			item.configFile,
			outdent`
				import ${extendedConfigToken} from '${
					importable(bundle.base.configFile, item.configFile)
				}'
				${
					coreExport({ [extendedConfigKey]: extendedConfigToken })
					.replace(
						`${extendedConfigKey}: \`${extendedConfigToken}\`,`,
						`${extendedConfigKey}: ${extendedConfigToken},`,
					)
				}
			`,
		)
	}

	return inquirer.prompt([
		{
			type: `confirm`,
			name: `ignore`,
			message: `Ignore?`,
			default: false,
		},
	])
	.then((({ ignore }) => {
		if (ignore) return { ignore }

		return inquirer.prompt([
			{
				type: `list`,
				name: `priority`,
				message: `Priority:`,
				choices: priorities,
				default: ({
					problem: IMPORTANT,
					suggestion: HELPFUL,
					layout: TASTE,

					// some rules lack a meta.type, specifically in plugin react
					'Possible Errors': IMPORTANT,
					'Best Practices': HELPFUL,
					'Stylistic Issues': TASTE,

					// some rules lack a meta.type and a meta.docs.category, specifically in plugin react
					default: HELPFUL,
				} as const)[// eslint-disable-next-line @typescript-eslint/indent -- https://github.com/typescript-eslint/typescript-eslint/issues/1824
					item.rule.meta.type
					|| (
						item.rule.meta.docs?.category as (
							| 'Possible Errors'
							| 'Best Practices'
							| 'Stylistic Issues'
							| undefined
						)
					)
					|| `default`
				],
			},
			{
				type: `confirm`,
				name: `activate`,
				message: `Activate?`,
				default: true,
			},
		])
		.then(({ activate, priority }:{ activate:boolean, priority:Priority }) => ({
			priority,
			activate,
			options: (
				activate
				? []
				: undefined
			),
		}))
	}) as (
		(data:{ ignore: boolean }) => PromiseLike<RuleConfigurationIgnore | (RuleConfigurationSet & (RuleConfigurationOff | RuleConfigurationOptions))>
	))
	.then((ruleConfig:Omit<RuleConfiguration, 'ruleId' | 'providerId'>) => outputFile(
		item.configFile,
		coreExport(ruleConfig),
	))

	function coreExport (data:Record<string, unknown>) {
		return outdent`
			import ${configTypeToken} from '${
				importable(item.typingFile, item.configFile)
			}'

			const ${configToken}:${configTypeToken} = ${
				JSON.stringify({
					ruleId: item.rule.id,
					providerId: item.provider.id,
					...data,
				}, null, `\t`)
				.replace(/"(\w+)":/g, `$1:`)
				.replace(/`/g, `\\\``)
				.replace(/"/g, `\``)
				.replace(/\n}$/, `,\n}`)
			}

			export default ${configToken}

		`
	}
}

export function generateDoc (item:RuleData, bundle:RuleBundle) {
	if (item.rule.meta.docs?.url === undefined || item.rule.meta.docs.url === ``) {
		return Promise.reject(`No documentation url found for rule ${item.rule.id}`)
	}

	return Promise.resolve(item === bundle.base)
	.then((base) => outdent`
		[${item.rule.id}](${
			item.rule.meta.docs!.url // !: checked at the start of `generateDoc`
		})
		${`=`.repeat(
			item.rule.id.length
			+ item.rule.meta.docs!.url!.length // !: checked at the start of `generateDoc`
			// eslint-disable-next-line @typescript-eslint/no-magic-numbers
			+ 4, // brackets and parentheses
		)}
		${
			base
			? outdent`
				Please [open an issue](https://github.com/rasenplanscher/eslint-config-rasenplanscher/issues/new)
				or [create a pull request](https://github.com/rasenplanscher/eslint-config-rasenplanscher/edit/main/${
					importable(
						item.reasonFile,
						root(`ಠ_ಠ`), // easier than checking if it's a file ¯\_(ツ)_/¯
					)
					.replace(`./`, ``)
				})
			`
			: `See [${bundle.base.rule.id}](${importable(bundle.base.reasonFile, item.reasonFile)})\n`
		}
	`)
	.then((doc) => outputFile(item.reasonFile, doc))
}


//


function code (...filepaths:string[]) {
	spawn(
		`code.cmd`,
		filepaths,
		{ stdio: `pipe` },
	)
}
