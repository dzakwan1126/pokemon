import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card, Accordion, Button } from "react-bootstrap";
import './index.css';

function App(){
  const [pokedex, setPokedex] = useState([])
  const [wildPokemon, setWildPokemon] = useState({});

  useEffect(() =>{
    encounterWildPokemon()
  }, [])
  
  const pokeId = () => {
    const min = Math.ceil(1)
    const max = Math.floor(151)
    return Math.floor(Math.random() * (max-min + 1)) + min
  }

  

  const encounterWildPokemon = () => {
    axios
      .get('https://pokeapi.co/api/v2/move/' + pokeId())
      .then(response => {
        console.log(response.data);
        setWildPokemon(response.data);
      })
  }

  const nextPokemon = () => {
    axios
      .get('https://pokeapi.co/api/v2/move/' + pokeId() + 1)
      .then(response => {
        console.log(response.data);
        setWildPokemon(response.data);
      })
  }

  const releasePokemon = id => {
    setPokedex(state => state.filter(p => p.id !== id))
  }

  const catchPokemon = (pokemon) => {
    setPokedex(state => {
      const monExists = (state.filter(p => pokemon.id === p.id).length > 0);

      if (!monExists){
        state = [...state,pokemon]
        state.sort(function(a,b){
          return a.id - b.id
        })
      }
      return state
    })
    encounterWildPokemon()
  }

  return(
    <div className="app-wrapper">
      <header>
        <h1 className="title">Pokemon List</h1>
        {/* <h3 className="subtitle">With Pokemon</h3> */}
      </header>
      <Container>
          <section className="wild-pokemon">
            <img src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + wildPokemon.id + ".png"} alt={wildPokemon.name} className="sprite"/>
            <h3>{wildPokemon.name}</h3>
            <Accordion>
                  <Accordion.Toggle className="catch-btn" as={Button} variant="link" eventKey="0">
                    Detail Pokemon
                  </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <p>Name : {wildPokemon.name}</p>
                    <p>Accuracy : {wildPokemon.accuracy}</p>
                    <p>Power : {wildPokemon.power}</p>
                    <p>Priority : {wildPokemon.priority} </p>
                  </Card.Body>
                </Accordion.Collapse>
            </Accordion>
            <button className="catch-btn" onClick={()=> catchPokemon(wildPokemon)}>Catch</button>
            <button className="catch-btn" onClick={()=> nextPokemon(wildPokemon.id) }>Skip</button>
          </section>
      </Container>

      <Container>
      <section className="pokedex">
        <h2>My Favorite Pokemon</h2>
        <Row>
        <div className="pokedex-list">
          {pokedex.map(pokemon => (
            <div className="pokemon" key={pokemon.id}> 
              <img src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + pokemon.id + ".png"} alt={pokemon.name} className="sprite"/>
              <h3 className="pokemon-name">{pokemon.name} </h3>
              <button className="remove" onClick={()=> releasePokemon(pokemon.id)}>&times;</button>
            </div>
          ))}
        </div>
        </Row>
      </section>
      </Container>
    </div>
  )
}

ReactDOM.render(
    <App />,
  document.getElementById('root')
);
