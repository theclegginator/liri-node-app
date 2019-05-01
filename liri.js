// NPM package requirements 
require("dotenv").config();
const Spotify = require("node-spotify-api");
const keys = require("./keys.js");
const axios = require("axios"); // enable axios for API calls within Node.
const spotify = new Spotify(keys.spotify);
const moment = require("moment");
const fs = require("file-system");

// ========================== //
// ===== LIRI FUNCTIONS ===== //
// ========================== //

// ========================== //
// ===== Bands in Town ===== //
// ========================== //
function concert(artist="Periphery") {
    console.log("\x1b[35m", `===== Retrieving Information on Next Three Concerts for ${artist}... =====`)
    let queryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`
    axios
    .get(queryURL)
    .then(function(response) {
        console.log("\x1b[33m", 
                `Event Info for ${artist} Retrieved:
                ===== Event 1 =====
                Date: ${moment(response.data[0].datetime).format("MM/DD/YYYY")}
                Venue: ${response.data[0].venue.name}
                Country: ${response.data[0].venue.country}
                City: ${response.data[0].venue.city}

                ===== Event 2 =====
                Date: ${moment(response.data[1].datetime).format("MM/DD/YYYY")}
                Venue: ${response.data[1].venue.name}
                Country: ${response.data[1].venue.country}
                City: ${response.data[1].venue.city}

                ===== Event 3 =====
                Date: ${moment(response.data[2].datetime).format("MM/DD/YYYY")}
                Venue: ${response.data[2].venue.name}
                Country: ${response.data[2].venue.country}
                City: ${response.data[2].venue.city}`
            )
            console.log("\x1b[0m", "") // resets terminal color to default.
    })
    // If any errors are present, show them in the console log.
    .catch(function(error) {
        if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        } else if (error.request) {
        console.log(error.request);
        } else {
        console.log("Error", error.message);
        }
        console.log(error.config);
    });
}

// ========================== //
// ===== Spotify ===== //
// ========================== //
function spotifyCall(song = "The Sign Ace of Base") {
    console.log("\x1b[35m", `===== Retrieving Song Information for ${song}... =====`)
    spotify
    .search({ type: 'track', query: `${song}` })
    .then(function(response) {
      //console.log(response.tracks.items[0])
      console.log("\x1b[32m", 
                `Song Info Retrieved:
                Artist: ${response.tracks.items[0].artists[0].name}
                Song Title: ${response.tracks.items[0].name}
                Album Title: ${response.tracks.items[0].album.name}
                Song Link: ${response.tracks.items[0].external_urls.spotify}`
            )
            console.log("\x1b[0m", "") // Resets terminal color to default.
    })
    .catch(function(err) {
      console.log(err);
    });
}

// ========================== //
// ===== OMDB ===== //
// ========================== //

function omdb(movieTitle = "mr+nobody") {
    // replaces spaces with + to ensure wording works with OMDB
    movieTitleStringify = movieTitle.replace(/\s/gi, "+"); 
    console.log("\x1b[35m", `===== Retrieving Movie Information for ${movieTitle}... =====`)
    let queryURL = `https://www.omdbapi.com/?t=${movieTitleStringify}&y=&plot=short&apikey=trilogy`;

    // Perform axios call to OMDB API.
    axios
    .get(queryURL)
    .then(function(response) {
        console.log("\x1b[36m%s\x1b[0m", 
                `Movie Info Retrieved:
                Title: ${response.data.Title}
                Released: ${response.data.Year}
                IMDB Score: ${response.data.imdbRating}
                Rotten Tomatoes Score: ${response.data.Ratings[1].Value}
                Country of Origin: ${response.data.Country}
                Language: ${response.data.Language}
                Plot Summary: ${response.data.Plot}
                Main Actors: ${response.data.Actors}`
            )
            console.log("\x1b[0m", "") // resets terminal color to default.
    })
    // If any errors are present, show them in the console log.
    .catch(function(error) {
        if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        } else if (error.request) {
        console.log(error.request);
        } else {
        console.log("Error", error.message);
        }
        console.log(error.config);
    });
}
// ========================== //
// ===== Read Text File ===== //
// ========================== //
function randomize() {
    fs.readFile("random.txt", function(err, content) {
        let liriFunction = content.toString().split(",")[0]; // gathers the liri function from the text file
        let liriParam = content.toString().split(",")[1]; // gathers the liri parameter (like song title, etc.)
        liriParam = liriParam.replace(/['"]+/g, ''); //removes any quotes around the liriParameter
        switch (liriFunction) {
            case "concert-this":
                concert(liriParam);
                break;
            case "spotify-this-song":
                spotifyCall(liriParam);
                break;
            case "movie-this":
                omdb(liriParam);
                break;
            case "do-what-it-says":
                console.log("\x1b[31m", "WARNING! Evoking the do-what-it-says function WITHIN the do-what-it-says function will cause an infinite loop! Please choose another function.")
                console.log("\x1b[0m", "")
                break;
        }
      });  
}

// take in the LIRI command.
// Will take format "node liri.js [command]"
let liriCommand = process.argv[2]; 

switch (liriCommand) {
    case "concert-this":
        // input format = `node liri.js concert-this <artist/band name here>`
        let artist = process.argv[3];
        concert(artist);
        break;
    case "spotify-this-song":
        // input format = `node liri.js spotify-this-song '<song name here>'`
        let song = process.argv[3];
        spotifyCall(song);
        break;
    case "movie-this":
        // input format = `node liri.js movie-this '<movie name here>'`
        let movieTitle = process.argv[3];
        omdb(movieTitle);
        break;
    case "do-what-it-says":
        randomize();
        break;
}