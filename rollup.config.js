import babel from 'rollup-plugin-babel'
const packageJson = require('./package.json')
const version = packageJson.version
const homepage = packageJson.homepage

const banner = `
/*!
 * draggable-lst v${version}
 * open source under the MIT license
 * ${homepage}
 */
`

export default {
  external: ['vue'],
  input: 'src/index.js',
  output: {
    format: 'umd',
    file: 'dist/index.js',
    name: 'draggable',
    sourcemap: false,
    banner: banner.replace(/\n/, '')
  },
  plugins: [
    babel()
  ]
}
