from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
import pdfminer.pdfdocument as pdfdocument
import docx2txt
import sys
from io import StringIO

class Document(object):

    def __init__(self):
        self.text = ""

    def read(self):
        pass

class TXT(Document):
    def __init__(self,file_handle,encoding='utf8'):
        """

        :param file_handle: request.FILES['file']
        :param encoding:  string of file encoding
        """
        self.file_handle = file_handle
        self.encoding=encoding
        super(TXT,self).__init__()

    def read(self):
        text = ''
        for line in self.file_handle:
            text = text + line.decode(encoding=self.encoding)
        return text

class WordDocx(Document):
    def __init__(self,file_handle,**kwargs):
        """
        :param file_handle: request.FILES['file']
        """
        super(WordDocx,self).__init__()
        self.file_handle = file_handle

    def read(self):
        # todo(aj) change to use file_handle instead
        return docx2txt.process(self.file_handle)

class PDF(Document):
    def __init__(self,file_handle, password='',**kwargs):
        """
        :param file_handle: request.FILES['file']
        """

        super(PDF,self).__init__()
        self.fp = file_handle
        self.rescmgr = PDFResourceManager()
        self.retstr = StringIO()
        self.password = password
        self.codec='utf8'
        self.laparams=LAParams()
        self.device = TextConverter(self.rescmgr,self.retstr,self.codec,laparams=self.laparams)
        self.interpreter = PDFPageInterpreter(rsrcmgr=self.rescmgr,device=self.device)

    def read(self):
        pagenos = set()
        maxpages = 0
        password = self.password
        if sys.version_info[0] <3:
            password = password.encode('utf8','ignore')
        else:
            password=password

        page_gen = PDFPage.get_pages(fp=self.fp,
                                     pagenos=pagenos,
                                     maxpages=maxpages,
                                     password=password,
                                     caching=True,
                                     check_extractable=True)
        try:
            for page in page_gen:
                self.interpreter.process_page(page)
        except pdfdocument.PDFPasswordIncorrect as e:
            return False
        except pdfdocument.PDFEncryptionError as e:
            return False

        self.text = self.retstr.getvalue()
        if sys.version_info[0] <3:
            self.text = self.text.decode('utf8',errors='ignore')
        self.fp.close()
        self.device.close()
        self.retstr.close()
        return True

