const mongoose = require('mongoose');
const express = require('express');
const { cakeSchema } = require('./schemas');
const {
	postCakeHandler,
	getCakeHandler
} = require('./handlers');

const mongoEndpoint = "mongodb://localhost:27017/test"
const port = 4000;

const Cake = mongoose.model("Cake", cakeSchema);

const app = express();
app.use(express.json());

const connect = () => {
	mongoose.connect(mongoEndpoint);
}

const RequestWrapper = (handler, SchemeAndDbForwarder) => {
	return (req, res) => {
		handler(req, res, SchemeAndDbForwarder);
	}
}

app.post("/v1/cake", RequestWrapper(postCakeHandler, { Cake }));
app.get("/v1/cake", RequestWrapper(getCakeHandler, { Cake }));

connect();
mongoose.connection.on('error', console.error)
	.on('disconnected', connect)
	.once('open', main);

async function main() {
	app.listen(port, "", () => {
		console.log(`server listening ${port}`);
	});
}