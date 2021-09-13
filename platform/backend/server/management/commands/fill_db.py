from django.db import connection, migrations
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Fill db with preset values for projects'

    def handle(self, *args, **options):
        cursor = connection.cursor()
        cursor.execute(
            """
                INSERT INTO api_project (created_date, modified_date, name, active_models, created_by_id, modified_by_id)
                VALUES
                (NOW(), NOW(), 'PET', '[]', 1, 1),
                (NOW(), NOW(), 'DIM', '[]', 1, 1)
            """
        )  
        connection.commit()