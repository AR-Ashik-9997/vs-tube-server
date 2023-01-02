const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri=process.env.DB_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function connect() {
  try {
    const videoCollections = client
      .db("VS-TUBE")
      .collection("video-information");
    const videoComments = client
      .db("VS-TUBE")
      .collection("Video-Comments");

      app.get("/video-info", async (req, res) => {        
        const result = await videoCollections.find({}).toArray();
        res.send(result);
      });
      app.get("/single-video/:url", async (req, res) => {
        const video_url= req.params.url;
        const query = {video_url:video_url };
        const result = await videoCollections.find(query).toArray();
        res.send(result);
      });
      app.post("/AddComments", async (req, res) => {
      const comment = req.body;
      const result = await videoComments.insertOne(comment);
      res.send(result);
    });
      app.get("/comments/:id", async (req, res) => {
       const comment_id= req.params.id;
        const query = {video_id:comment_id};
        const result = await videoComments.find(query).toArray();
        res.send(result);
    });
  } 
  finally {
  }
}
connect().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
