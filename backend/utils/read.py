from selectolax.parser import HTMLParser


class Read(object):
    def read(self):
        pass


class HTMLRead(Read):
    def __init__(self, raw):
        super(HTMLRead,self).__init__()
        self.raw=raw

    def read(self):
        tree = HTMLParser(self.raw)

        if tree.body is None:
            return None

        for tag in tree.css('script'):
            tag.decompose()
        for tag in tree.css('style'):
            tag.decompose()

        text = tree.body.text(separator='\n')
        return text



