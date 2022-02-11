import { RuleConfiguration } from '../../../support/Rule.d'

export type Options = (("always" | "as-needed") | {
	requireForBlockBody?: boolean
})[]

type Configuration = RuleConfiguration<'arrow-parens', 'eslint', Options>

export default Configuration
