FROM cypress/base:24.19.0

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .

CMD ["npm", "run", "cy:run"]
