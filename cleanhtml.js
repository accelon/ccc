import {meta_cs,patchBuf, toBase26,autoChineseBreak,combineHeaders} from 'ptk/nodebundle.cjs'
import {errata_zh, errata_pli} from './errata.js'
import { getSNParanum, getANParanum, getAnVagga } from './paranum.js';
const VOLPNCluster={};
const buildPNCluster=()=>{
    let vol=0;
    for (let id in meta_cs.FirstPN) {
        if (id[0]==='s') {
            const pn=meta_cs.FirstPN[id];
            if (pn===1) vol++;
            VOLPNCluster[vol+'.'+pn]=id;
        }
    }
}
buildPNCluster()
const volpnOf=fn=>{
    const fnm=fn.match(/(\d+)/);
    const n=parseInt(fnm[1]); //莊的編號
    if (n<=271) return 1;
    else if (n<=518) return 2;
    else if (n<=851) return 3;
    else if (n<=1195) return 4;
    return 5;
}
const parseLocalComm=buf=>{
    buf=buf.replace(/<span id="note(\d+)">/g,'^fn$1')
    .replace(/<br>　　/g,'').replace(/<\/span>/g,'')
    .replace('<span class="sutra_name">漢巴經文比對</span>(莊春江作)：','')
    .replalce(/<\/div>\n/g,'').replalce(/<\/body>\n<\html>/,'')
    return buf
}

const parseSuttaName=(str,bkpf,fn,pnum)=>{
    let clusterid='',title='',paranum='';
    if (bkpf==='sn'){
        const m=str.match(/(\d+)相應 ?([\d\-]+)經\/?(.*)/);
        if (!m) console.log("wrong pattern",fn)
        const vol=volpnOf(fn);
        const volpn=vol+'.'+pnum;
        clusterid=meta_cs.chunkByVolPn[volpn];
        if (clusterid) delete VOLPNCluster[volpn];//for residue check
        title=m[3].replace('/','')||'';//SN1527.htm 無經名
        paranum=pnum;
    } else if(bkpf==='an'){
        const m=str.match(/(\d+)集([\d\-]+)經\/?(.*)/);
        if (!m) console.log(fn,str)
        const vol=m[1];
        const vagga=getAnVagga(fn);
        if (vagga) {
            clusterid=bkpf[0]+vol+toBase26(vagga-1);
        }
        paranum=pnum;
        title=m[3];
    } else {
        const m=str.match(/(\d+)經\/(.+)$/);
        clusterid=bkpf[0]+m[1];
        title=m[2];
        paranum=pnum;
    }
    const firstpara=(clusterid)?meta_cs.firstParanumOf(clusterid):clusterid;

    if (firstpara) {
        return (title?'^ck#'+clusterid+'('+title+')':'')+'^n'+firstpara+' ';
    } else if (paranum) {
        return (title?'^h('+title+')':'')+(paranum&&paranum!=="*"?'^n'+paranum:'') +' ';
    }
    return '';
}

