import { RuleConfigurationOverride } from '../../../support/Rule.d'
import BaseConfiguration from '../eslint/no-unused-vars.d'

export type Options = ((("all" | "local") | {
	vars?: "all" | "local"
	varsIgnorePattern?: string
	args?: "all" | "after-used" | "none"
	ignoreRestSiblings?: boolean
	argsIgnorePattern?: string
	caughtErrors?: "all" | "none"
	caughtErrorsIgnorePattern?: string
}))[]

type Configuration = RuleConfigurationOverride<BaseConfiguration, 'unused-imports/no-unused-vars', 'eslint-plugin-unused-imports', Options>

export default Configuration
