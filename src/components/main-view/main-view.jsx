import React from 'react';
import axios from 'axios';
import {MovieCard} from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export class MainView extends React.Component {
    constructor() {
      // Call the superclass constructor
      // so React can initialize it
      super();
  
      // Initialize the state to an empty object so we can destructure it later
      this.state = {
          movies:null,
          selectedMovie: null,
          user: null
      };
    }
  
    componentDidMount() {
        axios.get('https://myflixmovies-fj.herokuapp.com/movies')
          .then(response => {
            // Assign the result to the state
            this.setState({
              movies: response.data
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      }

      onMovieClick(movie) {
        this.setState({
          selectedMovie: movie
        });
      }

      onLoggedIn(user) {
        this.setState({
          user
        });
      }

    // This overrides the render() method of the superclass
    // No need to call super() though, as it does nothing by default
    render() {
        const { movies, selectedMovie, user } = this.state;

        if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
        if (!movies) return <div className="main-view"/>;

        return (
          <Row className="main-view justify-content-md-center">
            {selectedMovie
              ? (
                  <Col md={8} style={{border: '1px solid black'}}>
                    <MovieView movie={selectedMovie} onBackClick={movie => this.onMovieClick(null)} />
                  </Col>
                )
              : movies.map(movie => (
                  <Col sm>
                    <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)}/>
                  </Col>
                ))
            }
          </Row>
        );
    }
  }