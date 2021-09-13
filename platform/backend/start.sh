#!/bin/sh

python3 manage.py wait_for_db

if [ ${RESET_DB} = "1" ]
then
    echo "RESET DATABASE"
    python3 manage.py reset_db --noinput
    python3 manage.py makemigrations --noinput
    python3 manage.py makemigrations api --noinput
    python3 manage.py migrate --noinput
    python3 manage.py create_admin \
        --username "${ADMIN_USERNAME}" \
        --password "${ADMIN_PASSWORD}" \
        --email "${ADMIN_EMAIL}" \
        --noinput
    python3 manage.py fill_db  
else
    python3 manage.py makemigrations --noinput
    python3 manage.py makemigrations api --noinput
    python3 manage.py migrate --noinput
fi

# python3 manage.py collectstatic --noinput
# python3 manage.py review_db 

if [ ${DEBUG} = "1" ]
then
    echo "START DEV"
    python3 manage.py runserver 0.0.0.0:8000
else
    echo "START PROD"
    gunicorn --bind 0.0.0.0:8000 backend.wsgi --error-logfile gunicorn-error.log
fi
