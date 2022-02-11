import { RuleConfiguration } from '../../../support/Rule.d'

export type Options = (("always" | "never") | {
	arraysInObjects?: boolean
	objectsInObjects?: boolean
})[]

type Configuration = RuleConfiguration<'object-curly-spacing', 'eslint', Options>

export default Configuration