from spacy.lang.fr.stop_words import STOP_WORDS as stop_words
import re
from src.helpers import PATTERNS

WORD_SPLIT_PATTERN = re.compile(PATTERNS['split_words'])

STOP_WORDS = set(list(stop_words)+['xxxx','XXXX'])

def basic_filter(stop_words=STOP_WORDS, min_len_word=2):
    def wrapped_basic_filter(word):
        if word in stop_words or len(word) < min_len_word:
            return False
        return True
    return wrapped_basic_filter

def word_list_freq(text, filter=basic_filter()):
    """
        For given text, return frequencies of filtered words.

        Parameters
        ----------
        text : str, text on which compute frequencies
        filter : func, default=stat.basic_filter, function that return true or false, use to skip unwanted word

    """
    word_list = WORD_SPLIT_PATTERN.finditer(text.lower())
    word_freq = []
    filtered_words= [w.group(0) for w in word_list if filter(w.group(0))]
    unique_words= set(filtered_words)
    for w in unique_words:
        word_freq.append(filtered_words.count(w))
    return [{"value":word,"count":freq} for word, freq in zip(unique_words, word_freq)]


def gather_identity(text, features):
    identity = list(filter(lambda feature: feature['name'] == 'identity', features))
    result = {}
    if len(identity) != 0:
        for item in identity[0]['sources'][0]['items']:
            if item['label'] == 'age':
                txt = text[item['start']:item['end']]
                result.update({item['label']:txt.split('(')[1].split(' ')[0].lower()})
            elif item['label'] == 'gender':
                txt = text[item['start']:item['end']]
                result.update({item['label']:txt.split(' ')[0].lower()})
    return result
