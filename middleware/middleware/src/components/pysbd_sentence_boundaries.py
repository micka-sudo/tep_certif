import pysbd
from spacy.language import Language

@Language.component("sbd")
def pysbd_sentence_boundaries(doc):
    seg = pysbd.Segmenter(language="en", clean=False, char_span=True)
    sents_char_spans = seg.segment(doc.text)
    char_spans = [doc.char_span(sent_span.start, sent_span.end, alignment_mode="contract") for sent_span in sents_char_spans]
    start_token_ids = [span[0].idx for span in char_spans if span is not None]
    for token in doc:
        token.is_sent_start = True if token.idx in start_token_ids else False
    return doc