# pull official base image
FROM ubuntu:latest



# set work directory
RUN mkdir -p /usr/src/backend
WORKDIR /usr/src/backend

RUN apt-get -y update && apt-get install -y --no-install-recommends apt-utils
RUN DEBIAN_FRONTEND=noninteractive apt-get install nginx curl python3 python3-distutils python3-pip libpq-dev gcc -y

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip3 install --no-cache-dir --upgrade pip
COPY ./requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt 
RUN pip3 install --no-cache-dir gunicorn

RUN ln -s /usr/bin/python3 /usr/bin/python

# copy project
COPY . .