from pathlib import Path
import json, zipfile, xml.etree.ElementTree as ET, sys
from pypdf import PdfReader

root=Path('documents')
out=Path('tmp/sources');out.mkdir(parents=True,exist_ok=True)
selected=['42 CẤU TRÚC NGỮ PHÁP TIẾNG HÀN CƠ BẢN.pdf','NGU PHAP TIENG HAN SO CAP.pdf','TOPIK I - 1000 TU VUNG.pdf','TỪ VỰNG TOPIK THEO CHỦ ĐỀ.pdf']
manifest=[]
for path in root.rglob('*'):
    if path.suffix=='.docx':
        with zipfile.ZipFile(path) as z:
            tree=ET.fromstring(z.read('word/document.xml'))
        ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        lines=[''.join(p.itertext()) for p in []]
        lines=[''.join(p.itertext()) for p in tree.findall('.//w:p',ns)]
        # Each w:t occurs once in itertext; paragraph order retains tables.
        text='\n'.join(lines)
        dest=out/(path.stem+'.txt');dest.write_text(text,encoding='utf8')
        manifest.append({'path':str(path),'paragraphs':len(lines),'chars':len(text)})
    elif path.name in selected and '--docx-only' not in sys.argv:
        doc=PdfReader(path)
        pages=[{'page':i+1,'text':page.extract_text() or ''} for i,page in enumerate(doc.pages)]
        (out/(path.stem+'.json')).write_text(json.dumps(pages,ensure_ascii=False,indent=2),encoding='utf8')
        manifest.append({'path':str(path),'pages':len(doc.pages),'chars':sum(len(p['text']) for p in pages)})
        if '42 ' in path.name:
            import pdfplumber
            with pdfplumber.open(path) as visual: visual.pages[0].to_image(resolution=100).save(out/'grammar-page-1.png')
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(manifest,ensure_ascii=False,indent=2))

