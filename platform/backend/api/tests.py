from django.test import TestCase
from api.serializers import valid_exist_type, valid_item, valid_list_of_dict, valid_source, valid_feature
from rest_framework import serializers

# Create your tests here.
class ValidFeatureCase(TestCase):
    def test_valid_exist_type_valid(self):
        ''' valid_exist_type correctly validate data'''
        dic = {'test':'test', 'nb':0}
        newDic = {}
        valid_exist_type(dic, newDic, 'Test', 'test', str)
        self.assertEqual(newDic, {'test':'test'})
        newDic = {}
        valid_exist_type(dic, newDic, 'Test', 'nb', int)
        self.assertEqual(newDic, {'nb':0})
        newDic = {}
        valid_exist_type(dic, newDic, 'Test', 'test', str)
        valid_exist_type(dic, newDic, 'Test', 'nb', int)
        self.assertEqual(newDic, dic)
    
    def test_valid_exist_type_unvalid(self):
        ''' valid_exist_type correctly throw error'''
        dic = {'test':'test', 'nb':0}
        newDic = {}
        with self.assertRaises(serializers.ValidationError):
            valid_exist_type(dic, newDic, 'Test', 'nb', float)
        with self.assertRaises(serializers.ValidationError):
            valid_exist_type(dic, newDic, 'Test', 'bn', int)
        with self.assertRaises(serializers.ValidationError):
            valid_exist_type(dic, newDic, 'Test', 'test', int)
    
    def test_valid_list_of_dict_valid(self):
        ''' valid_list_of_dict_valid correctly validate data'''
        arr = [{}, {}]
        oldArr = list(arr)
        valid_list_of_dict(arr, '', lambda x: x)
        self.assertEqual(arr, oldArr)

    def test_valid_list_of_dict_unvalid(self):
        ''' valid_list_of_dict_valid correctly throw error'''
        arr = ''
        with self.assertRaises(serializers.ValidationError):
            valid_item(arr)
        arr = ['', '']
        with self.assertRaises(serializers.ValidationError):
            valid_item(arr)

    def test_valid_item_valid(self):
        '''valid_item correctly validate data'''
        dic = {'label':'a'}
        oldDic = dict(dic)
        valid_item(dic)
        self.assertEqual(dic, oldDic)
        dic = {'label':'a', 'start':0, 'end':0}
        oldDic = dict(dic)
        self.assertEqual(dic, oldDic)
        dic = {'label':'a', 'value':'v'}
        oldDic = dict(dic)
        self.assertEqual(dic, oldDic)
        dic = {'label':'a', 'probability':.0}
        oldDic = dict(dic)
        self.assertEqual(dic, oldDic)

    def test_valid_item_unvalid(self):
        '''valid_item correctly throw error'''
        dic = {}
        with self.assertRaises(serializers.ValidationError):
            valid_item(dic)
        dic = {'label':0}
        with self.assertRaises(serializers.ValidationError):
            valid_item(dic)
        dic = {'label':'0', 'start':.0, 'end':0}
        with self.assertRaises(serializers.ValidationError):
            valid_item(dic)
        dic = {'label':'0', 'start':0, 'end':.0}
        with self.assertRaises(serializers.ValidationError):
            valid_item(dic)
        dic = {'label':'0', 'value':0}
        with self.assertRaises(serializers.ValidationError):
            valid_item(dic)
        dic = {'label':'0', 'probability':0}
        with self.assertRaises(serializers.ValidationError):
            valid_item(dic)

    def test_valid_source_valid(self):
        '''valid_source correctly validate data'''
        dic = {'name':'a', 'type':'a', 'items':[{'label':'a'}]}
        oldDic = dict(dic)
        valid_source(dic)
        self.assertEqual(dic, oldDic)

    def test_valid_source_unvalid(self):
        '''valid_source correctly throw error'''
        dic = {}
        with self.assertRaises(serializers.ValidationError):
            valid_source(dic)
        dic = {'name':0}
        with self.assertRaises(serializers.ValidationError):
            valid_source(dic)
        dic = {'name':'a'}
        with self.assertRaises(serializers.ValidationError):
            valid_source(dic)
        dic = {'name':'a', 'type':0}
        with self.assertRaises(serializers.ValidationError):
            valid_source(dic)
        dic = {'name':'a', 'type':'a'}
        with self.assertRaises(serializers.ValidationError):
            valid_source(dic)
        dic = {'name':'a', 'type':'a', 'items':''}
        with self.assertRaises(serializers.ValidationError):
            valid_source(dic)
        dic = {'name':'a', 'type':'a', 'items':['']}
        with self.assertRaises(serializers.ValidationError):
            valid_source(dic)
    
    def test_valid_feature_valid(self):
        '''valid_feature correctly validate data'''
        dic = {'name':'a', 'sources':[{'name':'a', 'type':'a', 'items':[{'label':'a'}]}]}
        oldDic = dict(dic)
        valid_feature(dic)
        self.assertEqual(dic, oldDic)

    def test_valid_feature_unvalid(self):
        '''valid_feature correctly validate data'''
        dic = {}
        with self.assertRaises(serializers.ValidationError):
            valid_feature(dic)
        dic = {'name':0}
        with self.assertRaises(serializers.ValidationError):
            valid_feature(dic)
        dic = {'name':'a'}
        with self.assertRaises(serializers.ValidationError):
            valid_feature(dic)
        dic = {'name':'a', 'sources':''}
        with self.assertRaises(serializers.ValidationError):
            valid_feature(dic)
        dic = {'name':'a', 'sources':['']}
        with self.assertRaises(serializers.ValidationError):
            valid_feature(dic)