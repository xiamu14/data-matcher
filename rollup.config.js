import typescript from 'rollup-plugin-typescript2';
import filesize from 'rollup-plugin-filesize';
import pkg from './package.json';

// 构建两个文件
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
        // include: ['src'],
        tsconfigDefaults: {
          include: ['./src/*'],
          exclude: ['./src/v1/*'],
        },
      }),
    ],
  },
  {
    input: 'src/v1/index.ts',
    output: {
      name: pkg.name,
      dir: 'dist/v1',
      format: 'umd',
    },

    plugins: [
      filesize(),
      typescript({
        tsconfigDefaults: {
          include: ['./src/v1/*'],
        },
      }),
    ],
  },
];
