import { RuleConfiguration } from '../../../support/Rule.d'

export type Options = ((("nofunc") | {
	functions?: boolean
	classes?: boolean
	variables?: boolean
}))[]

type Configuration = RuleConfiguration<'no-use-before-define', 'eslint', Options>

export default Configuration
