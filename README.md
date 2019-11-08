# umi-plugin-externals

[![NPM version](https://img.shields.io/npm/v/umi-plugin-externals.svg?style=flat)](https://npmjs.org/package/umi-plugin-externals)
[![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-externals.svg?style=flat)](https://npmjs.org/package/umi-plugin-externals)


A umi plugin to help you make local built module as webpack external bundle, you can pre-build some modules then use this plugin to improve the performance of building.

## Install

```bash
npm install umi-plugin-externals --save-dev
```

or yarn

```bash
yarn add umi-plugin-externals -D
```

## Usage

Configure in `.umirc.js`,

```js
export default {
  plugins: [
    [
      'umi-plugin-externals',
      // options, given an example of 'lodash'
      {
        'lodash': ['_', 'local/path/to/lodash'],
      },
    ],
  ],
}
```

## Options

```typescript
{ 
  [moduleName: string]: [string | object | Function | RegExp, string]; 
}
```

The key of option is webpack [Externals](https://webpack.js.org/configuration/externals/)'s key, the value of option should be an array.

For the array, the first item is webpack [Externals](https://webpack.js.org/configuration/externals/)'s value(a global variable string is recommended), the second item is the local built module path in file system, you should pre-built the module and set corresponding global variable in the pre-built bundle. 

## LICENSE

MIT
