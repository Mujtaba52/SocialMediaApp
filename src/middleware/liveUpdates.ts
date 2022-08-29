
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);  // remove this after you've confirmed it working

async function run() {

  try {

    await client.connect();
    const database = client.db('chat');
    const messages = database.collection('messages');

    // Query for our test message:
    const query = { message: 'Hello from MongoDB' };
    const message = await messages.findOne(query);
    console.log(message);

  } catch {

    // Ensures that the client will close when you error
    await client.close();
  }
}

run().catch(console.dir);