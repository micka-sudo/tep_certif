from django.db import models
from django.contrib.auth import get_user_model

def get_user_sentinel():
    return get_user_model().objects.get_or_create(username='deleted')[0]

class Content(models.Model):
    created_date = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modified_date = models.DateTimeField(auto_now=True, blank=True, null=True)
    created_by = models.ForeignKey(get_user_model(), on_delete=models.SET(get_user_model), 
        related_name='+', blank=True, null=True, editable=False)
    modified_by = models.ForeignKey(get_user_model(), on_delete=models.SET(get_user_model),
        related_name='+', blank=True, null=True, editable=False)
    class Meta:
        abstract = True

class Project(Content):
    name = models.TextField()
    active_models = models.JSONField(null=True)

class Document(Content):
    title = models.TextField()
    text = models.TextField()
    features = models.JSONField(null=True)
    stats = models.JSONField(null=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True)


