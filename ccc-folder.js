/* ccc files by book code*/
import { meta_sc,readTextContent} from 'ptk/nodebundle.cjs'
import {cleanHTML,completeBook} from "./cleanhtml.js"
// import { breakMN } from './breakmn.js';
export const FilesOfBook={
        dn1:["DN/DN{1-13}"], 
        dn2:["DN/DN{14-23}"],
        dn3:["DN/DN{24-34}"],
        mn1:["MN/MN{1-50}"],
        mn2:["MN/MN{51-100}"],
        mn3:["MN/MN{101-152}"],
        sn1:["SN/SN{1-271}"] , 
        sn2:["SN/SN{272-518}"] , 
        sn3:["SN/SN{519-851}"] , 
        sn4:["SN/SN{852-1195}"] ,
        sn5:["SN/SN{1196-1806}"] ,
        an1:["AN/AN{1-228}"], 
        an2:["AN/AN{229-423}"], 
        an3:["AN/AN{424-582}"], 
        an4:["AN/AN{583-860}"], 
        an5:["AN/AN{861-1131}"], 
        an6:["AN/AN{1132-1256}"], 
        an7:["AN/AN{1257-1357}"], 
        an8:["AN/AN{1358-1453}"], 
        an9:["AN/AN{1454-1532}"], 
        an10:["AN/AN{1533-1741}"], 
        an11:["AN/AN{1742-1764}"], 
}
export const filesOfBook=(pat,rootfolder)=>meta_sc.getFilesOfBook(pat,FilesOfBook,rootfolder);

const combineMN10=zh=>{////合併119-135
    const from=zh.indexOf('^n120');
    const to=zh.indexOf('^n136');
    // console.log(nextline,to)
    zh=zh.substring(0,from)+zh.substr(to);
    zh=zh.replace('^n119','^n119-135');
    return zh;
}
export const combineHTML=(files=[],rootfolder,bkid)=>{
    const out=[];
    const mapping=[];
    files.forEach((fn,idx)=>{
        const rawcontent=readTextContent(rootfolder+fn);
        let {zh,pli,comm,paranum,cid}=cleanHTML(rawcontent,fn,bkid,idx==0);
        // if (fn.substr(0,2)=='MN') zh=breakMN(fn,zh,pli,paranum);
        if (fn=="MN/MN010.htm") zh=combineMN10(zh);
        mapping.push( fn.substr(3)+'\t'+bkid+'.'+paranum+'\t'+cid+'\t'+zh.length );
        if (zh) out.push(zh);
    })
    completeBook(bkid,files);
    return [out,mapping];
}