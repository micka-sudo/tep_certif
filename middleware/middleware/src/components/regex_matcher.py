from spacy.language import Language
from spacy.tokens import Doc
import re, json
from src.helpers import get_patterns

@Language.factory("regex_matcher", default_config={"patterns": {}})
def create_regex_matcher_component(nlp: Language, name: str, patterns: dict):
    return RegexMatcherComponent(nlp, patterns)

class RegexMatcherComponent:
    def __init__(self, nlp: Language, patterns: dict):
        self.patterns = {k:self.load_patterns(get_patterns(v)) for k, v in patterns.items()}
        if not Doc.has_extension("regex_matchs"):
            Doc.set_extension("regex_matchs", default={})

    def __call__(self, doc: Doc) -> Doc:
        for k, v in self.patterns.items():
            doc._.regex_matchs[k] = []
            for label, pattern in v.items():
                doc._.regex_matchs[k] += [{'start':match.start(0), 'end':match.end(0), 'label':label} for match in pattern.finditer(doc.text)]
        return doc

    def to_disk(self, path, exclude=tuple()):
        data_path = path / "patterns.json"
        if not path.is_dir():
            path.mkdir()
        data_path.write_text(
            json.dumps(
                {k: {kk: vv.pattern for kk, vv in v.items()} for k, v in self.patterns.items()}), 
            encoding="utf-8")

    def from_disk(self, path, exclude=tuple()):        
        data_path = path / "patterns.json"
        self.patterns = {k:self.load_patterns(v) for k, v in json.loads(data_path.read_text()).items()}

    def load_patterns(self, patterns):
        return {k:re.compile(v, re.I) for k, v in patterns.items()}

def extract_matchs(doc):
    return [(k, v) for k, v in doc._.regex_matchs.items()]
    

