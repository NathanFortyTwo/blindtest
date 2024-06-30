FROM python:3.10

WORKDIR /app
COPY . /app

# Install Node.js and npm
RUN apt-get update && \
    apt-get install nodejs npm -y

RUN pip install --no-cache-dir -r requirements.txt
RUN cd jsaudio &&  npm install
EXPOSE 8000
EXPOSE 3000

CMD ["bash", "start.sh"]