/* globals expect,test */
'use strict'

const path = require('path')
const posthtml = require('posthtml')

const pluginFixFilePath = require('../lib/t-posthtml-fix-file-path')

async function transform (content, plugins) {
  const result = await posthtml(plugins).process(content)
  return result.html
}

test('update img path', async () => {
  const options = {
    abspath: '/',
    resolve (a, b) {
      return path.resolve(a, b)
    }
  }

  const code = `
    <img src='./a.png' />
  `
  const expected = `
    <img src="/a.png">
  `

  const result = await transform(code, [pluginFixFilePath(options)])
  expect(result).toBe(expected)
})

test('update link path', async () => {
  const options = {
    abspath: '/',
    resolve (a, b) {
      return path.resolve(a, b)
    }
  }

  const code = `
    <link rel='stylesheet' href='./a.css' />
  `
  const expected = `
    <link rel="stylesheet" href="/a.css">
  `

  const result = await transform(code, [pluginFixFilePath(options)])
  expect(result).toBe(expected)
})

test('update script path', async () => {
  const options = {
    abspath: '/',
    resolve (a, b) {
      return path.resolve(a, b)
    }
  }

  const code = `
    <script type=module src=./a.js></script>
  `
  const expected = `
    <script type="module" src="/a.js"></script>
  `

  const result = await transform(code, [pluginFixFilePath(options)])
  expect(result).toBe(expected)
})
