export interface InkPoint { x:number; y:number }
export interface InkGuide { width:number; height:number }

/** Fit ink into the guide without stretching its shape; discard only invalid coordinates. */
export function prepareInk(strokes:InkPoint[][],guide:InkGuide):InkPoint[][] {
  const valid=strokes.map(s=>s.filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y))).filter(s=>s.length);
  if(!valid.length)return [];
  const points=valid.flat(),xs=points.map(p=>p.x),ys=points.map(p=>p.y);
  const left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);
  const padding=Math.min(guide.width,guide.height)*.08;
  const width=Math.max(1,right-left),height=Math.max(1,bottom-top);
  const scale=Math.min((guide.width-2*padding)/width,(guide.height-2*padding)/height,4);
  const x=(guide.width-width*scale)/2,y=(guide.height-height*scale)/2;
  return valid.map(s=>s.map(p=>({x:x+(p.x-left)*scale,y:y+(p.y-top)*scale})));
}

function pointSegmentDistance(p:InkPoint,a:InkPoint,b:InkPoint){
  const dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy;
  const t=length?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/length)):0;
  return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);
}

function intersect(a:InkPoint,b:InkPoint,c:InkPoint,d:InkPoint){
  const cross=(p:InkPoint,q:InkPoint,r:InkPoint)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);
  const abC=cross(a,b,c),abD=cross(a,b,d),cdA=cross(c,d,a),cdB=cross(c,d,b);
  return abC*abD<0&&cdA*cdB<0;
}

/** Erase whole strokes touched by an eraser sweep, including between pointer samples. */
export function eraseInk(strokes:InkPoint[][],from:InkPoint,to:InkPoint,radius:number):InkPoint[][]{
  return strokes.filter(stroke=>{
    if(stroke.some(p=>pointSegmentDistance(p,from,to)<=radius))return false;
    for(let i=1;i<stroke.length;i++){
      const a=stroke[i-1],b=stroke[i];
      if(intersect(from,to,a,b)||Math.min(pointSegmentDistance(from,a,b),pointSegmentDistance(to,a,b),pointSegmentDistance(a,from,to),pointSegmentDistance(b,from,to))<=radius)return false;
    }
    return true;
  });
}

/** Compare full text, including correct spacing, while tolerating Unicode composition and punctuation. */
export function normalizeKoreanAnswer(text:string){
  return text.normalize('NFC').replace(/[.,!?。！？“”"'‘’]/g,'').trim().replace(/\s+/g,' ');
}
