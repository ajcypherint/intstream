from sklearn.feature_extraction.text import TfidfVectorizer
import Stemmer #Pystemmer

import re
from selectolax.parser import HTMLParser

class ExceptionNoBody(Exception):
    pass

def clean_html_regex(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr,'',raw_html)
    return cleantext

def clean_html(raw):
    tree = HTMLParser(raw)

    if tree.body is None:
        return raw

    for tag in tree.css('script'):
        tag.decompose()
    for tag in tree.css('style'):
        tag.decompose()

    text = tree.body.text(separator='\n')
    text = re.sub(r'\n\s*', "\n",text)
    return text.strip().strip("\n")


def clean_md5(raw):
    text = re.sub(r'\b[a-fA-F0-9]{32}\b', '', raw)
    return text


def clean_sha256(raw):
    text = re.sub(r'\b[a-fA-F0-9]{64}\b', '', raw)
    return text


def clean_sha1(raw):
    text = re.sub(r'\b[a-fA-F0-9]{40}\b', '', raw)
    return text


def clean_hashes_old(raw):
    clean_nonwords = re.compile(r'\S*[^a-zA-Z\s\-\"\']\S*')
    cleantext = re.sub(clean_nonwords,'',raw)
    return cleantext


def clean_hashes(raw):
    cleantext = clean_md5(raw)
    cleantext = clean_sha256(raw)
    cleantext = clean_sha1(raw)
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
            'tamil', 'turkish']from selectolax.parser import HTMLParser

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
