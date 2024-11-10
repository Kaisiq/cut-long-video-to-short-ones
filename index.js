import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

//  <===== Settings start ======>
const inputVideo = "/some/path/to/video.mp4";
const outputDirectory = "/some/output/folder";
const titleShowTime = 5; //seconds
const titleText = `Part`; // without number, its added in function

const fontfileLocation = ""; // if you want to change font, set to path of ttf file

//  <===== Settings end ======>

const inputVideoList = inputVideo.split("/");
const outputVideoName = inputVideoList[inputVideoList.length - 1];

function randomDuration(min, max) {
  return Math.random() * (max - min) + min;
}

async function createVideoParts(
  inputVideo,
  outputDirectory,
  minDuration = 61,
  maxDuration = 77,
) {
  const videoDuration = await getVideoDuration(inputVideo);
  let startTime = 0;
  let clipNumber = 1;

  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  while (startTime < videoDuration) {
    const clipDuration = Math.min(
      randomDuration(minDuration, maxDuration),
      videoDuration - startTime,
    );
    const outputFilename = path.join(
      outputDirectory,
      `${outputVideoName} - P${clipNumber}.mp4`,
    );

    await new Promise((resolve, reject) => {
      ffmpeg(inputVideo)
        .videoFilters({
          filter: "drawtext",
          options: {
            text: `${titleText} ${clipNumber}`,
            fontfile: fontfileLocation,
            fontsize: 50,
            fontcolor: "white",
            x: "(main_w/2-text_w/2)",
            y: 100,
            enable: `between(t,${startTime},${startTime + titleShowTime})`,
          },
        })
        .setStartTime(startTime)
        .setDuration(clipDuration)
        .output(outputFilename)
        .on("end", () => {
          console.log(
            `Created video part ${clipNumber} from ${startTime} to ${startTime + clipDuration} seconds`,
          );
          resolve();
        })
        .on("error", reject)
        .run();
    });

    startTime += clipDuration;
    clipNumber += 1;
  }

  console.log("All video parts created successfully");
}

function getVideoDuration(inputVideo) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputVideo, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration);
    });
  });
}

createVideoParts(inputVideo, outputDirectory).catch(console.error);
