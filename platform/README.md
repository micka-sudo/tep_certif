# Platform for PET

```
cd backend 
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000

cd frontend
npm install
npm start
```

OU

```
pour windows
docker-compose -f docker-compose.dev.yml up --build
pour linuxcd
sudo docker-compose -f docker-compose.dev.yml up --build
``
