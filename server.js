require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies.json')

const app = express()


app.use(morgan('dev'))
app.use(helmet())
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization');

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401)
            .json({ error: 'unauthorized request' })
    }

    next()
})



app.get('/movie', function movieHandler(req, res) {
    let response = MOVIES;
    const { genre, country, avg_vote } = req.query;


    // const genreResponse = response.filter((movie) => {
    //     if (!genre) {
    //         return movie;
    //     }
    //     return movie.genre.trim().toLowerCase() === decodeURI(genre).toLowerCase().trim()
    // })

    // const countryResponse = genreResponse.filter((movie) => {
    //     if (!country) {
    //         return movie;
    //     }
    //     return movie.country.trim().toLowerCase() === decodeURI(country).toLowerCase().trim()
    // });

    // const averageVoteResponse = countryResponse.filter((movie) => {
    //     if (!avg_vote) {
    //         return movie;
    //     }
    //     return Number(movie.avg_vote) >= Number(avg_vote.trim())
    // });

    // return res.status(200)
    //     .json(averageVoteResponse)

    if (req.query.genre) {

        response = response.filter(movie => {

            return movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())

        })

    }
    if (req.query.country) {

        response = response.filter(movie => {
            return movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        })

    }
    if (req.query.avg_vote) {
        response = response.filter(movie => {
            return Number(movie.avg_vote) >= Number(req.query.avg_vote)
        })

    }
    console.log(response)
    res.json(response).send();
})


const PORT = 6000





app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})