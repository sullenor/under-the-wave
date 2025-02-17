'use strict'

const assert = require('assert')
const { PassThrough, Transform, finished, pipeline } = require('stream')

function createBufferStream () {
  const bufferStream = new Transform({
    construct (done) {
      this.chunks = []
      done()
    },

    transform (chunk, encoding, done) {
      this.chunks.push(chunk)
      done()
    },

    flush (done) {
      const buffer = Buffer.concat(this.chunks)
      this.chunks.length = 0

      bufferStream.buffer = buffer

      done(null, buffer)
    }
  })

  return bufferStream
}

function createTransformStream (tf, context) {
  return new Transform({
    objectMode: true,

    transform (chunk, encoding, done) {
      const string = chunk.toString(encoding)
      tf(string, context, done)
    }
  })
}

function tee (output) {
  assert(output != null)

  const t = new PassThrough()
  t.pipe(output)

  return t
}

module.exports = {
  createBufferStream,
  createTransformStream,
  tee
}
