from pathlib import Path
import spacy
import json, os
from .pipeline_ctrl import PipelineCtrl
from src.components import similarity
from src.helpers import DIM_KEYWORDS


class Dim(PipelineCtrl):
    name="Dim"
    version="0.1"
    desc = "Recherche des mots clés et des mots similaires en utilisant les méthodes de spaCy, de Jaro-Winkler et de Levenshtein"
    force_update=False

    def __init__(self, path) -> None:
        super().__init__()
        self.build_model()

    def __call__(self, text, features) -> None:
        doc = self.nlp(text)
        result = similarity.process_text(doc, self.keywords,[.8, .85, .75],
            [similarity.spacy_similarity, similarity.jaro_similarity,similarity.levenshtein_similarity])
        for r in result :
            self.add_feature(features, r)

    def build_model(self) -> None:
        self.nlp = spacy.load("fr_core_news_lg")
        self.keywords = [self.nlp(v) for v in DIM_KEYWORDS.values()]



    