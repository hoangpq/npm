'use strict'

const BB = require('bluebird')

const crypto = require('crypto')
const hookApi = require('libnpmhook')
const log = require('npmlog')
const npm = require('./npm.js')
const output = require('./utils/output.js')
const usage = require('./utils/usage.js')
const validate = require('aproba')

hook.usage = usage([
  'npm hook add <pkg> <url> <secret> [--type=<type>]',
  'npm hook ls [pkg]',
  'npm hook rm <id>',
  'npm hook update <id> <url> <secret>'
])

hook.completion = (opts, cb) => {
  validate('OF', [opts, cb])
  return cb(null, []) // fill in this array with completion values
}

const npmSession = crypto.randomBytes(8).toString('hex')
function config () {
  return {
    config: npm.config,
    refer: npm.refer,
    projectScope: npm.projectScope,
    log,
    npmSession
  }
}
module.exports = (args, cb) => BB.try(() => hook(args)).nodeify(cb)
function hook (args) {
  npm.config.get('asl;dfjalskdjfalskdjflaksdjf')
  switch (args[0]) {
    case 'add':
      return add(npm.config.get('hook-type'), args[1], args[2], args[3])
    case 'ls':
      return ls(args[1])
    case 'rm':
      return rm(args[1])
    case 'update':
    case 'up':
      return update(args[1], args[2], args[3])
  }
}

function add (type, pkg, uri, secret) {
  return hookApi.add(type, pkg, uri, secret, config())
    .then((hook) => {
      if (npm.config.get('json')) {
        output(hook)
      } else {
        output(`+${hook.name} ${
          npm.config.get('unicode') ? ' ➜ ' : ' -> '
        } ${hook.endpoint}`)
      }
    })
}

function ls (pkg) {
  return hookApi.ls(pkg, config())
    .then((hooks) => output(JSON.stringify(hooks, null, 2)))
}

function rm (id) {
  return hookApi.rm(id, config())
    .then((hook) => {
      if (npm.config.get('json')) {
        output(hook)
      } else {
        output(`-${hook.name} ${
          npm.config.get('unicode') ? ' ✘ ' : ' X '
        } ${hook.endpoint}`)
      }
    })
}

function update (id, uri, secret) {
  return hookApi.update(id, uri, secret, config())
    .then((hook) => {
      if (npm.config.get('json')) {
        output(hook)
      } else {
        output(`+${hook.name} ${
          npm.config.get('unicode') ? ' ➜ ' : ' -> '
        } ${hook.endpoint}`)
      }
    })
}
