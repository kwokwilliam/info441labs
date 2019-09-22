# Lab 1

## NodeJS Express

1. `npm init -y`
2. `npm i express`
3. `npm i --save-dev nodemon`
4. 

```js
const express = require('express');

const port = process.env.PORT || 4000;

const app = express();
app.use(express.json());

app.get("/v1/hello", (req, res) => {
	res.send('hello world'); // then <h1></h1>
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
```
5. `export PORT=4000` in .bash_profile/.bashrc/.zshrc
6. Replace `'hello world'` with `'<h1>abc</h1>'`
7. Add `"dev": "nodemon index.js"` to package.json scripts
8. `npm run dev`

## NodeJS Express Zipserver

1. `npm i papaparse`
2. import fs, path, Papa, constants
3. set up zipsData object globally
4. create an async main and wrap the listen inside it
5. call main

```js
// import express
const express = require('express');

// import file system and path
const fs = require('fs');
const path = require('path');

// import papa parse
const Papa = require('papaparse');

// import constants
const { headerContentType, headerAccessControlAllowOrigin, contentTypeJSON, contentTypeText, allTypes } = require('./constants');

// declare port from either environment variable or 4000 default
const port = process.env.PORT || 4000;

// init express app
const app = express();

// have express use json middleware
app.use(express.json());

// set up object that we want in our handlers
let zipsData = {};

// set up hello route
app.get("/v1/hello", (req, res) => {
	res.send('hello world'); // then <h1></h1>
});

app.get("/zips/city/:city", (req, res) => {
	let city = (req.params.city && req.params.city.toLowerCase()) || "";
	res.setHeader(headerContentType, contentTypeJSON);
	res.setHeader(headerAccessControlAllowOrigin, allTypes);

	console.log(city);
	if (city in zipsData) {
		return res.json(zipsData[city]);
	} else {
		res.status(404);
		return res.send('Failure, city not found');
	}
})

const main = async () => {
	// read csv, synchronously, from current directory + data/zips.csv, encoded as UTF8
	let zipsCsvAsString;
	try {
		zipsCsvAsString = fs.readFileSync(path.resolve(process.cwd() + '/data/zips.csv'), 'UTF8');
	} catch (e) {
		console.log('Error:', e);
		process.exit(1);
	}

	// parse CSV through papa
	let parsedCSV = await Papa.parse(zipsCsvAsString, { header: true });

	parsedCSV.data.forEach(zipObj => {
		const {
			zip,
			primary_city,
			state
		} = zipObj;
		if (primary_city) {
			let city = primary_city.toLowerCase();
			if (!(city in zipsData)) {
				zipsData[city] = [];
			}
			zipsData[city].push({
				zip,
				city,
				state
			});
		}
	});

	// console.log(zipsData.seattle);
	// // make app start listening on port, and log listening
	app.listen(port, () => {
		console.log(`listening on port ${port}`);
	});
}

main();
```

## Python Flask

1. `pip install Flask`

```python
from flask import Flask
app = Flask(__name__)

@app.route('/v1/hello')
def hello():
    return "Hello world"

if __name__ == '__main__':
    app.run()
```

2. `python app.py`