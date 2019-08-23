# webpack-strip-function

Webpack plugin to strip any function call that you specified that are only intended for development purposes

## Install

### NPM

```bash
npm i --save-dev webpack-strip-assert
```

### Yarn

```bash
yarn add -D webpack-strip-assert
```

## Example

```JavaScript
// webpack.config.js

const path = require("path");

module.exports = env => {
  return {
    entry: "./index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "webpack-strip-assert",
          options: {
            funcCall: "assert"
          }
        }
      ]
    }
  };
};
```

```JavaScript
// index.js

console.log("Hello webpack-strip-function");

function add(a, b) {
  return a + b;
}
assert("Add result should be 2", add(1, 1));
```

Then run `webpack --mode production` in bash, you will get bellow ☟

```JavaScript
// dist/index.js

...
console.log("Hello webpack-strip-function"); // assert function call be removed!🙆 ‍
```

## TODO

- Support remove multip function call

## LICENSE

[MIT](LICENSE)

## AUTHOR

<Aiello.Chan@gmail.com>
