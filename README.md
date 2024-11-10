# video-cutting-tiktok-1minute

## Getting Started:

- install [Bun](https://bun.sh)
- install dependencies with `bun install`
- edit index.json settings
  - reside in the first lines of the file
- run with `bun index.js`

## What does this app do:

- The app splits the given video path to multiple videos with varying length
  - from 61 to 77 seconds
- Adds centered text on top that says `Part #` where # is the current video
- Each video has the name `% - P#` where `%` is your video file name and `#` is the current cutted video

## Notes:

- Ensure the output folder exists or you have permissions to create folders in specified path
  - same stands for when using custom ttf

## To do:

- Move the configurations into `config.js` file
- Add hashtags to videos for faster upload to tiktok, etc.
- Add fps configuration
- Add avif format
