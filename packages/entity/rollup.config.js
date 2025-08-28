import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import replace from '@rollup/plugin-replace'

const name = 'index';

const bundle = config => ({
  ...config,
  input: 'src/index.ts',
  external: id => !/^[./]/.test(id),
})

export default [
  bundle({
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          'process.envType': `'node'`
        }
      }),
      esbuild(),
    ],
    output: [
      {
        file: `./dist/${name}.js`,
        format: 'es',
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          'process.envType': `'browser'`
        }
      }),
      esbuild(),
    ],
    output: [
      {
        file: `./dist/browser/${name}.js`,
        format: 'es',
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: [
      {
        file: `./dist/${name}.d.ts`,
        format: 'es',
      }
    ],
  }),
]


