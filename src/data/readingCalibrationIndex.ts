export const CALIBRATED_READING_INDEX:Record<string,readonly [string,number]>=Object.fromEntries([
 ...['delivery','training','renovation','membership'].flatMap(id=>[1,2,3,4].map(i=>['p6-calibrated-v1-'+id+'-'+i,['part6',4]])),
 ...['store','invoice','recruitment','train'].flatMap(id=>[1,2,3].map(i=>['p7-calibrated-v1-'+id+'-'+i,['part7',4]])),
]);
