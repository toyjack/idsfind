import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import filesize from 'rollup-plugin-filesize';
import commonjs from "@rollup/plugin-commonjs";


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
      typescript(
       {
        tsconfig: "./tsconfig.json",
       }
      ), 
      json(),
      commonjs(),
      filesize()
    ],
  },
  
]