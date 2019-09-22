const postCakeHandler = async (req, res, { Cake, getRabbitChannel }) => {
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
	}

	const query = new Cake(cake);
	query.save((err, newCake) => {
		if (err) {
			res.status(500).send("Unable to create channel");
			return;
		}

		getRabbitChannel().sendToQueue("anyQueue", Buffer.from(JSON.stringify({ type: "CREATED", message: newCake })));

		res.status(201).json(newCake);
	});
};

const getCakeHandler = async (req, res, { Cake }) => {
	const cakes = await Cake.find();

	res.json(cakes);
};

module.exports = {
	postCakeHandler,
	getCakeHandler
};	