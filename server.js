// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/) and axios (https://www.npmjs.com/package/axios)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const axios = require("axios");
const { getAccessToken } = require("./spotify/auth");
const { searchTracks, searchArtist, getRecommendations } = require("./spotify/actions");

const BASE_URL = "https://api.spotify.com/v1"

// initialize an express instance called 'app' 
const app = express();

// Log an error message if any of the secret values needed for this app are missing
if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  console.error("ERROR: Missing one or more critical Spotify environment variables. Check .env file");
}

// set up the app to parse JSON request bodies
app.use(express.json());

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// return the index.html file when a GET request is made to the root path "/"
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// app.post("/recommendations", async (req, res) => {
//   if(!req.body) {
//     return res.status(400).send({ message: "Bad Request - must send a JSON body with track and artist" })
//   }
  
//   const { track, artist } = req.body
  
//   if(!track || !artist) {
//     return res.status(400).send({ message: "Bad Request - must pass a track and artist" })
//   }
  
//   // 1. Get access token
//   let accessToken
//   try {
//     accessToken = await getAccessToken()
//   } catch(err) {
//     console.error(err.message)
//     return res.status(500).send({ message: "Something went wrong when fetching access token" })
//   }
  
//   // Create an instance of axios to apply access token to all request headers
//   const http = axios.create({ headers: { 'Authorization': `Bearer ${accessToken}` }})
  
//   // 2. get track id from search
//   let trackId;
  
//   try {
//     const result = await searchTracks(http, { track, artist })
//     const { tracks } = result
    
//     if(!tracks || !tracks.items || !tracks.items.length ) {
//       return res.status(404).send({ message: `Song '${track}' by ${artist} not found.` })
//     }
    
//     // save the first search result's trackId to a variable
//     trackId = tracks.items[0].id
//   } catch(err) {
//     console.error(err.message)
//     return res.status(500).send({ message: "Error when searching tracks" })
//   }
  
//   // 3. get song recommendations
//   try {
//     const result = await getRecommendations(http, { trackId })
//     const { tracks } = result

//     // if no songs returned in search, send a 404 response
//     if(!tracks || !tracks.length ) {
//       return res.status(404).send({ message: "No recommendations found." })
//     }
    
//     // Success! Send track recommendations back to client
//     return res.send({ tracks })
//   } catch(err) {
//     console.error(err.message)
//     return res.status(500).send({ message: "Something went wrong when fetching recommendations" })
//   }
// });

app.post("/recommendations", async (req, res) => {
  if(!req.body) {
    return res.status(400).send({ message: "Bad Request - must send a JSON body with track and artist" })
  }
  
  const { artist1, artist2, artist3 } = req.body;
  
  if(!artist1 || !artist2 || !artist3) {
    return res.status(400).send({ message: "Bad Request - must pass names of three artists" })
  }
  
  // 1. Get access token
  let accessToken
  try {
    accessToken = await getAccessToken();
  } catch(err) {
    console.error(err.message);
    return res.status(500).send({ message: "Something went wrong when fetching access token" });
  }
  
  // Create an instance of axios to apply access token to all request headers
  const http = axios.create({ headers: { 'Authorization': `Bearer ${accessToken}` }})
  
  // 2. get artist id from search
  let artistId1;
  let artistId2;
  let artistId3;
  
  try {
    const result1 = await searchArtist(http, artist1);
    const  artists1  = result1;
    if(!artists1.artists || !artists1.artists.items || !artists1.artists.items.length) {
      return res.status(404).send({ message: `${artist1} not found.` })
    }
    
    // save the first search result's artistId to a variable
    artistId1 = artists1.artists.items[0].id
    
  } catch(err) {
    console.error(err.message)
    return res.status(500).send({ message: "Error when searching tracks" })
  }
  
  try {
    const result2 = await searchArtist(http, artist2);
    const  artists2  = result2;
    if(!artists2.artists || !artists2.artists.items || !artists2.artists.items.length) {
      return res.status(404).send({ message: `${artist2} not found.` })
    }
    
    // save the first search result's artistId to a variable
    artistId2 = artists2.artists.items[0].id
    
  } catch(err) {
    console.error(err.message)
    return res.status(500).send({ message: "Error when searching tracks" })
  }
  
  try {
    const result3 = await searchArtist(http, artist3);
    const  artists3 = result3;
    if(!artists3.artists || !artists3.artists.items || !artists3.artists.items.length) {
      return res.status(404).send({ message: `${artist3} not found.` })
    }
    
    // save the first search result's artistId to a variable
    artistId3 = artists3.artists.items[0].id
    
  } catch(err) {
    console.error(err.message)
    return res.status(500).send({ message: "Error when searching tracks" })
  }
  
  // 3. get song recommendations
  try {
    const result = await getRecommendations(http, { artistId1, artistId2, artistId3 })
    const { tracks } = result
    console.log(tracks);

    // if no songs returned in search, send a 404 response
    if(!tracks || !tracks.length ) {
      return res.status(404).send({ message: "No recommendations found." })
    }
    
    // Success! Send track recommendations back to client
    return res.send({ tracks })
  } catch(err) {
    console.error(err.message)
    return res.status(500).send({ message: "Something went wrong when fetching recommendations" })
  }
  
});

// after our app has been set up above, start listening on a port provided by Glitch
app.listen(process.env.PORT, () => {
  console.log(`Example app listening at port ${process.env.PORT}`);
});


