from pathlib import Path
import os, json
import spacy
from spacy.pipeline import EntityRecognizer
from spacy.language import Language
from spacy import displacy

PATTERNS = json.loads(Path(os.path.join(os.path.dirname(__file__), 'regex.json')).read_text(encoding='utf-8'))

DIM_KEYWORDS= json.loads(Path(os.path.join(os.path.dirname(__file__), 'dim_keywords.json')).read_text(encoding='utf-8'))

def get_custom_ner_path(dirname):
    return Path(f'../../samples/data/train/{dirname}/output/model-best')

def add_custom_ner(nlp, dirname, name, after='tok2vec'):
    ner = spacy.load(get_custom_ner_path(dirname))
    Language.factory(
        name, 
        default_config=ner.get_pipe_config('ner'), 
        func=lambda nlp, name: EntityRecognizer(nlp, name))
    ner.rename_pipe('ner', name)
    nlp.add_pipe(name, source=ner, after=after)

def extract_ents(doc, labels):
    return [{'start':ent.start_char, 'end':ent.end_char, 'label':ent.label_} for ent in doc.ents if ent.label_ in labels]

def get_patterns(pattern_keys):
    return {k:v for k, v in PATTERNS.items() if k in pattern_keys}

def extract_sents(doc):
    return 'sents', [{'start':sent.start_char, 'end':sent.end_char, 'label':str(i)} for i, sent in enumerate(doc.sents) if sent.text.strip() != '']      

def correct_encoding(txt):
    return txt.replace('\xa0', ' ').replace('\x92', '\'').replace('\x9c', 'oe') if type(txt) == str else txt

def ner_html(path, docs, manual=False, options={}):
    """
    Shorcut for save docs in html with displacy

    Parameters
    ----------
    path : str or Path, path of data to load
    docs : list, see doc of displacy.
    manual : bool, see doc of displacy.
    options : dict, see doc of displacy.
    """
    path = Path(path) if isinstance(path, str) else path
    path.write_text(displacy.render(docs, style='ent', manual=manual, options=options, page=True), encoding='utf-8')

def read_jsonl(path, encoding='utf-8'):
    path = Path(path) if isinstance(path, str) else path
    return [json.loads(line) for line in path.read_text(encoding=encoding).strip().split('\n')]

def write_jsonl(path, data, encoding='utf-8'):
    path = Path(path) if isinstance(path, str) else path
    path.write_text('\n'.join([json.dumps(item) for item in data]), encoding=encoding)