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
        values: {
          'process.envType': `'node'`
        }
      }),
      esbuild(),
    ],
    output: [
      {
        file: `./dist/node/${name}.cjs`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `./dist/${name}.es.js`,
        format: 'es',
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [
      replace({
        values: {
          'process.envType': `'browser'`
        }
      }),
      esbuild(),
    ],
    output: [
      {
        file: `./dist/browser/${name}.mjs`,
        format: 'es',
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: [
      {
        file: `./dist/types/${name}.d.ts`,
        format: 'es',
      },
      {
        file: `./dist/${name}.d.ts`,
        format: 'es',
      }
    ],
  }),
]