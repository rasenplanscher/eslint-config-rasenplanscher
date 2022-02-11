import { RuleConfiguration } from '../../../support/Rule.d'

export type Options = never[]

type Configuration = RuleConfiguration<'import/unambiguous', 'eslint-plugin-import', Options>

export default Configuration
