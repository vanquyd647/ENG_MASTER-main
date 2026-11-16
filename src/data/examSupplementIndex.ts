export const EXAM_SUPPLEMENT_INDEX:Record<string,readonly [string,number]>=Object.fromEntries(['handover','parking'].flatMap(id=>[1,2,3].map(i=>['p7-accept-v1-'+id+'-q'+i,['part7',4]])));
