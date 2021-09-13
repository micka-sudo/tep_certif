from pathlib import Path
from numpy import select
import spacy
from thinc.api import Config
from src.pipelines.pipeline_ctrl import PipelineCtrl
from src.components import section_splitter
from src.components import regex_matcher
from src.components import pysbd_sentence_boundaries
from src.helpers import extract_sents, add_custom_ner, extract_ents

class Alpha(PipelineCtrl):
    name = "Alpha"
    version="0.1"
    desc = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
    force_update=False
    
    def __init__(self, path=None) -> None:
        super().__init__()
        if path:
            self.load_model(path)
        else:
            self.sections_patterns = ['intro', 'ctx', 'tech', 'obs', 'ccl']
            self.regex_patterns = {'identity':['gender', 'age'], 'medical':['suvmax', 'medobj_size']}
            self.treatment_ner_path = 'treatment_28_09_21'
            self.suv_ner_path = 'suv_28_09_21'
            self.build_model()

    def __call__(self, text, features) -> None:
        doc = self.nlp(text)
        self.add_feature(features, section_splitter.extract_sections(doc))
        self.add_feature(features, ('SUV_NER', extract_ents(doc, ['OBJ_LOC'])))
        self.add_feature(features, ('TREATMENT_NER', extract_ents(doc, ['T'])))
        self.add_feature(features, ('BASE_NER', extract_ents(doc, ['LOC', 'MISC', 'ORG', 'PER'])))
        self.add_feature(features, extract_sents(doc))
        for feature in regex_matcher.extract_matchs(doc):
            self.add_feature(features, feature)

            
    def build_model(self) -> None:
        self.nlp = spacy.load("fr_core_news_lg")
        self.nlp.add_pipe("sbd", first=True)
        self.nlp.add_pipe("sections_splitter", config={"patterns": self.sections_patterns})
        self.nlp.add_pipe("regex_matcher", config={"patterns": self.regex_patterns})
        add_custom_ner(self.nlp, self.treatment_ner_path, 'treatment_ner')
        add_custom_ner(self.nlp, self.suv_ner_path, 'suv_ner')

    def load_model(self, path) -> None:
        path = Path(path) if isinstance(path, str) else path
        config = Config().from_disk(path / self.get_fullname() / "config.cfg")
        lang_cls = spacy.util.get_lang_class(config["nlp"]["lang"])
        self.nlp = lang_cls.from_config(config)
        self.nlp.from_disk(path / self.get_fullname())

    def save_model(self, path) -> None:
        path = Path(path) if isinstance(path, str) else path
        path = path / self.get_fullname()
        self.nlp.to_disk(path)