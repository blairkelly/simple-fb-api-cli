module.exports = {
    "root": true,
    "env": {
        "es6": true,
        "node": true,
    },
    "ignorePatterns": [
        ".cache/",
        ".git/",
        ".husky/",
        ".vscode/",

        "node_modules",
        "./node_modules",
        "node_modules/",
        "**/node_modules",

        "build",
        "./build",
        "build/",
        "**/build",

        "dist",
        "./dist",
        "dist/",
        "**/dist",
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
    },
    "overrides": [
        {
            "files": [
                "*.js",
                "*.jsx",
                "*.ts",
                "*.tsx",
            ],
            "rules": {
                "eol-last": ["warn"],
                "eqeqeq": ["warn"],
                "no-trailing-spaces": ["warn"],
                "prefer-spread": "off",
            }
        },
        {
            "files": [
                "*.js",
                "*.jsx",
            ],
            "extends": [
                "eslint:recommended",
            ],
            "rules": {
                "comma-spacing": ["warn"],
                "keyword-spacing": ["warn"],
                "indent": ["warn", 4],
                "no-unused-vars": ["warn", {
                    "args": "none"
                }],
                "semi": ["warn", "always"],
                "space-before-blocks": ["warn"],
                "space-before-function-paren": ["warn", "always"],
            }
        },
        {
            "files": [
                "*.ts",
                "*.tsx",
            ],
            "extends": [
                "plugin:@typescript-eslint/eslint-recommended",
                "plugin:@typescript-eslint/recommended",
                "plugin:@typescript-eslint/recommended-requiring-type-checking",
            ],
            "parser": "@typescript-eslint/parser",
            "parserOptions": {
                "project": ["./src/tsconfig.json"],
                // "tsconfigRootDir": __dirname,
            },
            "plugins": [
                "@typescript-eslint"
            ],
            "rules": {
                "@typescript-eslint/comma-spacing": ["warn"],

                "@typescript-eslint/explicit-module-boundary-types": ["off", {
                    "allowArgumentsExplicitlyTypedAsAny": true
                }],

                "@typescript-eslint/indent": [
                    "warn",
                    4,
                    {
                        "ignoredNodes": [
                            "PropertyDefinition[decorators]",
                            "TSUnionType",
                            "TSTypeParameterInstantiation",
                            "TSIntersectionType"
                        ]
                    }
                ],

                "@typescript-eslint/keyword-spacing": ["warn"],
                "@typescript-eslint/no-empty-function": "off",
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/no-inferrable-types": "off",
                "@typescript-eslint/no-this-alias": "off",
                "@typescript-eslint/no-unused-vars": ["warn", {
                    "args": "none"
                }],
                "@typescript-eslint/no-var-requires": "off",
                "@typescript-eslint/semi": ["warn", "always"],
                "@typescript-eslint/space-before-blocks": ["warn"],
                "@typescript-eslint/space-before-function-paren": ["warn", "always"],
                "@typescript-eslint/type-annotation-spacing": ["warn"],

                "@typescript-eslint/no-unsafe-return":  "warn",
            }
        },
    ]
};
