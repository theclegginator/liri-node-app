// NPM package requirements 
require("dotenv").config();
const Spotify = require("node-spotify-api");
const keys = require("./keys.js");
const axios = require("axios"); // enable axios for API calls within Node.
const spotify = new Spotify(keys.spotify);
const moment = require("moment");
const fs = require("file-system"); 
 
// Function for writing LIRI data to a log file
function writeToFile(data) {
    let timeStamp = `${moment()}\n`;
    fs.appendFile('liri_log.txt',timeStamp, 'utf8',
        // callback function for error loggin
        function(err) { 
            if (err) throw err;
            // If there is no error writing the timestamp, then write the data to the log.
            fs.appendFile('liri_log.txt',data, 'utf8',
                function(err) { 
                    if (err) throw err;
    });
    });
}

// ========================== //
// ===== LIRI FUNCTIONS ===== //
// ========================== //

// ========================== //
// ======= Bandsintown ====== //
// ========================== //
function concert(artist="Periphery") {
    console.log("\x1b[35m", `===== Retrieving Information on Next Three Concerts for ${artist}... =====`)
    let queryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`
    axios
    .get(queryURL)
    .then(function(response) {
        if(response.data.length !== 0 && response.data !== undefined) {
            let data = 
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
            City: ${response.data[2].venue.city}\n`
            console.log("\x1b[33m", data)
            console.log("\x1b[0m", "") // resets terminal color to default.
            // write the retrieved data to a text file log.
            writeToFile(data);
        }
        else {
            console.log("\x1b[33m", `No upcoming concerts for ${artist}! :(`)
            console.log("\x1b[0m", "") // resets terminal color to default.)
        }
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
// ======== Spotify ========= //
// ========================== //
function spotifyCall(song = "The Sign Ace of Base") {
    console.log("\x1b[35m", `===== Retrieving Song Information for ${song}... =====`)
    // perform search using the spotify node module, then pull specific info by digging into JSON packet from promise.
    spotify
    .search({ type: 'track', query: `${song}` })
    .then(function(response) {
        let data = 
            `Song Info Retrieved:
            Artist: ${response.tracks.items[0].artists[0].name}
            Song Title: ${response.tracks.items[0].name}
            Album Title: ${response.tracks.items[0].album.name}
            Song Link: ${response.tracks.items[0].external_urls.spotify}\n`
        console.log("\x1b[32m", data)
        console.log("\x1b[0m", "") // Resets terminal color to default.
        // write the retrieved data to a text file log.
        writeToFile(data);
    })
    .catch(function(err) {
      console.log(err);
    });
}

// ========================== //
// ========== OMDB ========== //
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
        let data = 
            `Movie Info Retrieved:
            Title: ${response.data.Title}
            Released: ${response.data.Year}
            IMDB Score: ${response.data.imdbRating}
            Rotten Tomatoes Score: ${response.data.Ratings[1].Value}
            Country of Origin: ${response.data.Country}
            Language: ${response.data.Language}
            Plot Summary: ${response.data.Plot}
            Main Actors: ${response.data.Actors}\n`

        console.log("\x1b[36m%s\x1b[0m", data) 
        console.log("\x1b[0m", "") // resets terminal color to default.
        // write the retrieved data to a text file log.
        writeToFile(data);
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
        // As a JSON object or a string is a "truthy" value, while null is not, we can call the error below if one exists:
        if (err) {
            console.log(err)
        }
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
console.log(liriCommand)

switch (liriCommand) {
    // if no LIRI function was called, tell the user how to operate LIRI.
    case undefined: 
        console.log("\x1b[35m",`
        Welcome to LIRI (Language Interpretation and Recognition Interface)!\n
        ===== COMMANDS FOR LIRI =====
        1. Look up concerts for an artist.
            - Use the format node 'liri.js concert-this "<artist or band name here>"'
            - Will return information from Bandsintown for the next 3 upcoming shows from the artist specified.
        2. Look up song info on Spotify.
            - Use the format node 'liri.js spotify-this-song "<song name here>"'
            - Will return information and a spotify link for the best search result matching your request.
        3. Look up information on a movie.
            - Use the format node 'liri.js movie-this "<movie name here>"'
            - Will return information like actors, year, and review scores for the movie specified.
        4. Follow a command from a file named "random.txt" from the same working directory.
            - Use the format node 'liri.js do-what-it-says'
            - You can place a LIRI command and query info into random.text just as you would for any of the above 3 commands.
        ============================
        `)
        console.log("\x1b[0m", "")
        break;
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