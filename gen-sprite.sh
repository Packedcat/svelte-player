#!/bin/bash

function ceil() {
  echo "($1 + $2 - 1)/$2" | bc
}

if [ -n "$1" ]; then
  input_video="$1"
else
  input_video="input.mp4"
fi

output_sprite="sprite.jpg"
output_vtt="sprite.vtt"

width=128
height=72
columns=10
thumbnail_gap=120

duration=$(ffprobe -v error -select_streams v:0 -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${input_video})
total_frames=$(ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames -of default=noprint_wrappers=1:nokey=1 ${input_video})
frame_rate=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 ${input_video})
frame_rate=$(echo "scale=3; $frame_rate" | bc)
thumbnail_count=$(echo "scale=0; $total_frames / $thumbnail_gap" | bc)
# cacl rows
rows=$(echo "scale=0; $(ceil $thumbnail_count $columns)" | bc)
# calc thumbnail gap time
thumbnail_gap_time=$(echo "scale=3; $thumbnail_gap / $frame_rate" | bc)
# gen sprite file
ffmpeg -i "$input_video" -vf "select='not(mod(n,$thumbnail_gap))',scale=$width:$height,tile=${columns}x${rows}" -frames:v 1 "$output_sprite"

# gen vtt file
node gen-vtt.mjs $duration $thumbnail_gap_time $output_vtt $output_sprite $width $height $columns
