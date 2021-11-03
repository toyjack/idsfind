import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';

import pkg from "./package.json";

const sourcemap = true;

export default [
  // {
  //   input: "src/index.ts",
  //   output: [
  //     {
  //       file: pkg.module,
  //       sourcemap,
  //       format: "umd",
  //       name: "idsfind"
  //     },
  //     {
  //       file: pkg.main,
  //       format: "cjs",
  //       exports: "auto",
  //       sourcemap,
  //     },
  //   ],
  //   plugins: [
  //     typescript(), 
  //     json(),
  //     filesize()
  //   ],
  // },
  {
    input: "src/scripts/update.ts",
    output:{
      file: "scripts/update.js",
      format: "cjs"
    },
    plugins:[
      typescript(),
      json(),
      filesize(),
      commonjs(),
      nodeResolve()
    ],
  }
  
]