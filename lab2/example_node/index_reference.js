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

	// for each object in the data (data for 1 zipcode) add the zip data to the city.
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