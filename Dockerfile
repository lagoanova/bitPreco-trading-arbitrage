FROM node:16-alpine AS build
RUN mkdir -p /home/node/app
RUN chown -R node:node /home/node && chmod -R 770 /home/node
WORKDIR /home/node/app
COPY --chown=node:node ./package.json ./package.json
COPY --chown=node:node ./package-lock.json ./package-lock.json
COPY --chown=node:node . ./
RUN apk add --no-cache --virtual .gyp \
  python3 \
  make \
  g++ \
  && npm install \
  && apk del .gyp
USER node

FROM build AS release
WORKDIR /home/node/app
# copy production node_modules
USER node
COPY --chown=node:node  --from=build  /home/node/app/node_modules ./node_modules
# EXPOSE 3001/tcp
CMD ["npm", "start"]