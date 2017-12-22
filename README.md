<div align="center">

# koa-postcss-watch 🏓

[![npm version][0]][1] [![build status][2]][3]
[![downloads][4]][5]
[![style][6]][7]

Be lazy. Watch and process css on the fly with PostCSS.

</div>

## Usage

```javascript
var Koa = require('koa')
var mount = require('koa-mount')
var watch = require('koa-postcss-watch')
var app = new Koa()

if (process.env.NODE_ENV === 'development') {
  app.use(mount('/bundle.css', watch({
    file: 'lib/index.css',
    plugins: [require('postcss-import'), require('autoprefixer')]
  })))
}

app.use(function (ctx) {
  ctx.body = `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <link rel="stylesheet" href="/bundle.css">
    </head>
    <body>
      Hello world
    </body>
    </html>
  `
})

app.listen(process.env.PORT)
```

## API

### `koaPostcss([opts])`

Create a middleware function. If `opts.file` is not defined, path to file will be resolved to `ctx.path` relative to `opts.root` or `process.cwd()`.

### Options

Options are forwarded to both [chokidar](https://github.com/paulmillr/chokidar) and [postcss](https://github.com/postcss/postcss).

- **file** `<string>` CSS entry file
- **root** `<string>` Path from which to resolve file paths (defaults to cwd)
- **plugins** `[<string>]` List of plugins to use with postcss

## Install

```bash
$ npm install -S koa-postcss-watch
```

## License

MIT

[0]: https://img.shields.io/npm/v/koa-postcss-watch.svg?style=flat-square
[1]: https://npmjs.org/package/koa-postcss-watch
[2]: https://img.shields.io/travis/codeandconspire/koa-postcss-watch/master.svg?style=flat-square
[3]: https://travis-ci.org/codeandconspire/koa-postcss-watch
[4]: http://img.shields.io/npm/dm/koa-postcss-watch.svg?style=flat-square
[5]: https://npmjs.org/package/koa-postcss-watch
[6]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[7]: https://standardjs.com
