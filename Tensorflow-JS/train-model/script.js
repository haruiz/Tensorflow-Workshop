import DrawableCanvas from "./canvas.js";
import FMnistClassifier from "./fashion-classifier.js";

const btnClear = document.getElementById("btnClear");
const btnTrain = document.getElementById("btnTrain");
const btnPredict = document.getElementById("btnClassify");
const btnDownload = document.getElementById("btnDownload");
   

const main = ()=>{
    const canvas = new DrawableCanvas(document.getElementById("canvas"));    
    const model = new FMnistClassifier();
    
    btnClear.onclick =()=> canvas.clear();   
    btnTrain.onclick =()=> model.train();   
    btnPredict.onclick =()=> model.predict(canvas.getImageTensor());   
    btnDownload.onclick =()=> model.download();   
}

document.addEventListener('DOMContentLoaded', main);