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

type Configuration = RuleConfiguration<'no-unused-vars', 'eslint', Options>

export default Configuration
