from .vector import clean_html
import re

class Read(object):
    def read(self):
        pass


class HTMLRead(Read):
    def __init__(self, raw):
        super(HTMLRead,self).__init__()
        self.raw=raw

    def read(self):
        return clean_html(self.raw)



