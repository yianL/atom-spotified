'use babel'

import util from 'util'
import { exec } from 'child_process'
import applescript from 'applescript'
import { Errors } from './constants'

const runscript = (file) => new Promise((resolve, reject) => {
  applescript.execFile(file, (error, result) => {
    if (error) { reject(error) }

    try {
      if (result) {
        resolve(JSON.parse(result))
      } else {
        reject(new Error(Errors.NO_DATA))
      }
    } catch (e) {
      reject(new Error(Errors.JSON_PARSE_ERROR))
    }

  });
})

const getState = () => runscript(`${__dirname}/scripts/getState.applescript`)
const getTrack = () => runscript(`${__dirname}/scripts/getTrack.applescript`)

export default {
  getState,
  getTrack
}
