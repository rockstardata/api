# Usa una imagen base de Node.js
FROM node:lts-alpine3.21

# Crea el directorio de la app
WORKDIR /usr/src/app

# Copia los archivos de configuración del package
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código fuente
COPY . .

# Compila TypeScript (si es necesario)
# RUN npm run build

# Puerto expuesto
EXPOSE 3000

# Comando para iniciar la aplicación
# CMD ["npm", "start"]