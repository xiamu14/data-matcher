import typescript from 'rollup-plugin-typescript2';
import filesize from 'rollup-plugin-filesize';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.ts',
    output: {
      name: pkg.name,
      file: 'dist/index.js',
      format: 'umd',
    },
    plugins: [
      filesize(),
      typescript({
        declaration: true,
      }),
    ],
  },
  {
    input: 'src/lib.ts',
    output: {
      name: pkg.name,
      file: 'dist/lib/index.js',
      format: 'umd',
    },
    plugins: [
      filesize(),
      typescript({
        declaration: true,
      }),
    ],
  },
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  // {
  //     input: 'src/main.ts',
  //     external: ['ms'],
  //     output: [
  //         { file: pkg.main, format: 'cjs' },
  //         { file: pkg.module, format: 'es' }
  //     ]
  // }
];
