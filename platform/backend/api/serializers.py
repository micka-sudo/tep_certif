from rest_framework import serializers
from .models import Document, Project

class ContentSerializer(serializers.ModelSerializer):
    FIELDS = ['id', 'modified_by', 'created_by', 'created_date' , 'modified_date']
    id = serializers.ReadOnlyField()
    
    def create(self, validated_data):
        user = self.context['request'].user

        if user.is_anonymous:
            validated_data['created_by'] = None
            validated_data['modified_by'] = None
        else:
            validated_data['created_by'] = user
            validated_data['modified_by'] = user

        return super().create(validated_data)

    def update(self, instance, validated_data):
        user = self.context['request'].user
        if user.is_anonymous:
            validated_data['modified_by'] = None  
        else:
            validated_data['modified_by'] = user
        return super().update(instance, validated_data)

def valid_list_of_dict(arr, error_msg, callback):
    """
    Valid if the given list has only dict inside.
    Call callback on each child, for test them with custom method.

    Parameters
    ----------
    arr : list, the list of dict to valid
    error_msg : str, msg to show in Validation Error
    callback : func, call after validation for each dict, often an other validation method
    """
    for v in arr:
        if not isinstance(v, dict):
            raise serializers.ValidationError(error_msg)
        callback(v)

def valid_exist_type(dic, newDic, dicName, key, type):
    """
    Shorcut for test if a given key exist in a dict and if the given value is instance of given type.
    If not valid throw Validationtion error else assign key, value to the new dict.

    Parameters
    ----------
    dic : dict, dict to test.
    newDic : dict, dict to assign
    dicName : str, name of dict, use for error message
    key : str, key to test exist
    type : type, type to test
    """
    if key not in dic or not isinstance(dic[key], type):
        raise serializers.ValidationError(f"{dicName}.{key} missing or should be a {type}.")
    newDic[key] = dic[key]

def valid_feature(dic):
    """
    Valid if given feature has :
    - name of type str.
    - sources of type list
    Test if sources is a list of dict
    If not valid throw ValidationException

    Parameters
    ----------
    dic : dict, the source to valid
    """
    newDic = {}
    valid_exist_type(dic, newDic, 'feature', 'name', str)
    valid_exist_type(dic, newDic, 'feature', 'sources', list)
    dic = newDic
    valid_list_of_dict(dic['sources'], 'sources should be a list of dict', valid_source)

def valid_source(dic):
    """
    Valid if given source has :
    - name of type str.
    - type of type str
    - item of type list
    Test if items is a list of dict
    If not valid throw ValidationException

    Parameters
    ----------
    dic : dict, the source to valid
    """
    newDic = {}
    valid_exist_type(dic, newDic, 'source', 'name', str)
    valid_exist_type(dic, newDic, 'source', 'type', str)
    valid_exist_type(dic, newDic, 'source', 'items', list)
    dic = newDic
    valid_list_of_dict(dic['items'], 'items should be a list of dict', valid_item)

def valid_item(dic):
    """
    Valid if given item has :
    - at least a label of type str.
    - optionaly a start AND a end of type int
    - optionaly a value of type str
    - optionaly a probality of type float
    If not valid throw ValidationException 

    Parameters
    ----------
    dic : dict, the item to valid
    """
    newDic = {}

    valid_exist_type(dic, newDic, 'item', 'label', str)
    
    if 'start' in dic and 'end' in dic:
        if not isinstance(dic['start'], int):
            raise serializers.ValidationError("item.start should be an int.")
        if not isinstance(dic['end'], int):
            raise serializers.ValidationError("item.end should be an int.")
        newDic['start'] = dic['start']
        newDic['end'] = dic['end']

    if 'value' in dic:
        if not isinstance(dic['value'], str):
            raise serializers.ValidationError("item.value should be an str.")

    if 'probability' in dic:
        if not isinstance(dic['probability'], float):
            raise serializers.ValidationError("item.probability should be an float.")
        newDic['probability'] = dic['probability']

    dic = newDic

class DocumentSerializer(ContentSerializer):
    class Meta:
        model = Document
        fields = ['title', 'text', 'features', 'stats', 'project'] + ContentSerializer.FIELDS

    def validate_features(self, value):
        """
        Check and filter value of features.
        """
        if not isinstance(value, list):
            raise serializers.ValidationError("Features should be a list.")

        valid_list_of_dict(value, 'features should be a list of dict', valid_feature)
                    
        return value

class ProjectSerializer(ContentSerializer):
    class Meta:
        model = Project
        fields = ['name', 'active_models'] + ContentSerializer.FIELDS

