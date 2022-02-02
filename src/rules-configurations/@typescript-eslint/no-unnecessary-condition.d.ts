import { RuleConfiguration } from '../../../support/Rule'

export type Options = ({
	allowConstantLoopConditions?: boolean
	allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing?: boolean
})[]

type Configuration = RuleConfiguration<'@typescript-eslint/no-unnecessary-condition', '@typescript-eslint/eslint-plugin', Options>

export default Configuration
