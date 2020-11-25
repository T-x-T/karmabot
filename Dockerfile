FROM keymetrics/pm2:latest-alpine

# Set workdir
WORKDIR /srv/karmabot/

# Bundle APP files
COPY . .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

# expose port
EXPOSE 4004



CMD [ "pm2-runtime", "start", "pm2.json" ]