import { RuleConfigurationOverride } from '../../../support/Rule'

import BaseConfiguration from '../eslint/comma-dangle.d'

type Value = "always-multiline" | "always" | "never" | "only-multiline"

export type ValueWithIgnore = "always-multiline" | "always" | "never" | "only-multiline" | "ignore"

export type Options = ((Value | {
	arrays?: ValueWithIgnore
	objects?: ValueWithIgnore
	imports?: ValueWithIgnore
	exports?: ValueWithIgnore
	functions?: ValueWithIgnore
	enums?: ValueWithIgnore
	generics?: ValueWithIgnore
	tuples?: ValueWithIgnore
}))[]

type Configuration = RuleConfigurationOverride<BaseConfiguration, '@typescript-eslint/comma-dangle', '@typescript-eslint/eslint-plugin', Options>

export default Configuration