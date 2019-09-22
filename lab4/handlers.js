const postCakeHandler = async (req, res, { Cake }) => {
	const { whoFor, numCandles } = req.body;
	if (!whoFor) {
		res.status(400).send("Must provide who the cake is for");
		return;
	}

	if (typeof numCandles !== "number") {
		res.status(400).send("numCandles must be a number");
		return;
	}

	const createdAt = new Date();
	const cake = {
		whoFor,
		numCandles,
		createdAt
	};

	const query = new Cake(cake);
	query.save((err, newCake) => {
		if (err) {
			res.status(500).send('Unable to create a cake');
			return;
		}

		res.status(201).json(newCake);
	})
};

const getCakeHandler = async (req, res, { Cake }) => {
	try {
		const cakes = await Cake.find();
		res.json(cakes);
	} catch (e) {
		res.status(500).send("There was an issue getting cakes");
	}
};

module.exports = { postCakeHandler, getCakeHandler };