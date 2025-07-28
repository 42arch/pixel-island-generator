import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: { tsconfigPath: 'tsconfig.json' },
  rules: {
    'no-console': 'off',
    'style/max-len': ['error', {
      code: 120,
      ignoreUrls: true,
    }],
    'style/object-curly-newline': ['error', {
      ObjectExpression: { multiline: true, minProperties: 3 },
      ObjectPattern: { multiline: true, minProperties: 3 },
      ImportDeclaration: { multiline: true, minProperties: 4 },
      ExportDeclaration: { multiline: true, minProperties: 3 },
    }],
    'style/indent': ['error', 2, { ImportDeclaration: 1 }],
  },
})
