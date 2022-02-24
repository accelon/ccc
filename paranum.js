const ExpandSN5={270:'270-279',280:'280-291',292:'292-301',302:'302-310'};
export const getSNParanum=(pli,bkid,fn)=>{
    let sn_pnum;
    if (bkid=='sn1' || bkid=='sn2') {//直接用檔名，因為hangnum 被去除，巴利原文無段號
        sn_pnum=parseInt(fn.match(/(\d+)/)[1]);
        if (sn_pnum>271) sn_pnum-=271;//第二冊
        if (fn==='SN/SN0345.htm') {
            sn_pnum="";//和sn00344是同一段 sn2.73
        }
        if (bkid=='sn2') { //sn0345是多出來的，減一
            if (sn_pnum>=75) sn_pnum--
        }
        sn_pnum=sn_pnum.toString();
    } else if (bkid.substr(0,2)=='sn') {//從巴利文取出的 VRI 段號
        const m=pli.match(/<br>[　 ]*([\-\d+]+)\./);
        if (!m) {
            // console.log('no pnum in',fn)
        } else {
            sn_pnum=m[1];
        }
        if (fn==='SN/SN0519.htm') sn_pnum="1";//被 <br>22.(1). Khandhasaṃyuttaṃ 干擾
        else if (fn==='SN/SN0678.htm') sn_pnum="160";//被 1. Pathamavaggo 干擾
        else if (fn==='SN/SN0704.htm') sn_pnum="206";//被 <br>1. Sotāpattivaggo 干擾
        else if (fn==='SN/SN0723.htm') sn_pnum="*";//225-240 241 合併，手工在errata 修正, *表示輸出 經名但不輸出^n
        else if (fn==='SN/SN0733.htm') sn_pnum="*";//251-274 275 合併
        else if (fn==='SN/SN0735.htm') sn_pnum="*";//277-300 301 合併
        else if (fn==='SN/SN0852.htm') sn_pnum="1";//被 <br>35.(1). Saḷāyatanasaṃyuttaṃ干擾 sn35
        else if (fn==='SN/SN1053.htm') sn_pnum="249";//被 <br>1. Sagāthāvaggo 干擾 sn36
        else if (fn==='SN/SN1084.htm') sn_pnum="280";//被 <br>1. Paṭhamapeyyālavaggo干擾 sn37
        else if (fn==='SN/SN1170.htm') sn_pnum="366";//被 <br>1. Paṭhamavaggo干擾 sn43
//sn4
//sn5
        else if (fn==='SN/SN1196.htm') sn_pnum="1";
        else if (fn==='SN/SN1311.htm') sn_pnum="182";
        else if (fn==='SN/SN1398.htm') sn_pnum="367";
        else if (fn==='SN/SN1453.htm') sn_pnum="471";

        else if (fn==='SN/SN1524.htm') sn_pnum="553-586";

        else if (fn==='SN/SN1529.htm') sn_pnum="651-662";
        else if (fn==='SN/SN1530.htm') sn_pnum="663-672";
        else if (fn==='SN/SN1534.htm') sn_pnum="705-716";
        else if (fn==='SN/SN1535.htm') sn_pnum="717-748";
        else if (fn==='SN/SN1536.htm') sn_pnum="discard";
        else if (fn==='SN/SN1539.htm') sn_pnum="771-791";
        
        else if (fn==='SN/SN1542.htm') sn_pnum="813";

        else if (fn==='SN/SN1575.htm') sn_pnum="857-888";
        else if (fn==='SN/SN1577.htm') sn_pnum="899";
        else if (fn==='SN/SN1601.htm') sn_pnum="923-934";
        else if (fn==='SN/SN1602.htm') sn_pnum="935-966";
        else if (fn==='SN/SN1604.htm') sn_pnum="977";
        else if (fn==='SN/SN1624.htm') sn_pnum="997";
        else if (fn==='SN/SN1698.htm') sn_pnum="1071";

        if (bkid==='sn5') { 
            sn_pnum=ExpandSN5[sn_pnum]||sn_pnum;
        }
    }
    return sn_pnum;
}
export const getANParanum=(pli,bkid,fn)=>{
    let an_pnum;
    const m=pli.match(/<br>[　 ]*([\-\d+]+)\./);
    if (fn==='AN/AN0132.htm') an_pnum="188";  //誤判為 <br>1. Paṭhamavaggo 
    else if (fn==='AN/AN0139.htm') an_pnum="268";  
    else if (fn==='AN/AN0161.htm') an_pnum="296";  
    else if (fn==='AN/AN0434.htm') an_pnum="11";
    else if (fn==='AN/AN0444.htm') an_pnum="21";
    else if (fn==='AN/AN0485.htm') an_pnum="62";
    else if (fn==='AN/AN0881.htm') an_pnum="21";
    else if (fn==='AN/AN0901.htm') an_pnum="41";
    else if (fn==='AN/AN1120.htm') an_pnum="272";
    else if (fn==='AN/AN1186.htm') an_pnum="55";
    else if (fn==='AN/AN1196.htm') an_pnum="65";
    else if (fn==='AN/AN1331.htm') an_pnum="75";
    else if (fn==='AN/AN1368.htm') an_pnum="11";
    else if (fn==='AN/AN1388.htm') an_pnum="31";
    else if (fn==='AN/AN1495.htm') an_pnum="42";
    else if (fn==='AN/AN1527.htm') an_pnum="82";//因 74-81 在同一檔
    else if (fn==='AN/AN1529.htm') an_pnum="92";//因 84-91 在同一檔
    if (m && !an_pnum) an_pnum=m[1];
    if (!an_pnum)  console.log('no pnum in',fn,an_pnum);

    return an_pnum;
}
const ANVagga={ //AN file name to vagga
    //1 11 21 31 41 51 61 71 82 98  140  ^n
    //150 170 188 268 296 366-381 382 563 600
    1:1,11:2,21:3,31:4,41:5,51:6,61:7,71:8,82:9,98:10,  //an1
    116:11,119:12,125:13,132:14,139:15,161:16,211:17,212:18,218:19,228:20,
    
    //1 11 22 33 43 53 65 78 88 99 119    //an2
    //131 142 152 164 181 191-200  201 231 
    229:1,239:2,250:3,261:4,271:5,281:6,293:7,306:8,316:9,327:10, 
    347:11,359:12,370:13,380:14,392:15,409:16,419:17,420:18,422:19, 
    
    // 1,  11,    21,    31    41,     52    62     72     82     93   //an3
    // 104 114 124 134 147 157-163  164-183 184
    424:1, 434:2, 444:3, 454:4, 464:5, 475:6, 485:7 , 495:8, 505:9, 516:10,
    527:11,  537:12, 547:13, 557:14, 570:15, 580:16, 581:17, 582:18, 

    // 1 11 21 31 41 51 61 71 81 91      //an4
    // 101 111 121 131 141 151 161 171 181 191 
    // 201 211 221 232 243 254  264  274
    583:1, 593:2, 603:3, 613:4, 623:5, 633:6 , 643:7, 653:8, 663:9, 673:10,
    683:11, 693:12, 703:13, 713:14, 723:15, 733:16 , 743:17, 753:18, 763:19, 773:20,
    783:21, 793:22, 803:23, 814:24, 825:25, 836:26, 846:27 , 856:28,
    
    // 1 11 21 31 41 51 61 71 81 91   //an5
    // 101 111 121 131 141 151 161 171 181 191
    //  201 211 221 231 241 251 272 286 303 
    861:1, 871:2, 881:3, 891:4, 901:5, 911:6 , 921:7, 931:8, 941:9, 951:10,
    961:11, 971:12, 981:13, 991:14, 1001:15, 1011:16 , 1021:17, 1031:18, 1041:19,1051:20,
    1061:21,1071:22,1081:23,1091:24,1101:25,1111:26 , 1120:27, 1122:28,1126:29,
    
    // 1 11 21 31 43 55 65 75 85 96  107   117 140 //an6
    1132:1,1142:2,1152:3,1162:4,1174:5,1186:6,1196:7,
    1206:8,1216:9,1227:10,1238 :11 ,1248:12,1252:13,
    
    // 1 11 21 32 44 54 65  75 85 95 623 //an7
    1257:1,1267:2,1277:3,1288:4,1300:5,1310:6,1321:7,1331:8,1341:9,1351:10,1353:11,
    
    // 1 11 21 31 41 51 61 71 81 91-116  117   //an8
    1358:1,1368:2,1378:3,1388:4,1398:5,1408:6,1418:7,1428:8,1438:9,1448:10, 1449:11, 
    
    // 1 11 21 32 42 52 63 73 83 93  //an9
    1454:1,1464:2,1474:3,1485:4,1495:5,1505:6,1516:7,1526:8,1528:9, 1530:10,
    
    // 1 11 21 31 41 51 61 71 81 91   //an10
    // 101 113 123 134  145 155 167 178 189 199 
    // 211 221 237 
    1533:1,1543:2,1553:3,1563:4,1573:5,1583:6,1593:7,1603:8,1613:9,1623:10,
    1633:11,1645:12,1655:13,1666:14,1677:15,1687:16,1689:17,1700:18,1711:19,1721:20,
    1723:21,1733:22,1738:23,

    // 1 11 22-29  503  //an11
    1742:1, 1752:2, 1763:3, 1764:4
}
export const getAnVagga=(fn)=>{ //從莊的html檔名取得每冊的第幾卷
    const n=fn.match(/(\d+)/)[1];
    return ANVagga[parseInt(n)];
}