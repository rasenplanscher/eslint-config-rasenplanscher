import { RuleConfigurationOverride } from '../../../support/Rule'

import BaseConfiguration from '../eslint/dot-notation.d'

export type Options = ({
	allowKeywords?: boolean
	allowPattern?: string
	allowPrivateClassPropertyAccess?: boolean
	allowProtectedClassPropertyAccess?: boolean
	allowIndexSignaturePropertyAccess?: boolean
})[]

type Configuration = RuleConfigurationOverride<BaseConfiguration, '@typescript-eslint/dot-notation', '@typescript-eslint/eslint-plugin', Options>

export default Configuration
