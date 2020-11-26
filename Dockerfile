FROM keymetrics/pm2:latest-alpine

# Set workdir
WORKDIR /srv/karmabot/

# Bundle APP files
COPY . .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production && npm run nuxt_build

# expose port
EXPOSE 4004
EXPOSE 4005



CMD [ "pm2-runtime", "start", "pm2.json" ]