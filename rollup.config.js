import terser from '@rollup/plugin-terser'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))
const year = new Date().getFullYear()
const date = new Date().toISOString().slice(0, 10)

const banner = `/*!-----------------------------------------------------------------------------
 * ${pkg.description}
 * v${pkg.version} - built ${date}
 * Licensed under the MIT License.
 * http://vegas.jaysalvat.com/
 * ----------------------------------------------------------------------------
 * Copyright (C) 2010-${year} Jay Salvat
 * http://jaysalvat.com/
 * --------------------------------------------------------------------------*/`

export default [
  // Vanilla build
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
  },
  // Vanilla IIFE build (window.vegas global for <script> tag usage)
  {
    input: 'src/vegas.js',
    output: {
      file: 'dist/vegas.iife.js',
      format: 'iife',
      name: 'vegas',
      banner
    }
  },
  {
    input: 'src/vegas.js',
    output: {
      file: 'dist/vegas.iife.min.js',
      format: 'iife',
      name: 'vegas',
      sourcemap: true,
      banner,
      plugins: [
        terser({
          mangle: true,
          format: { comments: /^!/ }
        })
      ]
    }
  },
  // jQuery wrapper build (IIFE, auto-registers with global jQuery/Zepto/m4q)
  {
    input: 'src/jquery.vegas.js',
    output: {
      file: 'dist/jquery.vegas.js',
      format: 'iife',
      name: 'jqueryVegas',
      banner
    }
  },
  {
    input: 'src/jquery.vegas.js',
    output: {
      file: 'dist/jquery.vegas.min.js',
      format: 'iife',
      name: 'jqueryVegas',
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
]
