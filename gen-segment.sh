#!/bin/bash

if [ -n "$1" ]; then
  input_video="$1"
else
  input_video="input.mp4"
fi

ffmpeg -i $input_video \
  -vf "scale=1920:1080" \
  -c:v h264 -profile:v main -g 48 -keyint_min 48 -sc_threshold 0 \
  -b:v 3000k -s 1920x1080 -hls_time 4 -hls_playlist_type vod \
  -hls_segment_filename 1080p_%03d.ts 1080p_index.m3u8 \
  -vf "scale=1280:720" \
  -c:v h264 -profile:v main -g 48 -keyint_min 48 -sc_threshold 0 \
  -b:v 1500k -s 1280x720 -hls_time 4 -hls_playlist_type vod \
  -hls_segment_filename 720p_%03d.ts 720p_index.m3u8 \
  -vf "scale=854:480" \
  -c:v h264 -profile:v main -g 48 -keyint_min 48 -sc_threshold 0 \
  -b:v 500k -s 854x480 -hls_time 4 -hls_playlist_type vod \
  -hls_segment_filename 480p_%03d.ts 480p_index.m3u8

echo "#EXTM3U" >index.m3u8
echo "#EXT-X-STREAM-INF:BANDWIDTH=500000,RESOLUTION=854x480" >>index.m3u8
echo "480p_index.m3u8" >>index.m3u8
echo "#EXT-X-STREAM-INF:BANDWIDTH=1500000,RESOLUTION=1280x720" >>index.m3u8
echo "720p_index.m3u8" >>index.m3u8
echo "#EXT-X-STREAM-INF:BANDWIDTH=3000000,RESOLUTION=1920x1080" >>index.m3u8
echo "1080p_index.m3u8" >>index.m3u8
