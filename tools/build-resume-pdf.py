"""Build the downloadable resume from the website's article content.
Run with a Python environment containing reportlab and pypdf.
"""
from pathlib import Path
from html.parser import HTMLParser
from html import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
class ResumeParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.active=False; self.kind=None; self.text=[]; self.blocks=[]
    def handle_starttag(self,tag,attrs):
        if tag=='article': self.active=True
        if not self.active: return
        if tag in ('h1','h2','h3','p','li') or (tag=='div' and dict(attrs).get('class')=='contact'):
            self.kind=tag;self.text=[]
        if tag=='span' and self.active and not self.kind:self.kind='span';self.text=[]
        if tag in ('strong','em') and self.kind:self.text.append('<b>' if tag=='strong' else '<i>')
    def handle_data(self,data):
        if self.active and self.kind:self.text.append(escape(data.replace('–','-').replace('—','-').replace('∼','~')))
    def handle_endtag(self,tag):
        if tag in ('strong','em') and self.kind:self.text.append('</b>' if tag=='strong' else '</i>')
        if tag=='a' and self.kind=='div':self.text.append(' | ')
        if self.active and self.kind==tag:
            text=''.join(self.text).strip(' |')
            if tag=='span' and self.blocks and self.blocks[-1][0]=='h3':
                previous=self.blocks.pop();self.blocks.append(('h3',previous[1]+(' | '+text if text else '')))
            else:self.blocks.append((tag,text))
            self.kind=None
        if tag=='article':self.active=False

font_dir=Path('/System/Library/Fonts/Supplemental')
pdfmetrics.registerFont(TTFont('Resume',str(font_dir/'Arial.ttf')))
pdfmetrics.registerFont(TTFont('ResumeBold',str(font_dir/'Arial Bold.ttf')))
pdfmetrics.registerFont(TTFont('ResumeItalic',str(font_dir/'Arial Italic.ttf')))
pdfmetrics.registerFontFamily('Resume',normal='Resume',bold='ResumeBold',italic='ResumeItalic',boldItalic='ResumeBold')
base=dict(fontName='Resume',fontSize=9,leading=11.2,spaceAfter=3,textColor='#20262c')
styles={'p':ParagraphStyle('body',**base),'li':ParagraphStyle('bullet',leftIndent=10,firstLineIndent=-7,**base),'h1':ParagraphStyle('name',fontName='ResumeBold',fontSize=17,leading=20,alignment=TA_CENTER,spaceAfter=5),'h2':ParagraphStyle('section',fontName='ResumeBold',fontSize=11,leading=13,spaceBefore=8,spaceAfter=5,keepWithNext=True),'h3':ParagraphStyle('entry',fontName='ResumeBold',fontSize=9.5,leading=12,spaceBefore=5,spaceAfter=3,keepWithNext=True),'div':ParagraphStyle('contact',alignment=TA_CENTER,**base)}
p=ResumeParser();p.feed((ROOT/'resume.html').read_text())
story=[Paragraph(('• '+text if tag=='li' else text),styles[tag]) for tag,text in p.blocks]
SimpleDocTemplate(str(ROOT/'resume.pdf'),pagesize=A4,rightMargin=32,leftMargin=32,topMargin=27,bottomMargin=27,title='Reddyvari Nithish Kumar Reddy - Resume',author='Reddyvari Nithish Kumar Reddy').build(story)
