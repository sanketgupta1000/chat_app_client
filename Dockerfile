# base stage
FROM node:22.15.0 AS base
WORKDIR /chat_app_client
COPY package.json .
RUN npm install
COPY . .

# client dev stage, starts the dev server
FROM base AS dev
CMD [ "npm", "run", "dev", "--", "--host" ]

# client builder stage, just builds for production
FROM base AS builder
RUN npm run build

# final production stage for client, just puts the html,css,js generated in a apache server
FROM httpd AS final
# copy the built files
COPY --from=builder /chat_app_client/dist/ /usr/local/apache2/htdocs/
COPY .htaccess /usr/local/apache2/htdocs/