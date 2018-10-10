const express = require('express');
const app = express();
var bodyParser = require('body-parser')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json())
app.use(express.static('public'))

app.locals.trainers = require('./utilities/helper')

app.get('/', function (request, response) {
  response.send('POKEMON!');
});

app.get('/api/v1/teams', (request, response) => {
  database('trainers').select()
    .then((trainers) => {
      response.status(200).json(trainers)
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/pokemon', (request, response) => {
  database('pokemon').select()
    .then((pokemon) => {
      response.status(200).json(pokemon)
    })

    .catch((error) => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/trainers/:id', (request, response) => {
  const id = request.params.id
  database('trainers').where('id', id).select()
    .then((trainer) => {
      response.status(200).json(trainer)
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/pokemon/:id', (request, response) => {
  const id = request.params.id
  database('pokemon').where('id', id).select()
    .then((team) => {
      response.status(200).json(team)
    })

    .catch((error) => {
      response.status(500).json({ error })
    })
})

app.post('/api/v1/trainers', (request, response) => {
  const trainer = request.body;
  console.log(trainer)

  for (let requiredParameter of ['name', 'level']) {
    if (!trainer[requiredParameter]) {
      return response.status(422).send({ error: `Expected format: { name: <String>, level: <Number> }. You're missing a "${requiredParameter}" property.` })
    }
  }

  database('trainers').insert(trainer, 'id')
    .then( trainer => response.status(201).json({ id: trainer[0] }) )
    .catch( error => response.status(500).json({ error }) )
})

app.post('/api/v1/pokemon', (request, response) => {
  const pokemon = request.body;
  console.log(pokemon)

  for (let requiredParameter of ['trainer_id', 'pokemon_one', 'pokemon_two', 'pokemon_three','pokemon_four', 'pokemon_five']) {
    if (!pokemon[requiredParameter]) {
      return response.status(422).send({ error: `Expected format: { trainer_id: <Number>, pokemon_one: <String>, pokemon_two: <String>, pokemon_three: <String>, pokemon_four: <String>, pokemon_five: <String> }. You're missing a "${requiredParameter}" property.` })
    }
  }

  database('pokemon').insert(pokemon, 'id')
    .then( pokemon => response.status(201).json({ id: pokemon[0] }) )
    .catch( error => response.status(500).json({ error }) )
})


app.listen(app.get('port'), () => {
  console.log(`server is running on ${app.get('port')}.`);
});

module.exports = {app, database};
