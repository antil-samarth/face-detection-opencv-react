import cv, { min } from "@techstark/opencv-js";
import { loadDataFile } from "./cvDataFile";

const msize = new cv.Size(0, 0);
let faceCascade;
let faceDetectedTime = 0;
let totalTime = 0;

export async function loadHaarFaceModels() {
  console.log("=======start downloading Haar-cascade models=======");
  return loadDataFile(
    "haarcascade_frontalface_default.xml",
    "models/haarcascade_frontalface_default.xml"
  )
    .then(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            // load pre-trained classifiers
            faceCascade = new cv.CascadeClassifier();
            faceCascade.load("haarcascade_frontalface_default.xml");
            resolve();
          }, 2000);
        })
    )
    .then(() => {
      console.log("=======downloaded Haar-cascade models=======");
    })
    .catch((error) => {
      console.error(error);
    });
}

export function detectHaarFace(img, count) {
  // const newImg = img.clone();
  const newImg = img;

  const gray = new cv.Mat();
  cv.cvtColor(newImg, gray, cv.COLOR_RGBA2GRAY, 0);

  const faces = new cv.RectVector();
  const minSize = new cv.Size(120, 120);
  // detect faces
  faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, minSize);
  for (let i = 0; i < faces.size(); ++i) {
    const point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
    const point2 = new cv.Point(
      faces.get(i).x + faces.get(i).width,
      faces.get(i).y + faces.get(i).height
    );
    cv.rectangle(newImg, point1, point2, [255, 0, 0, 255]);
    faceDetectedTime += 1 / 24;
  }
  totalTime += 1 / 24; // Add 1/24 seconds for each frame processed
  gray.delete();
  faces.delete();

  return newImg, (faceDetectedTime / totalTime) * 100;
}

