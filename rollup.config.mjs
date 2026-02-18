import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const year = new Date().getFullYear();
const date = new Date().toISOString().slice(0, 10);

const banner = `/*!-----------------------------------------------------------------------------
 * ${pkg.description}
 * v${pkg.version} - built ${date}
 * Licensed under the MIT License.
 * http://vegas.jaysalvat.com/
 * ----------------------------------------------------------------------------
 * Copyright (C) 2010-${year} Jay Salvat
 * http://jaysalvat.com/
 * --------------------------------------------------------------------------*/`;

export default [
  {
    input: 'src/vegas.js',
    output: {
      file: 'dist/vegas.js',
      format: 'es',
      banner
    }
  },
  {
    input: 'src/vegas.js',
    output: {
      file: 'dist/vegas.min.js',
      format: 'es',
      sourcemap: true,
      banner,
      plugins: [
        terser({
          mangle: true,
          format: { comments: /^!/ }
        })
      ]
    }
  }
];
