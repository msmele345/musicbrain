FROM node:24-alpine AS build

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

#docker build --build-arg VITE_API_BASE_URL=https://api.example.com -t musicbrain .

#const BASE_URL = import.meta.env.VITE_API_BASE_URL