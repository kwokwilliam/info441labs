const express = require("express");
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const {
	headerContentType,
	headerAccessControlAllowOrigin,
	contentTypeJSON,
	contentTypeText,
	allTypes
} = require("./constants");
const port = process.env.PORT || 4000;
const app = express();
app.use(express.json());

let zipsData = {};

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
	let zipsCsvAsString;
	try {
		zipsCsvAsString = fs.readFileSync(path.resolve(process.cwd() + "/data/zips.csv"), "UTF8");
	} catch (e) {
		console.log("Error", e);
		process.exit(1);
	}

	let parsedCSV = await Papa.parse(zipsCsvAsString, { header: true });

	parsedCSV.data.forEach(zipObj => {
		const {
			zip, primary_city, state
		} = zipObj;
		if (primary_city) {
			let city = primary_city.toLowerCase();
			if (!(city in zipsData)) {
				zipsData[city] = [];
			}
			zipsData[city].push({ zip, city, state });
		}
	});

	app.listen(port, () => {
		console.log(`listening on port ${port}`);
	});
}

main();