def correct_encoding(txt):
    return txt.replace('\xa0', ' ').replace('\x92', '\'').replace('\x9c', 'oe') if type(txt) == str else txt