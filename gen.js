/* generate offtext from CCC html */
import {meta_sc,autoAlign, writeChanged,nodefs, readTextLines,} from 'ptk/nodebundle.cjs'
import {yellow,red} from 'ptk/cli/colors.cjs';
await nodefs
import {  filesOfBook,combineHTML } from './ccc-folder.js';

const ccc_folder='html/';
const desfolder='off/';
const scfolder='../sc/pli/'
console.log(yellow('syntax'),'node gen [bkid/bkpf]');
const pat=process.argv[2]||"dn1"

const books=meta_sc.booksOf(pat);
const nikayamapping=[];
books.forEach(book=>{
    const files=filesOfBook(book,ccc_folder);
    const [bookcontent,bookmapping]=combineHTML(files,ccc_folder,book);
    let outcontent=bookcontent;
    const sccontent=readTextLines(scfolder+book+'.ms.off');
    outcontent=autoAlign(outcontent.join("\n").split('\n'),sccontent);
    if (outcontent.length!==sccontent.length) {
        console.log('align failed',book)
    }
    const linecountwarning=outcontent.length!==sccontent.length?red("!="+sccontent.length):'';
    if (outcontent.length && writeChanged(desfolder+book+'.ccc.off',outcontent.join('\n'))){
        console.log('written',book,  'line count',outcontent.length,linecountwarning)
    } else {
        console.log('same',book,  'line count',outcontent.length,linecountwarning);
    }
    if (books.length) {
        nikayamapping.push(...bookmapping);
    }
})
if (books.length>1 && writeChanged(pat+'-srcmap.txt',nikayamapping.join('\n'))) {
    nikayamapping.unshift("file\tbkpn\tc#\tlength")
    console.group('written mapping',pat+'-srcmap.txt')
}