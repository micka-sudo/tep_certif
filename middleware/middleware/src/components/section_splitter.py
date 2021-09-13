from spacy.language import Language
from spacy.tokens import Doc
import re, json
from src.helpers import get_patterns


@Language.factory("sections_splitter", default_config={"patterns": []})
def create_sections_splitter_component(nlp: Language, name: str, patterns: list):
    return SectionSplitterComponent(nlp, patterns)

class SectionSplitterComponent:
    def __init__(self, nlp: Language, patterns: list):
        self.patterns = self.load_patterns(get_patterns(patterns))
        if not Doc.has_extension("sections"):
            Doc.set_extension("sections", default=[])

    def __call__(self, doc: Doc) -> Doc:
        start, end = 0, 0
        sections = []
        for k, v in self.patterns.items():
            match = v.search(doc.text)
            if match == None:
                print(f'{k} : skip by match')
                return doc
            end = match.span()[0]
            if start > end:
                print(f'{k} : skip by start > end')
                return doc
            span = doc.char_span(start, end, label=k)
            if span == None:
                print(f'{k} : skip by span')
                return doc
            sections.append(span)
            start = match.span()[1]
        doc._.sections = sections
        return doc

    def to_disk(self, path, exclude=tuple()):
        data_path = path / "patterns.json"
        
        if not path.is_dir():
            path.mkdir()

        data_path.write_text(json.dumps({k:v for k, v in get_patterns(list(self.patterns.keys())).items()}), encoding="utf-8")

    def from_disk(self, path, exclude=tuple()):        
        data_path = path / "patterns.json"
        self.patterns = self.load_patterns(json.loads(data_path.read_text()))

    def load_patterns(self, patterns):
        return {k:re.compile(v, re.I) for k, v in patterns.items()}

def extract_sections(doc):
    return 'sections', [{'start':section.start_char, 'end':section.end_char, 'label':section.label_} for section in doc._.sections]      

