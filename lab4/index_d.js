const mongoose = require('mongoose');
const express = require('express');
const { cakeSchema } = require('./schemas_d');
const handlers = require('./handlers_d');
const amqp = require('amqplib/callback_api');

// you can have multiple databases similar to sql.
// this is the test database
const rabbAddr = process.env.RABBITADDR || "amqp://localhost:5672"
const mongoEndpoint = "mongodb://localhost:27017/test";
const port = 4000;
let rabbitChannel;
// set up mongoose schemas
const Cake = mongoose.model("Cake", cakeSchema)

// set up express
const app = express();
app.use(express.json());

const getRabbitChannel = () => {
	return rabbitChannel;
}

// A function to connect to the mongo endpoint, used for refreshing on disconnect.
const connect = () => {
	mongoose.connect(mongoEndpoint);
}

// app.post("/v1/cake", (req, res) => {
// 	const { whoFor, numCandles } = req.body;
// 	if (!whoFor) {
// 		res.status(400).send("Must provide who the cake is for");
// 		return;
// 	}

// 	if (typeof numCandles !== "number") {
// 		res.status(400).send("numCandles must be a number");
// 		return;
// 	}

// 	const createdAt = new Date();

// 	const cake = {
// 		whoFor,
// 		numCandles,
// 		createdAt
// 	}

// 	const query = new Cake(cake);
// 	query.save((err, newCake) => {
// 		if (err) {
// 			res.status(500).send("Unable to create channel");
// 			return;
// 		}

// 		res.status(201).json(newCake);
// 	});
// });

// app.get("/v1/cake", async (req, res) => {
// 	const cakes = await Cake.find();
// 	res.json(cakes);
// });

const RequestWrapper = (handler, SchemeAndDbForwarder) => {
	return (req, res) => {
		handler(req, res, SchemeAndDbForwarder);
	}
}

app.post("/v1/cake", RequestWrapper(handlers.postCakeHandler, { Cake, getRabbitChannel }));
app.get("/v1/cake", RequestWrapper(handlers.getCakeHandler, { Cake }));

connect();
mongoose.connection.on('error', console.error)
	.on('disconnected', connect)
	.once('open', main);

async function main() {
	amqp.connect(rabbAddr, (err, conn) => {
		if (err) {
			console.log("Failed to connect to rabbit instance");
			process.exit(1);
		}

		conn.createChannel((err, ch) => {
			if (err) {
				console.log("Error creating channel")
				process.exit(1);
			}

			ch.assertQueue("anyQueue", { durable: true });
			rabbitChannel = ch;

			ch.consume("anyQueue", (msg) => {
				console.log(msg.content.toString());
			}, {
				noAck: true
			})
		});

		app.listen(port, "", () => {
			console.log(`Server listening on port ${port}`);
		});
	});
}