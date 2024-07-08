FROM node:22.3.0-alpine3.19

# create working directory
WORKDIR /kashafty/server

# copy server package.json
COPY package*.json ./

# install server dependencies
RUN npm install


# copy the rest of the files
COPY . .

# build the app
RUN npm run generate-pisma-types
RUN npm run build

# expose port
EXPOSE 5000

# run the app
CMD ["sh", "-c", "./start.sh"]
