# This file can now be ignored

# this command will build a new image
# docker build -t hacker-news-playwright-tests .

FROM mcr.microsoft.com/playwright:v1.45.3-jammy

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN npm install --force
RUN npx playwright install

