import Levenshtein as lev
import jaro

def spacy_similarity(t, kw): #t=a token in the text, kw= a keyword of the list of keyword
    return t.similarity(kw) 
def jaro_similarity(t,kw):
    return jaro.jaro_winkler_metric(t.text, kw.text)
def levenshtein_similarity(t,kw):
    return lev.ratio(kw.text, t.text)


def process_text(doc,keyword,tresholds,methods):
    
    result = [[m.__name__, []] for m in methods]
    similarities=[]
    is_valid=False
    for t in doc:
        for kw in keyword:
            similarities=[]
            is_valid=False
            for method, treshold in zip(methods, tresholds):
                s=round(method(t,kw),3)  
                similarities.append(s)  
                if s>treshold:
                    is_valid=True
            if is_valid:
                for i in range(len(methods)):
                    
                    result[i][1].append(
                        {'start':t.idx, 'end':t.idx+len(t), 'label':str(kw), 'probability': float(similarities[i])})
    return result

    