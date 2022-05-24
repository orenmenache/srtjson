import * as fs from 'fs';
import * as path from 'path';

const defaultCommentDuration = 3; //seconds
const watchFolderPath = `c:/test/`; //path of json files

interface Author {
    id: string,
    displayName: string,
    initials: string,
    photoURL: string | null,
    isCurrentUser: boolean
}

interface JSONComment {
    id: string,
    author: Author,
    timestamp: string, //date string
    content: string,
    timeSecs: number
}

interface JSONCommentWrapper {
    id: string,
    timeSecs: number,
    comments: JSONComment[];
}

type JSONCommentFile = JSONCommentWrapper[];

function parse(JCF: JSONCommentFile){
    for (let n in JCF){
        let wrapper: JSONCommentWrapper = JCF[n];
        let comment: JSONComment = wrapper.comments[0];
        let author: Author = comment.author;
        let name = author.displayName;
        console.log(`name: ${name} time ${comment.timeSecs}`);
    }
}

function main(){
    let files = fs.readdirSync(watchFolderPath);
    files.forEach(file => {
        if (isJsonFile(file)){
            let fileNameClean = path.parse(file).name;
            let SRT = '';
            let commentCounter = 0;
            let resolved = path.resolve(watchFolderPath,file);
            let JCF = require(resolved) as JSONCommentFile;
            JCF.forEach((wrapper: JSONCommentWrapper) => {
                commentCounter++;
                let commentSTR = `${commentCounter}\n`;
                let comment: JSONComment = wrapper.comments[0];
                let time: string = convertTimeSecs(comment.timeSecs);
                let add: string = convertTimeSecs(comment.timeSecs + defaultCommentDuration);
                let timeStr = `${time} --> ${add}`;
                commentSTR += `${timeStr}\n`;
                let content: string = `<b>${comment.content}<b>\n\n`;
                commentSTR += content;
                SRT += commentSTR;
            });
            let resolveWrite = path.resolve(watchFolderPath,`${fileNameClean}.srt`);
            fs.writeFileSync(resolveWrite,SRT);
        }
    });
}

function convertTimeSecs(timeSecs: number): string {
    let milliSecs = timeSecs * 1000;
    let date = new Date(milliSecs).toUTCString();
    let splitted = date.split(' ')[4].split(':');
    let hours = (Number(splitted[0])+1).toString();
    if (hours.length<2){hours = `0${hours}`}
    let minutes = splitted[1];
    if (minutes.length<2){minutes = `0${minutes}`}
    let seconds = splitted[2];
    if (seconds.length<2){seconds = `0${seconds}`}
    let str = `${hours}:${minutes}:${seconds},001`;
    console.log(str);
    return str;
}

function isJsonFile(fileName: string){
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