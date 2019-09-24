from codecs import iterdecode
from csv import DictReader
from logging import basicConfig, getLogger

from requests import get

from languagelab.api.models import Language

LOG = getLogger()
basicConfig(level="DEBUG")

ISO639URL = 'https://iso639-3.sil.org/sites/iso639-3/files/downloads/iso-639-3.tab'

def getIso639():
    response = get(ISO639URL, stream=True)
    response.encoding = 'UTF-8'

    iso639iter = iterdecode(response.iter_lines(), 'utf-8')

    return DictReader(iso639iter, delimiter="\t")

def makeLanguage(iso639row):
    return Language (name=iso639row['Ref_Name'], code=iso639row['Id'])
