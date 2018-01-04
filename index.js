var fs = require('fs')
var util = require('util')
var path = require('path')
var assert = require('assert')
var postcss = require('postcss')
var Watcher = require('postcss-watcher')

var readFile = util.promisify(fs.readFile)

module.exports = middleware

function middleware (opts) {
  opts = opts || {}

  assert(!opts.plugin || Array.isArray(opts.plugins), 'koa-postcss-watch: opts.plugins must be an array')

  var cache = {}

  if (opts.file) cache[opts.file] = watch(opts.file, opts)

  return async function (ctx, next) {
    ctx.type = 'text/css'
    if (opts.file) {
      ctx.body = await cache[opts.file].processing
    } else {
      var file = path.resolve(opts.root || '', format(ctx.path))
    if (!cache[file]) cache[file] = watch(file, opts)
      ctx.body = await cache[file].processing
    }
  }
}

// start watching file and process on change
// (str, obj) -> obj
function watch (file, opts) {
  var plugins = opts.plugins || []
  var watcher = new Watcher(opts)
  var bundle = postcss(plugins.concat(watcher.plugin()))

  // ensure absolute file paths
  if (!path.isAbsolute(file)) file = path.resolve(process.cwd(), file)

  var cache = {
    file: file,
    watcher: watcher,
    processing: process(file)
  }

  cache.watcher.on('change', function () {
    cache.processing = process(file, bundle)
  })

  return cache
}

// process file with bundle
// str -> Promise
function process (file, bundle) {
  return readFile(file, 'utf8').then(function (content) {
    bundle.process(content, { from: file }).then(function (result) {
      return result.css
    })
  })
}

// clean up request path as file path
// str -> str
function format (str) {
  return str.replace(/^\//, '').replace(/\?.+$/, '')
}
