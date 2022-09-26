import json from "@rollup/plugin-json";
import filesize from 'rollup-plugin-filesize';
import esbuild from 'rollup-plugin-esbuild'

import pkg from "./package.json";

const sourcemap = true;

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.module,
        sourcemap,
        format: "umd",
        name: "idsfind"
      },
      {
        file: pkg.main,
        format: "cjs",
        exports: "auto",
        sourcemap,
      },
    ],
    plugins: [
      esbuild({
        exclude: [/node_modules/,"**/scripts/*.ts",],
      }),
 
      json(),
      filesize()
    ],
  },
  
]