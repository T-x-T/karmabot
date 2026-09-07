FROM node:26-alpine

# Set workdir
WORKDIR /srv/karmabot/

# Bundle APP files
COPY . .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL=warn
RUN npm install --production

ENV NODE_ENV=prod

# expose port
EXPOSE 4005

CMD [ "npm", "run", "run" ]
