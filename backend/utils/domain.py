import collections
import socket
from api import models
from urllib.parse import scheme_chars
import re
import idna

IP_RE = re.compile(r'^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$')  # pylint: disable=line-too-long


class ExtractResult(collections.namedtuple('ExtractResult', 'subdomain domain suffix')):
    '''namedtuple of a URL's subdomain, domain, and suffix.'''

    # Necessary for __dict__ member to get populated in Python 3+
    __slots__ = ()

    @property
    def registered_domain(self):
        """
        Joins the domain and suffix fields with a dot, if they're both set.
        >>> extract('http://forums.bbc.co.uk').registered_domain
        'bbc.co.uk'
        >>> extract('http://localhost:8080').registered_domain
        ''
        """
        if self.domain and self.suffix:
            return self.domain + '.' + self.suffix
        return ''

    @property
    def fqdn(self):
        """
        Returns a Fully Qualified Domain Name, if there is a proper domain/suffix.
        >>> extract('http://forums.bbc.co.uk/path/to/file').fqdn
        'forums.bbc.co.uk'
        >>> extract('http://localhost:8080').fqdn
        ''
        """
        if self.domain and self.suffix:
            # self is the namedtuple (subdomain domain suffix)
            return '.'.join(i for i in self if i)
        return ''

    @property
    def ipv4(self):
        """
        Returns the ipv4 if that is what the presented domain/url is
        >>> extract('http://127.0.0.1/path/to/file').ipv4
        '127.0.0.1'
        >>> extract('http://127.0.0.1.1/path/to/file').ipv4
        ''
        >>> extract('http://256.1.1.1').ipv4
        ''
        """
        if not (self.suffix or self.subdomain) and IP_RE.match(self.domain):
            return self.domain
        return ''


SCHEME_RE = re.compile(r'^([' + scheme_chars + ']+:)?//')


def _decode_punycode(label):
    lowered = label.lower()
    looks_like_puny = lowered.startswith('xn--')
    if looks_like_puny:
        try:
            return idna.decode(label.encode('ascii')).lower()
        except (UnicodeError, IndexError):
            pass
    return lowered


class _PublicSuffixListTLDExtractor(object):
    """Wrapper around this project's main algo for PSL
    lookups.
    """

    def __init__(self, tlds):
        self.tlds = frozenset(tlds)

    def suffix_index(self, lower_spl):
        """Returns the index of the first suffix label.
        Returns len(spl) if no suffix is found
        """
        length = len(lower_spl)
        for i in range(length):
            maybe_tld = '.'.join(lower_spl[i:])
            exception_tld = '!' + maybe_tld
            if exception_tld in self.tlds:
                return i + 1

            if maybe_tld in self.tlds:
                return i

            wildcard_tld = '*.' + '.'.join(lower_spl[i + 1:])
            if wildcard_tld in self.tlds:
                return i

        return length


def looks_like_ip(maybe_ip):
    """Does the given str look like an IP address?"""
    if not maybe_ip[0].isdigit():
        return False

    try:
        socket.inet_aton(maybe_ip)
        return True
    except (AttributeError, UnicodeError):
        if IP_RE.match(maybe_ip):
            return True
    except socket.error:
        return False


def extract(url):

    netloc = SCHEME_RE.sub("", url)\
        .partition("/")[0]\
        .partition("?")[0]\
        .partition("#")[0]\
        .split("@")[-1]\
        .partition(":")[0]\
        .strip()\
        .rstrip(".")

    labels = netloc.split(".")

    translations = [_decode_punycode(label) for label in labels]
    # todo
    tlds = [ i.value for i in models.Suffix.objects.all()]
    suffix_index = _PublicSuffixListTLDExtractor(tlds).suffix_index(translations)

    suffix = ".".join(labels[suffix_index:])
    if not suffix and netloc and looks_like_ip(netloc):
        return ExtractResult('', netloc, '')

    subdomain = ".".join(labels[:suffix_index - 1]) if suffix_index else ""
    domain = labels[suffix_index - 1] if suffix_index else ""
    return ExtractResult(subdomain, domain, suffix)


