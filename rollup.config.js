import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import rimraf from 'rimraf';

//Clear build directory
rimraf.sync('build')

//Main views
const input = [
    './src/components/my-app.js', 
    './src/components/my-view1.js',
    './src/components/my-view2.js',
    './src/components/my-view3.js'
]

export default [{
  input,
  output: [
    {
      dir: 'build/esm-bundled',
      format: 'esm'
    }
  ],
  plugins: [
    resolve({
      // use "jsnext:main" if possible
      // legacy field pointing to ES6 module in third-party libraries,
      // deprecated in favor of "pkg.module":
      // - see: https://github.com/rollup/rollup/wiki/pkg.module
      jsnext: true,  // Default: false
    })
  ]
},
{
  input,
  output: [
    {
      dir: 'build/es5-bundled',
      format: 'system'
    }
  ],
  plugins: [
    resolve({
      // use "jsnext:main" if possible
      // legacy field pointing to ES6 module in third-party libraries,
      // deprecated in favor of "pkg.module":
      // - see: https://github.com/rollup/rollup/wiki/pkg.module
      jsnext: true,  // Default: false
    }),
    babel({
      "presets": [
        ["@babel/preset-env", {"targets": {"ie": "11"}}]
      ],
      "plugins": ["@babel/plugin-syntax-dynamic-import"]
    })
  ]
}];