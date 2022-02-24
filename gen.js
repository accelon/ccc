/* generate offtext from CCC html */
import {kluer, writeChanged,nodefs, readTextLines,} from 'pitaka/cli'
import { autoAlign } from 'pitaka/utils';
const {yellow} =kluer;
await nodefs
import {  filesOfBook,combineHTML } from './ccc-folder.js';
import {sc} from 'pitaka/meta';

const ccc_folder='html/';
const desfolder='off/';
const scfolder='../sc/pli/'
console.log(yellow('syntax'),'node gen [bkid/bkpf]');
const pat=process.argv[2]||"dn1"

const pitaka=sc.pitakaOf(pat);
const books=sc.booksOf(pat);
const nikayamapping=[];
books.forEach(book=>{
    const files=filesOfBook(book,ccc_folder);
    const [bookcontent,bookmapping]=combineHTML(files,ccc_folder,book);
    let outcontent=bookcontent;
    const sccontent=readTextLines(scfolder+book+'.off');
    outcontent=autoAlign(outcontent.join("\n").split('\n'),sccontent);
    if (outcontent.length!==sccontent.length) {
        console.log('align failed',book)
    }
    if (outcontent.length && writeChanged(desfolder+book+'.off',outcontent.join('\n'))){
        console.log('written',book, outcontent.length)
    }
    if (books.length) {
        nikayamapping.push(...bookmapping);
    }
})
if (books.length>1 && writeChanged(pat+'-srcmap.txt',nikayamapping.join('\n'))) {
    nikayamapping.unshift("file\tbkpn\tc#\tlength")
    console.group('written mapping',pat+'-srcmap.txt')
}