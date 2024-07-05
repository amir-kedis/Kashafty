FROM node:22.3.0-alpine3.19

# create working directory
WORKDIR /kashafty

COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

# expose port
EXPOSE 4173

# run the app
CMD ["npm", "run", "preview"]