export const completeBook=(bookid,files)=>{
    // console.log("complete",bookid,'files',files.length);
    const vol=bookid.substr(2);
    if (bookid.substr(0,2)=='sn') {
        for (let i in VOLPNCluster) {
            if (i.substring(0,1)==vol) {
                console.log('residue of sn',i);
            }
        }
    }
}
export const ABulk={"DN/DN01":'^ak#dn(長部)',"MN/MN01":'^ak#mn(中部)',"SN/SN01":'^ak#sn(相應部)',"AA/AN01":'^ak#an(增支部)'}
export const cleanHTML=(content,fn,bkid,firstFile)=>{
    const zhstart=content.indexOf('<div class="nikaya">');
    const palistart=content.indexOf('<div class="pali">')
    const commstart=content.indexOf('<div class="comp">')
    const bkpf=bkid.replace(/\d+/,'');
    if (zhstart==-1 || palistart==-1) {
        throw "missing start markup "+fn;
    }
    let pli=content.substring(palistart,commstart);
    let zh=content.substring(zhstart+21,palistart);
    zh=patchBuf(zh,errata_zh[fn],fn);
    pli=patchBuf(pli,errata_pli[fn],fn);

    let suggestingpnum='',cid, paranum;
    if (bkpf=='sn') {
        suggestingpnum=getSNParanum(pli,bkid,fn);
    } else if (bkpf==='an') {
        suggestingpnum=getANParanum(pli,bkid,fn);
    }
    if (suggestingpnum=="discard") return {zh:'',comm:''};//discard this file

    let comm=(commstart>0)?content.substr(commstart+18):'';

    // zh=zh.replace(/<\!([\d\-]+)>\n<br>　　/g,"^n$1 ");
    // zh=zh.replace(/<\!([\d\-]+)>\n<br>/g,"^n$1 ");
    // zh=zh.replace(/<\!([\d\-]+)>/g,"^n$1 ");
    zh=zh.replace(/<\![^>]+>\n/g,"");
    // zh=zh.replace(/(\([\d\-]+)\)\n/g,"\n");

    zh=zh.replace(/<a onMouseover="note\(this,(\d+)\);">([^>]+?)<\/a>/g,"$2"); //drop global note
    //deal with <a onMouseover="note(this,435);"><a onMouseover="note(this,435);">貪婪</a>者</a>
    zh=zh.replace(/<a onMouseover="note\(this,(\d+)\);">([^>]+?)<\/a>/g,"$2"); //drop global note
    //local 通常較長，會包住note
    zh=zh.replace(/<a onMouseover="local\(this,(\d+)\);">([^>]+?)<\/a>/g,(m,fn,txt)=>{
        //save the length of txt in footnotes
        return txt+"^f"+fn;
    });
    // zh=zh.replace(/<a onMouseover="note\(this,(\d+)\);?">([^>]+?)<\/a>/g,"$2"); //drop global note

    let last='';
//小標可能有、
    zh=zh.replace(/\(([\d\-]+)\) *\n<br>([\(\)\.\d\- \u3400-\u9fff‧「」〔〕、\[\]]+)\n<br>　+/g,(m,m1,m2)=>{ //接小標
        const head='^h['+m2+']^n'+(parseInt(m1)+1);
        return '\n'+head;
    });
    zh=zh.replace(/\(([\d\-]+)\) *\n<br>　+/g,(m,m1)=>{//接正文
        last='^n'+(parseInt(m1)+1);
        return '\n'+last;
    });

    zh=zh.replace(/\(([\d\-]+)\) *\n/g,(m,m1)=>{//最後一個
        last='^n'+(parseInt(m1)+1);
        return '\n'+last;
    });

    zh=zh.replace(last,''); //last one is redundant


    zh=zh.replace(/<div id="east">\n?/,'')
    zh=zh.replace(/<span class="sutra_name">([^>]+)<\/span>.*\n/g,(m,m1)=>{
        const headline=parseSuttaName(m1,bkpf,fn,suggestingpnum);
        const mm=headline.match(/\^ck#([a-z\d]+)/);
        cid=mm?mm[1]:'';     //emitted clusterid
        const mm2=headline.match(/\^n([\-\d]+)/);
        paranum=mm2?mm2[1]:'';//emitted paranum
        return headline;
    });
    
    zh=zh.replace(/\(莊春江譯\)/g,'')
    zh=zh.replace(/對那位世尊、阿羅漢、遍正覺者禮敬/g,'');
    zh=zh.replace(/<\/div>\n?/g,'')
    zh=zh.replace(/<br>\^/g,'^')
    zh=zh.replace(/([^h])\[([\u3400-\u9fff]+)\]/g,'$1〔$2〕'); //半形[]轉全形

    //是小標題
    zh=zh.replace(/<br>([\(\)\d\- \.\u3400-\u9fff‧〔〕]+)/g,'^h($1)');



    //是小標
    zh=zh.replace(/\^n([\d\-]+) ([\.\u3400-\u9fff‧〔〕]+)\n\^n /g,"^h[$2]^n$1 ") //如dn1 226-249

    zh=zh.replace(/\n<br>　　/g,"\n");
    zh=zh.replace(/ <br>　　/g,"");


    zh=zh.replace(/\^n([\d\-]+) \^n /g,"^n$1") //redundant



    //品名與 cluster 合併一行  可能多於一行
    zh=zh.replace(/\n([\(\)\d\-\. \u3400-\u9fff‧〔〕]+)\n\^ck/g,'^h[$1]^ck');
    zh=zh.replace(/\n([\(\)\d\-\. \u3400-\u9fff〔〕]+)\n\^h/g,(m,m1)=>
        m1.indexOf('完成')==-1?'\n^h['+m1+']^h':"\n"+m1+'\n^h'); //可能是pannasaka

   

    zh=zh.replace(/\n<br>\n/g,'');

    zh=zh.split('\n').map(autoChineseBreak).join('\n');
    
    if (firstFile) {
        const at=zh.indexOf('^ck');
        if (at==-1) {
            console.log('missing ^ck in first file')
        } else {
            const headers=zh.substr(0,at).replace(/\n/g,'');
            zh=(ABulk[fn.replace(/\.htm/,'')]||'')+'^bk#'+bkid+headers+zh.substr(at);
        }
    } else {
        zh=combineHeaders(zh);
        // zh=ensurefirstLineHasPN(zh);
    }

    //品名接小標
    // zh=zh.replace(/\n([\(\)\d\- \.\u3400-\u9fff‧〔〕]+)\n\^h/g,'\n^h[$1]^h');
    // zh=zh.replace(/\n([\(\)\d\- \.\u3400-\u9fff‧〔〕]+)\n\^ck/g,'\n^h[$1]^ck');
    
    //chunk與n 合併
    zh=zh.replace(/(\^ck#[a-z\d]+)\n(\^n\d+)/g,"$1$2");

    
    return {zh,comm,paranum,cid,pli}
}