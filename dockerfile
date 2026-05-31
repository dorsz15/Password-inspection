# 1. Pobiera Node.js (wersja 24.16.0-alpine)
FROM node:24.16.0-alpine

# 2. Ustawia folder roboczy wewnątrz kontenera
WORKDIR /app

# 3. Kopiuje pliki z listą bibliotek
COPY package*.json ./

# 4. Instaluje zależności wewnątrz kontenera
RUN npm install

# 5. Kopiuje całą resztę kodu źródłowego
COPY . .

# 6. Informuje, że aplikacja działa na porcie 5173
EXPOSE 5173

# 7. Nadajemy uprawnienia roota
RUN chown -R node:node /app

# 8. Odpala serwer deweloperski Reacta
CMD ["npm", "run", "dev", "--", "--host"]