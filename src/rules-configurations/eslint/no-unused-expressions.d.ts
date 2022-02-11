import { RuleConfiguration } from '../../../support/Rule.d'

export type Options = ({
	allowShortCircuit?: boolean
	allowTernary?: boolean
	allowTaggedTemplates?: boolean
	enforceForJSX?: boolean
})[]

type Configuration = RuleConfiguration<'no-unused-expressions', 'eslint', Options>

export default Configuration
