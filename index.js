const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//dotenv
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3onslcg.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Validate repository name function
const validateRepositoryName = (name) => {
  const regex = /^[A-Za-z0-9-_]{5,10}$/;
  return regex.test(name);
};

async function run() {
  try {
    // await client.connect();
    const usersCollection = client.db("GitFormed").collection('users');
    const repositoryCollection = client.db("GitFormed").collection('repositories');
    const pullRequestCollection = client.db("GitFormed").collection('pullRequests');
    const watchedRepositoryCollection = client.db("GitFormed").collection('watchedRepositories');

    app.get('/', (req, res) => {
      res.send("Welcome to your Express server");
    });
    // Check Login Status route
    app.get('/check-login-status', (req, res) => {
      if (req.session && req.session.user) {
        // User is logged in
        res.json({ isLoggedIn: true, user: req.session.user });
      } else {
        // User is not logged in
        res.json({ isLoggedIn: false, user: null });
      }
    });
    
 

    app.post('/createRepository', async (req, res) => {
      const { name, userEmail } = req.body;

      // Validate repository name
      if (!validateRepositoryName(name)) {
        return res.status(400).json({ message: 'Invalid repository name. It must match the pattern [A-Za-z0-9-_]{5,10].' });
      }

      try {
        // Check if the repository name already exists
        const existingRepository = await repositoryCollection.findOne({ name });
        if (existingRepository) {
          return res.status(400).json({ message: 'Repository name already exists. Please choose a different name.' });
        }

        // Create a new repository
        const newRepository = {
          name,
          createdAt: new Date().toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" }),
          userEmail,
        };

        const result = await repositoryCollection.insertOne(newRepository);
        res.send(result)

      } catch (error) {
        console.error('Error creating repository:', error);
        res.status(500).json({ message: 'Internal server error' });
      }

    });

    // ...

    app.get('/repositories', async (req, res) => {
      let query = {};
      if (req.query?.userEmail) {
        query = { userEmail: req.query.userEmail }
      }
      try {
        const regularRepositories = await repositoryCollection.find(query).toArray();
        const watchedRepositories = await watchedRepositoryCollection.find(query).toArray();
        res.json({ regularRepositories, watchedRepositories });
      } catch (error) {
        console.error('Error fetching repositories:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    app.post('/createPullRequest', async (req, res) => {
      const { repositoryId, name, userEmail } = req.body;
      // console.log(repositoryId, name)
      console.log('Received pull request creation request for repository with ID:', repositoryId);

      try {
        // Check if the repository exists
        const repository = await repositoryCollection.findOne({ name });
        if (!repository) {
          return res.status(404).json({ message: 'Repository not found.' });
        }

        // Create a new pull request
        const newPullRequest = {
          repositoryId: new ObjectId(repositoryId),
          name,
          createdAt: new Date().toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" }),
          userEmail,
          // Add more fields as needed
        };

        const pullRequestResult = await pullRequestCollection.insertOne(newPullRequest);
        res.json({ message: 'Pull request created successfully.', pullRequestId: pullRequestResult.insertedId });
      } catch (error) {
        console.error('Error creating pull request:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    app.get('/pullRequests', async (req, res) => {
      let query = {};
      if (req.query?.userEmail) {
        query = { userEmail: req.query.userEmail }
      }
      try {
        const pullRequests = await pullRequestCollection.find(query).toArray();
        res.json(pullRequests);
      } catch (error) {
        console.error('Error fetching pull requests:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });
    // app.get('/pullRequests', async (req, res) => {
    //   const result = await pullRequestCollection.find().toArray();
    //   res.send(result);
    // });

    // Watch a Repository
    app.post('/watchRepository', async (req, res) => {
      const { repositoryId, userEmail ,repoName} = req.body;
      console.log(userEmail)
      try {
        // Check if the repository exists
        const repository = await repositoryCollection.findOne({ _id: new ObjectId(repositoryId) });
        if (!repository) {
          return res.status(404).json({ message: 'Repository not found.' });
        }

        // Check if the user is already watching the repository
        const existingWatchedRepository = await watchedRepositoryCollection.findOne({ repositoryId: new ObjectId(repositoryId), userEmail ,repoName});
        if (existingWatchedRepository) {
          return res.status(400).json({ message: 'You are already watching this repository.' });
        }

        // Save the repository ID and user email in the watchedRepositoryCollection
        const newWatchedRepository = {
          repositoryId: new ObjectId(repositoryId),
          repoName,
          userEmail,
          createdAt: new Date().toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" }),
          // Add more fields as needed
        };

        const watchResult = await watchedRepositoryCollection.insertOne(newWatchedRepository);
        res.json({ message: 'You are now watching this repository.', watchedRepositoryId: watchResult.insertedId });
      } catch (error) {
        console.error('Error watching repository:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });
    app.get('/watchedRepositories', async (req, res) => {
      let query = {};
      if (req.query?.userEmail) {
        query = { userEmail: req.query.userEmail }
      }
      try {
        const watchedRepositories = await watchedRepositoryCollection.find(query).toArray();
        res.json(watchedRepositories);
      } catch (error) {
        console.error('Error fetching pull requests:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });
    app.delete('/watchRepository/:id', async (req, res) => {
     const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await watchedRepositoryCollection.deleteOne(query);
      res.send(result)
      
    })

   
    app.delete('/repositories/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await repositoryCollection.deleteOne(query);
      res.send(result)

    })


    app.get('/', async (req, res) => {
      let query = {};
      if (req.query?.userEmail) {
        query = { userEmail: req.query.userEmail }
      }
      const result = await watchedRepositoryCollection.find(query).toArray();
      res.send(result);
    });


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Uncomment the next line if you want to close the MongoDB connection after the server runs
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("Server is running again")
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
