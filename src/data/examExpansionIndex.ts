// Compact immutable registry: validation does not import full passages/scripts.
const groups: [string, string, number][] = [
  ...['registration','restaurant','printer','hotel','interview','catering','software','bicycle-repair','supplies','travel','library'].map(id => ['p3-exam-v1-'+id, 'part3', 3] as [string,string,number]),
  ...['shuttle','opening','safety','order','presentation','maintenance','recruitment','lost-property'].map(id => ['p4-exam-v1-'+id, 'part4', 3] as [string,string,number]),
  ...Object.entries({fitness:3,course:3,returns:3,appointment:2,venue:5,shipment:5,volunteer:5,conference:5,supplier:5}).map(([id,n]) => ['p7-exam-v1-'+id,'part7',n] as [string,string,number]),
];
export const EXAM_EXPANSION_INDEX: Record<string, readonly [string, number]> = Object.fromEntries(groups.flatMap(([id,kind,n]) => Array.from({length:n},(_,i) => [id+'-q'+(i+1),[kind,4]])));
