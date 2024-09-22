FROM node:latest as builder
EXPOSE 4200
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build --prod
FROM nginx:alpine
COPY src/nginx/etc/conf.d/default.conf /etc/nginx/nginx.conf
COPY --from=builder app/dist usr/share/nginx/html
CMD ["/bin/sh",  "-c",  "exec nginx -g 'daemon off;'"]