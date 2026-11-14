import { shuffle } from './lib';
export function newCycle<T extends {id:string}>(pool:T[], recent:string[]):T[] {
  const items=shuffle(pool);
  const safe=items.findIndex(item=>!recent.includes(item.id));
  if(safe>0)[items[0],items[safe]]=[items[safe],items[0]];
  return items;
}
export interface InkPoint { x:number; y:number }
export function handwritingPayload(strokes:InkPoint[][],guide={width:256,height:256}) {
  return {options:'enable_homework_spellcheck',requests:[{writing_guide:guide,ink:strokes.map(stroke=>[stroke.map(p=>Math.round(p.x)),stroke.map(p=>Math.round(p.y))]),language:'ko'}]};
}
export const handwritingURL='https://inputtools.google.com/request?itc=ko-t-i0-handwrit&app=mobilesearch';
export async function recognizeHandwriting(strokes:InkPoint[][],signal:AbortSignal,guide={width:256,height:256}):Promise<string[]> {
  let response:Response;
  try { response=await fetch(handwritingURL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(handwritingPayload(strokes,guide)),signal}); }
  catch { throw new Error('Lỗi kết nối nhận diện. Hãy kiểm tra mạng và nhấn Kiểm tra để thử lại.'); }
  if(!response.ok)throw new Error('Không kết nối được dịch vụ nhận diện. Hãy kiểm tra mạng và thử lại.');
  const data:unknown=await response.json();
  if(!Array.isArray(data)||data[0]!=='SUCCESS'||!Array.isArray(data[1])||!Array.isArray(data[1][0])||!Array.isArray(data[1][0][1]))throw new Error('Không nhận diện được. Hãy viết lại rõ hơn và kiểm tra lại.');
  return data[1][0][1].filter((value:unknown):value is string=>typeof value==='string');
}
