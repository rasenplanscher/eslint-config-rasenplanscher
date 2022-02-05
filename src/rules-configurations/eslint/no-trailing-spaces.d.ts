import { RuleConfiguration } from '../../../support/Rule'

export type Options = ({
	skipBlankLines?: boolean
	ignoreComments?: boolean
})[]

type Configuration = RuleConfiguration<'no-trailing-spaces', 'eslint', Options>

export default Configuration
