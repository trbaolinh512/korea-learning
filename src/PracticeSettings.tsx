import { useEffect, useRef } from 'react';
import { Settings, X } from 'lucide-react';
export interface PracticeOptions { seconds: number; showNext: boolean }
export function SettingsButton({onClick}: {onClick:()=>void}) {
  return <button className="icon-button" aria-label="Cài đặt luyện tập" title="Cài đặt luyện tập" onClick={onClick}><Settings size={20}/></button>;
}
export default function PracticeSettings({kind,options,onChange,onClose}: {kind:'quiz'|'writing'|'grammar'; options:PracticeOptions;onChange:(value:PracticeOptions)=>void;onClose:()=>void}) {
  const ref=useRef<HTMLDialogElement>(null);
  const title=kind==='quiz'?'trắc nghiệm':kind==='grammar'?'ngữ pháp':'luyện viết';
  const description=kind==='quiz'?'0 = không đếm ngược. Đúng, sai hoặc hết giờ đều tự chuyển sau 1 giây.':kind==='grammar'?'Số giây chờ sau khi kiểm tra hoặc xem câu mẫu. Đặt 0 để tự bấm Câu tiếp.':'Mặc định 1 giây. Đặt 0 để tắt tự chuyển và dùng nút Câu tiếp.';
  useEffect(()=>{ref.current?.showModal()},[]);
  return <dialog className="practice-dialog panel" ref={ref} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}}><div className="quiz-heading"><h2>Cài đặt {title}</h2><button className="icon-button" autoFocus aria-label="Đóng cài đặt" onClick={onClose}><X size={20}/></button></div><label className="practice-setting">{kind==='quiz'?'Thời gian trả lời mỗi câu (giây)':kind==='grammar'?'Thời gian tự chuyển câu (giây)':'Tự chuyển sau khi viết đúng (giây)'}<input aria-label={kind==='quiz'?'Thời gian mỗi câu':kind==='grammar'?'Thời gian tự chuyển câu':'Thời gian tự chuyển chữ'} type="number" min="0" max="300" value={options.seconds} onChange={e=>onChange({...options,seconds:Math.min(300,Math.max(0,Math.floor(Number(e.target.value)||0)))})}/></label><p className="muted small">{description}</p><label className="practice-check"><input type="checkbox" checked={options.showNext} onChange={e=>onChange({...options,showNext:e.target.checked})}/> Hiện nút Câu tiếp</label><p className="muted small">Thiết lập được lưu tự động.</p><button className="primary full-width" onClick={onClose}>Xong</button></dialog>;
}


