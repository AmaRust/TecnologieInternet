const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useUnifiedTopology: true });

const connectDB = async () => {
  try {
    await client.connect();
    const db = client.db();
    const utenteCollection = await db.collection('utente');

    utenteCollection.findOne({ username: "admin", password:"admin"}, (err,result)=>{
      if (err) console.log('Errore durante l\'inserimento di admin');
      if (!result) {
        // creo l'utente default per il login
        utenteCollection.insertOne({
          username: "admin",
          password: "admin"
        });
      }
    }); 
    
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

const getDB = () => {
  if (!client.isConnected()) {
    throw new Error('MongoDB client is not connected');
  }
  return client.db();
};

module.exports = { connectDB, getDB };
