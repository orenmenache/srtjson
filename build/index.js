"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const defaultCommentDuration = 3; //seconds
const watchFolderPath = `c:/test/`; //path of json files
function parse(JCF) {
    for (let n in JCF) {
        let wrapper = JCF[n];
        let comment = wrapper.comments[0];
        let author = comment.author;
        let name = author.displayName;
        console.log(`name: ${name} time ${comment.timeSecs}`);
    }
}
function main() {
    let files = fs.readdirSync(watchFolderPath);
    files.forEach(file => {
        if (isJsonFile(file)) {
            let fileNameClean = path.parse(file).name;
            let SRT = '';
            let commentCounter = 0;
            let resolved = path.resolve(watchFolderPath, file);
            let JCF = require(resolved);
            JCF.forEach((wrapper) => {
                commentCounter++;
                let commentSTR = `${commentCounter}\n`;
                let comment = wrapper.comments[0];
                let time = convertTimeSecs(comment.timeSecs);
                let add = convertTimeSecs(comment.timeSecs + defaultCommentDuration);
                let timeStr = `${time} --> ${add}`;
                commentSTR += `${timeStr}\n`;
                let content = `<b>${comment.content}<b>\n\n`;
                commentSTR += content;
                SRT += commentSTR;
            });
            let resolveWrite = path.resolve(watchFolderPath, `${fileNameClean}.srt`);
            fs.writeFileSync(resolveWrite, SRT);
        }
    });
}
function convertTimeSecs(timeSecs) {
    let milliSecs = timeSecs * 1000;
    let date = new Date(milliSecs).toUTCString();
    let splitted = date.split(' ')[4].split(':');
    let hours = (Number(splitted[0]) + 1).toString();
    if (hours.length < 2) {
        hours = `0${hours}`;
    }
    let minutes = splitted[1];
    if (minutes.length < 2) {
        minutes = `0${minutes}`;
    }
    let seconds = splitted[2];
    if (seconds.length < 2) {
        seconds = `0${seconds}`;
    }
    let str = `${hours}:${minutes}:${seconds},001`;
    console.log(str);
    return str;
}
function isJsonFile(fileName) {
    let ext = path.parse(fileName).ext;
    return ext == `.json`;
}
main();
/*
//const sch = (`node-schedule`);

chartSchedule();

function chartSchedule(){
    //let noonScheduleCron = `* `
    for (let n in j){
        console.log(`n ${n} ${j[n]}`);
    }
}

const MISC = {
    arrayIndexOf<T>(arr: T[],value: T): number {
        for (let i=0; i<arr.length; i++){
            if (arr[i] == value){
                return i;
            }
        }
        return -1;
    },
}

const SCH = {
    
}

const testDate = new Date(2022,4,24,11,17,0,0)
sch.scheduleJob(testDate, () => {
    console.log(`scheduled`);
})*/ 
