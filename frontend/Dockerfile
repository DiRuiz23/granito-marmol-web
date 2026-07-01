FROM node:18-alpine

WORKDIR /app

# Copiar dependencias
COPY package*.json .

RUN npm install

# Copiar el resto del codigo
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]