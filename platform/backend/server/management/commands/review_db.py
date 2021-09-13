from django.db import connection
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = '''Shorcuts for review database'''

    def add_arguments(self, parser):
        parser.add_argument('--table', type=str, default='', 
            help='''Table to review, if not specified, will list table names.
            "python manage.py review_db" will display list of tables
            "python manage.py review_db --table api_project" will display values in table api_project
                "SELECT * FROM api_project"
            ''')
        parser.add_argument('--columns', default=False, action='store_true', 
            help='''Use as flag to display columns of table in place instead of values.
            "python manage.py review_db --table api_project --columns" will display columns of api_project
                "SELECT * FROM information_schema.columns WHERE table_name = 'api_project'"
            ''')
        parser.add_argument('--join', type=str, default='',
            help='''Make a LEFT JOIN. Should be in "x.y" format where x is the right table and y is the fk of the left table. --table is the left table.
            "python manage.py review_db --table api_project --join auth_user.created_by_id" will make a LEFT JOIN on api_project and auth_user"
                "SELECT * FROM api_project LEFT JOIN auth_user ON api_project.created_by_id = auth_user.id" 
            ''')
        parser.add_argument('--select', type=str, default='*',
            help='''Use for specify SELECT sequence to request. * by default
            "python manage.py review_db --table api_project --select "id, name" " will SELECT and display only id and name of table api_project"
                "SELECT "id, name" FROM api_project" ''')
        parser.add_argument('--where', type=str, default='',
            help='''Use for specify WHERE sequence to request. None by default
                "python manage.py review_db --table api_project --where "id=1" " will display only row of table api_project WHERE id is equal to 1"
                "SELECT "id, name" FROM api_project WHERE id=1" ''')

    def handle(self, *args, **options):
        table = options.get('table')
        columns = options.get('columns')
        
        if table == '':
            tables = connection.introspection.table_names()
            print(tables)
        elif columns:
            cursor = connection.cursor()
            cursor.execute(
                f'''
                    SELECT *
                    FROM information_schema.columns
                    WHERE table_name = '{table}'
                '''
            )
            print('\n'.join([str(line) for line in cursor.fetchall()]))
        else:
            join = options.get('join').split('.')
            select = options.get('select')
            where = options.get('where')
 
            join_raw = ''
            if len(join) == 2:
                join_raw = f'LEFT JOIN {join[0]} ON {table}.{join[1]} = {join[0]}.id'

            where_raw = where if where == '' else f'WHERE {where}'

            cursor = connection.cursor()
            cursor.execute(
                f'''
                    SELECT {select}
                    FROM {table}
                    {join_raw}
                    {where_raw}
                '''
            )
            print('\n'.join([str(line) for line in cursor.fetchall()]))

        