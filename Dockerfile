FROM node:latest as vcross-stage

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

# Define working directory
WORKDIR /app
ADD . /app
RUN npm run build

FROM nginx:latest as build-stage
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=vcross-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx-debug", "-g", "daemon off;"]

