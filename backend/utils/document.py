#from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
#rom pdfminer.converter import TextConverter
#rom pdfminer.layout import LAParams
#rom pdfminer.pdfpage import PDFPage
#mport pdfminer.pdfdocument as pdfdocument

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
    def __init__(self,request,**kwargs):
        super(WordDocx,self).__init__(filename=request)

    def read(self):
        self.text = docx2txt.process(self.filename)

class PDF(Document):
    def __init__(self,request,password='',**kwargs):
        super(PDFDocument,self).__init__(filename=filename)
        self.rescmgr = PDFResourceManager()
        self.retstr = StringIO()
        self.password = password
        self.codec='utf8'
        self.laparams=LAParams()
        self.device = TextConverter(self.rescmgr,self.retstr,self.codec,laparams=self.laparams)
        self.interpreter = PDFPageInterpreter(rsrcmgr=self.rescmgr,device=self.device)

    def read(self):
        fp = open(self.filename,'rb')
        pagenos = set()
        maxpages = 0
        password = self.password
        if sys.version_info[0] <3:
            password = password.encode('utf8','ignore')
        else:
            password=password

        page_gen = PDFPage.get_pages(fp=fp,
                                     pagenos=pagenos,
                                     maxpages=maxpages,
                                     password=password,
                                     caching=True,
                                     check_extractable=True)
        try:
            for page in page_gen:
                self.interpreter.process_page(page)
        except pdfdocument.PDFPasswordIncorrect as e:
            self.tcex_obj.log.error(str(e))
            return False
        except pdfdocument.PDFEncryptionError as e:
            self.tcex_obj.log.error(str(e))
            return False

        self.text = self.retstr.getvalue()
        if sys.version_info[0] <3:
            self.text = self.text.decode('utf8',errors='ignore')
        fp.close()
        self.device.close()
        self.retstr.close()
        return True

