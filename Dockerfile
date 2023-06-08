FROM node:16 as build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY src src/
COPY public public/
COPY . .
RUN npm run build

FROM nginx:latest
EXPOSE 80
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]