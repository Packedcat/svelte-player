import fs from 'fs'
import { argv } from 'process'

function secondsToHMS(time) {
  if (typeof time === 'number' && time >= 0) {
    let seconds = Math.floor(time % 60)
    let minutes = Math.floor((time * 1.0) / 60)
    let hours = 0
    if (minutes > 59) {
      hours = Math.floor((time * 1.0) / 3600)
      minutes = Math.floor((((time * 1.0) / 3600) % 1) * 60)
      seconds = Math.floor(time % 60)
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (hours > 0) {
      hours = hours + ':'
    } else if (hours === 0) {
      hours = ''
    }
    return hours + minutes + ':' + seconds + '.000'
  } else {
    return ''
  }
}

function genVTTFile(
  duration,
  thumbnailGap,
  outputVTTFileName = 'sprite.vtt',
  spriteFileLocation = 'sprite.jpg',
  thumbnailWidth = 128,
  thumbnailHeight = 72,
  tileSize = 10,
) {
  try {
    fs.unlinkSync(outputVTTFileName)
    console.log(outputVTTFileName + ' already exists - deleted it')
  } catch (err) {
    console.log(outputVTTFileName + ' does not exist - will create it')
  }

  fs.appendFileSync(outputVTTFileName, 'WEBVTT\n\n')

  const count = Math.floor(duration / thumbnailGap) + 1
  const thumbnailSizeString = ',' + thumbnailWidth + ',' + thumbnailHeight + '\n\n'

  let currentTime = 0
  let xCoordinates = 0
  let yCoordinates = 0

  for (let i = 0; i <= count; i++) {
    if (currentTime > duration) {
      break
    }
    const startTime = secondsToHMS(currentTime)
    currentTime += thumbnailGap
    const endTime = secondsToHMS(currentTime)
    if (!startTime || !endTime) {
      console.log(
        'Error: could not determine startTime or endTime for VTT item number ' + i + ' - exit',
      )
      return
    }
    let string = startTime + ' --> ' + endTime + '\n'
    string += spriteFileLocation + '#xywh=' + xCoordinates + ',' + yCoordinates
    string += thumbnailSizeString
    xCoordinates += thumbnailWidth
    if (xCoordinates > thumbnailWidth * (tileSize - 1)) {
      yCoordinates += thumbnailHeight
      xCoordinates = 0
    }
    fs.appendFileSync(outputVTTFileName, string)
  }
}

genVTTFile(+argv[2], +argv[3], argv[4], argv[5], +argv[6], +argv[7], +argv[8])
