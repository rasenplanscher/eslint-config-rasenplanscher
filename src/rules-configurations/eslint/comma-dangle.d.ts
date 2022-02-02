import { RuleConfiguration } from '../../../support/Rule'

export type Value = "always-multiline" | "always" | "never" | "only-multiline"

export type ValueWithIgnore = "always-multiline" | "always" | "ignore" | "never" | "only-multiline"

export type Options = ((Value | {
	arrays?: ValueWithIgnore
	objects?: ValueWithIgnore
	imports?: ValueWithIgnore
	exports?: ValueWithIgnore
	functions?: ValueWithIgnore
}))[]

type Configuration = RuleConfiguration<'comma-dangle', 'eslint', Options>

export default Configuration
