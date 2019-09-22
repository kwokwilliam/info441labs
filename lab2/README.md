1. Which version of node do you pick? 
	* nvm, controls multiple versions of node.
	* Might have a .nvmrc file included in your repo
	* Docker hub
	* For my case, this is a light app, I'm just gonna use an alpine-node wrapper someone made
	* FROM mhart/alpine-node:12.4
2. RUN mkdir -p /usr/src/app 
	* -p ignores all errors like if the folder exists
	* The folder doesn't matter as far as I know.
3. COPY ./package.json /usr/src/app
4. COPY ./package-lock.json /usr/src/app
5. COPY ./package.json ./package-lock.json /usr/src/app/
6. WORKDIR /usr/src/app
7. RUN npm install
8. COPY . /usr/src/app
	* But wait! What do you guys think is wrong with this?
	* add node_modules/ to .dockerignore
9. EXPOSE 4000
10. CMD["npm", "run", "start"] // or node index.js or something
11. docker run -d -p 4000:4000 --name lab2 wkwok16/lab2

https://bambielli.com/til/2017-12-02-docker-run-vs-docker-cmd/