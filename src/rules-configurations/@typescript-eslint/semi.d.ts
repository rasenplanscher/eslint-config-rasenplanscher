import { RuleConfigurationOverride } from '../../../support/Rule'

import BaseConfiguration from '../eslint/semi.d'

type Options = (("never") | {
	beforeStatementContinuationChars?: "always" | "any" | "never"
})[] | (("always") | {
	omitLastInOneLineBlock?: boolean
})[]

type Configuration = RuleConfigurationOverride<BaseConfiguration, '@typescript-eslint/semi', '@typescript-eslint/eslint-plugin', Options>

export default Configuration