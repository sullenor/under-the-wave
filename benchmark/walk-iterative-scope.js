'use strict'

const acorn = require('acorn')
const fs = require('fs')
const { walk } = require('../lib/t-script-utils-walk')
const scopePlugin = require('../lib/t-script-utils-scope')

const { abspath, iterations } = require('./walk')

const content = fs.readFileSync(abspath, 'utf8')
const options = { ecmaVersion: 'latest', sourceType: 'module' }
const ast = acorn.parse(content, options)

let count = iterations
const time = Date.now()
while (count--) {
  walk(ast, {}, scopePlugin())
}
const totalTime = Date.now() - time
console.log(
  'iterative walk: %s opts/sec (%sms)',
  (iterations * 1000 / totalTime).toFixed(0),
  totalTime
)

const m = process.memoryUsage()
console.log()
console.log(' - rss:       %s', m.rss.toLocaleString())
console.log(' - heapTotal: %s', m.heapTotal.toLocaleString())
console.log(' - heapUsed:  %s', m.heapUsed.toLocaleString())
console.log()
