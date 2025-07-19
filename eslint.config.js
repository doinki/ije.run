import { join } from 'node:path';

import { config, includeIgnoreFile } from 'eslint-config-mado';
import { generateConfig as importConfig } from 'eslint-config-mado/import';
import { generateConfig as jsConfig } from 'eslint-config-mado/javascript';
import { generateConfig as prettierConfig } from 'eslint-config-mado/prettier';
import { generateConfig as reactConfig } from 'eslint-config-mado/react';
import { generateConfig as sortConfig } from 'eslint-config-mado/sort';
import { generateConfig as tsConfig } from 'eslint-config-mado/typescript';
import { generateConfig as unicornConfig } from 'eslint-config-mado/unicorn';
import globals from 'globals';

const gitignorePath = join(import.meta.dirname, '.gitignore');

export default config(
  includeIgnoreFile(gitignorePath),
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  jsConfig(),
  tsConfig({ tsconfigRootDir: import.meta.dirname }),
  importConfig({ project: join(import.meta.dirname, 'tsconfig.json') }),
  reactConfig(),
  unicornConfig(),
  sortConfig(),
  prettierConfig(),
);
