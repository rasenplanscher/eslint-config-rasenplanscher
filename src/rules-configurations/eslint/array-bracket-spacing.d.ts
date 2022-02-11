import { RuleConfiguration } from '../../../support/Rule.d'

export type Options = (("always" | "never") | {
	singleValue?: boolean
	objectsInArrays?: boolean
	arraysInArrays?: boolean
})[]

type Configuration = RuleConfiguration<'array-bracket-spacing', 'eslint', Options>

export default Configuration
