FROM node:22-alpine AS build
WORKDIR /app/client
ENV VITE_SITE_URL=https://shoevents.org
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client ./
RUN npm run seo:sitemap && npm run build

FROM nginx:1.27-alpine
RUN rm -f /etc/nginx/conf.d/default.conf
COPY deploy/nginx/http.conf /etc/nginx/templates/http.conf
COPY deploy/nginx/ssl.conf /etc/nginx/templates/ssl.conf
COPY deploy/nginx/docker-entrypoint-wrapper.sh /docker-entrypoint-wrapper.sh
RUN chmod +x /docker-entrypoint-wrapper.sh
COPY --from=build /app/client/dist /usr/share/nginx/html
EXPOSE 80 443
ENTRYPOINT ["/docker-entrypoint-wrapper.sh"]
