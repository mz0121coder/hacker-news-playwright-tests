# RECOMMENDED - pull latest image from docker hub
# use the commands in docker-compose.yaml file

# this command will build the image from scratch
# docker build -t hacker-news-playwright-tests .

FROM mcr.microsoft.com/playwright:v1.45.3-jammy

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN npm install --force
RUN npx playwright install

