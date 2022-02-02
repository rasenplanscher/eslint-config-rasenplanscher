import { RuleConfiguration } from '../../../support/Rule'

export type Options = ((("all" | "local") | {
	vars?: "all" | "local"
	varsIgnorePattern?: string
	args?: "all" | "after-used" | "none"
	ignoreRestSiblings?: boolean
	argsIgnorePattern?: string
	caughtErrors?: "all" | "none"
	caughtErrorsIgnorePattern?: string
}))[]

type Configuration = RuleConfiguration<'unused-imports/no-unused-imports-ts', 'eslint-plugin-unused-imports', Options>

export default Configuration
