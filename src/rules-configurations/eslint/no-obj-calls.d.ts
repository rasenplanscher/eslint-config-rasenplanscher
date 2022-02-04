import { RuleConfiguration } from '../../../support/Rule'

export type Options = never[]

type Configuration = RuleConfiguration<'no-obj-calls', 'eslint', Options>

export default Configuration