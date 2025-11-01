import ytdl from "ytdl-core";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function downloadYT(url, type, tmpDir, baseUrl) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const ext = type === "mp3" ? "mp3" : "mp4";
    const outputPath = path.join(tmpDir, `${id}.${ext}`);

    const stream = ytdl(url, {
      filter: type === "mp3" ? "audioonly" : "videoandaudio",
      quality: type === "mp3" ? "highestaudio" : "18"
    });

    stream.pipe(fs.createWriteStream(outputPath));

    stream.on("end", () => {
      resolve(`${baseUrl}/tmp/${id}.${ext}`);
    });

    stream.on("error", reject);
  });
}
