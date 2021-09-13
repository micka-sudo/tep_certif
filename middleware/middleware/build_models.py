from src.pipelines.alpha import Alpha

suv_txt = "Hypermétabolisme intense et diffus de la lésion ostéolytique scapulaire droite envahissant les parties molles adjacentes et diffuse à l'articulation gléno-humérale droite (SUVmax 17,2)."
treatment_txt = "caractérisation d'un nodule pulmonaire apical gauche chez une patiente traitée en décembre 2016 pour un cancer du sinus pyriforme par radio chimiothérapie"

path = Alpha().save_model('models')
alpha = Alpha('models')

print('##### SUV #####')
print('\n'.join([f'{ent.label_} : {ent}' for ent in alpha.nlp(suv_txt).ents]))
print('##### TREATMENT #####')
print('\n'.join([f'{ent.label_} : {ent}' for ent in alpha.nlp(treatment_txt).ents]))

