import { RuleConfiguration } from '../../../support/Rule'

export type Options = never[]

type Configuration = RuleConfiguration<'no-proto', 'eslint', Options>

export default Configuration