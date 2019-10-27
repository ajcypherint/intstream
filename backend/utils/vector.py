from sklearn.feature_extraction.text import TfidfVectorizer
import Stemmer #Pystemmer


import re

def clean_html(raw):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr,'',raw)

    return cleantext

def clean_hashes(raw):
    clean_nonwords = re.compile(r'\S*[^a-zA-Z\s\-\"\']\S*')
    cleantext = re.sub(clean_nonwords,'',raw)
    return cleantext

def noop(raw):
    return raw

class StemmedTfidfVectorizer(TfidfVectorizer):
    def __init__(self, *args, **kwargs):
        """
        :param args:
        :param kwargs:
        clean_html - boolean
        clean_hashes - boolean
        stemmer - str - en
            ['arabic', 'basque', 'catalan', 'danish',
            'dutch', 'english', 'finnish', 'french',
            'german', 'greek', 'hindi', 'hungarian',
            'indonesian', 'irish', 'italian', 'lithuanian',
            'nepali', 'norwegian', 'porter', 'portuguese',
            'romanian', 'russian', 'spanish', 'swedish',
            'tamil', 'turkish']

        """

        self.operations = []
        if "clean_html" in kwargs:
            if kwargs["clean_html"]:
                self.operations.append(clean_html)
            del kwargs["clean_html"]
        if "clean_hashes" in kwargs:
            if kwargs["clean_hashes"]:
                self.operations.append(clean_hashes)
            del kwargs["clean_hashes"]
        if "stemmer" in kwargs:
            lang = kwargs["stemmer"]
            del kwargs["stemmer"]
        else:
            lang = 'english'
        self.stemmer = Stemmer.Stemmer(lang)
        super(StemmedTfidfVectorizer,self).__init__(*args, **kwargs)


    def build_analyzer(self):
        analyzer = super(StemmedTfidfVectorizer,self).build_analyzer()
        def fixup(doc):
            result = None
            for operation in self.operations:
                result = operation(doc)
            return result

        return lambda doc: self.stemmer.stemWords(analyzer(fixup(doc)))