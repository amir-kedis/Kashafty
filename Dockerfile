FROM node:22.3.0-alpine3.19

# create working directory
WORKDIR /kashafty

#NOTE: uncomment those after removing the modules
# copy server package.json
# COPY package*.json ./

# install server dependencies
# RUN npm install

# copy client package.json
# COPY client/package*.json ./client/

# install client dependencies
# RUN npm install --prefix client

# copy the rest of the files
# COPY . .

# expose port
EXPOSE 3001

# run the app
CMD ["sh", "-c", "npm run test && npm run dev"]
# CMD ["npm", "run", "dev"]
