from csv import DictReader
from logging import basicConfig, getLogger

from requests import get

LOG = getLogger()
basicConfig(level="DEBUG")

ISO639URL = 'https://iso639-3.sil.org/sites/iso639-3/files/downloads/iso-639-3.tab'

def getIso639():
    response = get(ISO639URL)
    response.encoding = 'UTF-8'
    iso639tab = response.text

    reader = DictReader(iso639tab)

    for row in reader:
        LOG.error(row)