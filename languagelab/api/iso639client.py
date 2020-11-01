"""

Client for retrieving the list of languages from iso639-3.sil.org

"""
from codecs import iterdecode
from csv import DictReader
from logging import basicConfig, getLogger

from requests import get

from languagelab.api.models import Language

LOG = getLogger()
basicConfig(level="DEBUG")

ISO639URL = 'https://iso639-3.sil.org/sites/iso639-3/files/downloads/iso-639-3.tab'

def get_iso639():
    """

    Retrieve the list of languages from sil.org

    """
    response = get(ISO639URL, stream=True)
    response.encoding = 'UTF-8'

    iso639iter = iterdecode(response.iter_lines(), 'utf-8')

    return DictReader(iso639iter, delimiter="\t")

def make_language(iso639row):
    """

    Create a Language object based on the ISO 639-3 entry

    """
    return Language (name=iso639row['Ref_Name'], code=iso639row['Id'])
