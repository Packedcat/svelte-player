基于 hls 的播放器，使用 svelte 绘制前端

### 调试相关

nginx 指定 hls 资源目录

```nginx
location /hls {
    types {
        application/vnd.apple.mpegurl m3u8;
        video/mp2t ts;
    }
    root /usr/share/nginx/html;
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
    add_header Cache-Control no-cache;
}
```

视频预览

##### Step1

使用 ffmpeg 生成预览用的精灵图

```shell
ffmpeg -i "$input_video" -vf "select='not(mod(n,$thumbnail_gap))',scale=$width:$height,tile=${columns}x${rows}" -frames:v 1 "$output_sprite"
```

变量说明

- input_video：输入视频路径
- thumbnail_gap：两张预览图的间隔，单位为帧
- width：缩略图宽，单位为像素
- height：缩略图高，单位为像素
- output_sprite：精灵图输出路径
- columns：列，由预览图间隔与总帧数确定
- rows：行，同上

##### Step2

根据视频长度、预览图间隔、预览图宽高、帧率生成 `.vtt` 文件

```typescript
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
```

入参说明

- duration：视频长度，单位秒
- thumbnailGap：同上一步，注意单位秒
- outputVTTFileName：输出 `.vtt` 文件名
- spriteFileLocation：上一步输出的精灵图路径（注意是精灵图路径基于 `.vtt` 文件的相对网络路径）
- thumbnailWidth: 同上一步
- thumbnailHeight：同上一步
- tileSize: 上一步的 columns 变量
