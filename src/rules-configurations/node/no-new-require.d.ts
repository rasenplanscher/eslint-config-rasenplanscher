import { RuleConfiguration } from '../../../support/Rule.d'

export type Options = never[]

type Configuration = RuleConfiguration<'node/no-new-require', 'eslint-plugin-node', Options>

export default Configuration
