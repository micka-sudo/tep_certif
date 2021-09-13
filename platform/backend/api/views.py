from django.http.response import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status
from .models import Document, Project
from .serializers import DocumentSerializer, ProjectSerializer
from rest_framework.response import Response
import os, json
import requests
from helpers import correct_encoding
from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework.decorators import api_view
import pandas as pd
from datetime import datetime
from django.utils import timezone

class ContentViewSet(viewsets.ModelViewSet):
    FILTERSET_FIELDS = ['modified_by', 'created_by', 'created_date' , 'modified_date']
    filter_backends = [DjangoFilterBackend]
    permission_classes = [] if os.environ.get("SECURITY", "0") == "0" else [permissions.IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        if isinstance(self.request.data, list):
            kwargs['many'] = True

        self.serializer_class.Meta.depth = int(self.request.GET.get('depth', 0))

        return super().get_serializer(*args, **kwargs)

def update_features(request, pk):
    document = get_object_or_404(DocumentViewSet.queryset, pk=pk)

    data = requests.post(f'{settings.MIDDLEWARE_URL}/apply',
                json.dumps({
                    'id':document.id,
                    'text':document.text, 
                    'features':document.features, 
                    'active_models':document.project.active_models
                })
            )
    data = data.json()

    document = DocumentViewSet.serializer_class(document,
        context = {'request':request}, data=data, partial=True)

    if document.is_valid():
        document.save()
    else:
        print(document.errors)

class DocumentViewSet(ContentViewSet):
    """
    API endpoint that allows Document to be viewed or edited.
    """
    queryset = Document.objects.all().order_by('-modified_date')
    serializer_class = DocumentSerializer
    filterset_fields = ['text'] + ContentViewSet.FILTERSET_FIELDS

    def retrieve(self, request, pk=None):
        
        update_features(request, pk)

        return super().retrieve(request, pk)
    
    def partial_update(self, request, pk=None):
        if 'added_date' in request.data and request.data['added_date'] != None:
            added_date = datetime.fromtimestamp(request.data['added_date'], timezone.utc)
            document = get_object_or_404(DocumentViewSet.queryset, pk=pk)
            print('check cancel update')
            if document.modified_date > added_date:
                print('valid cancel update')
                return Response({'msg':'Cancel partial_update because document has been modified after being queued'})
        return super().partial_update(request, pk)

class ProjectViewSet(ContentViewSet):
    """
    API endpoint that allows Project to be viewed or edited.
    """
    queryset = Project.objects.all().order_by('-created_date')
    serializer_class = ProjectSerializer
    filterset_fields = ['name'] + ContentViewSet.FILTERSET_FIELDS

@api_view(['GET'])
def models_info(request):
    data = requests.get(f'{settings.MIDDLEWARE_URL}/models-info')
    data = data.json()
    return Response(data)
    
@api_view(['GET'])
def random_document(request):
    queryset = Document.objects.order_by("?")
    if not queryset:        
        return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        return JsonResponse({'id':queryset.first().id})

def parse_datetime(date, time):
    date = date.split('/')
    time = time.split(':')
    return timezone.make_aware(datetime(int('20' + date[2]), int(date[1]), int(date[0]), int(time[0]), int(time[1])))    

@api_view(['POST'])
def upload(request):
    try:
        data = pd.read_csv(request.data['csv'], sep='\t', encoding='utf-8')
    except Exception as e:
        print(e)

    project = get_object_or_404(Project, id=request.data['projectId'])

    if len(data.values[0]) not in [2, 7]:
        return Response()
    for item in data.values:
        title, text, meta = '', '', []
        if len(data.values[0]) == 2:
            title = item[0]
            text = correct_encoding(item[1])
        elif len(data.values[0]) == 7:
            title = item[0]
            text = item[6]
            meta = [
                {'label':'exam_wording', 'value':item[2]},
                {'label':'exam_room', 'value':item[3]},
                {'label':'exam_date', 'value':str(parse_datetime(item[4], item[5]))}
            ]
        if not Document.objects.filter(title=title, text=text):
            document = DocumentSerializer(context = {'request':request}, data= {
                    'title':title,
                    'text':text,
                    'created_by': request.user, 
                    'features': [{'name':'meta', 
                        'sources': [{
                            'name': request.user.username,
                            'type': 'model',
                            'items': meta
                        }]
                    }]
                })
            if document.is_valid():
                document.save(project=project)

                res = requests.post(f'{settings.MIDDLEWARE_URL}/queue-apply',
                    json.dumps({
                        'id':document.data['id'],
                        'text':document.data['text'], 
                        'features':document.data['features'], 
                        'active_models':project.active_models
                    })
                )
            else:
                print(document.errors)               
    
    return Response()

@api_view(['GET'])
def apply_queue_count(request):
    res = requests.get(f'{settings.MIDDLEWARE_URL}/apply-queue-count')
    if res.status_code == 200:
        return Response({'queue':{'count':res.json()['count']}})
    else:
        return Response({'msg':res.text})


AGE_SPLIT = [
    ('0 - 18', lambda x: x < 18),
    ('18 - 25', lambda x: x < 25),
    ('25 - 35', lambda x: x < 35),
    ('35 - 45', lambda x: x < 45),
    ('45 - 55', lambda x: x < 55),
    ('55 - 65', lambda x: x < 65),
    ('65 et plus', lambda x: True),
]

@api_view(['GET'])
def stats(request):
    word_frequencies = {}
    genders = {}
    age_by_genders = {k:{} for k, _ in AGE_SPLIT}
    for item in Document.objects.values_list('stats'):
        stats = item[0]   
        if stats == None:
            continue
        for wf in stats['word_frequencies']:
            wf_v, wf_c = wf['value'], wf['count']
            if wf_v not in word_frequencies:
                word_frequencies[wf_v] = 0
            word_frequencies[wf_v] += wf_c            

        if 'identity' in stats:
            identity = stats['identity']
            if identity != None:
                gender = identity['gender']
                age = identity['age']
                if gender not in genders:
                    genders[gender] = 0
                    for k in age_by_genders:
                        age_by_genders[k].update({gender:0})
                genders[gender] += 1    
                for label, func in AGE_SPLIT:
                    if func(int(age)):
                        age_by_genders[label][gender] += 1
                        
    wfs = [{'value':k, 'count':v} for k, v in word_frequencies.items()]
    wfs.sort(key=lambda x: x['count'], reverse=True)
    return Response(
        {'word_frequencies':wfs[:min(100, len(wfs))],
        'genders':[{'name':k, 'value':v} for k, v in genders.items()],
        'age_by_genders':[dict({'name':k}, **{kk:vv for kk, vv in v.items()}) for k, v in age_by_genders.items()],
        }, 200)