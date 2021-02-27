import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { setMovies } from "../../actions/actions.js";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { DirectorView } from "../director-view/director-view";
import { GenreView } from "../genre-view/genre-view";
import { ProfileView } from "../profile-view/profile-view";
import { RegistrationView } from "../registration-view/registration-view";
import { ProfileUpdate } from "../profile-update/profile-update";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import MoviesList from "../movies-list/movies-list";
import VisibilityFilterInput from "../visibility-filter-input/visibility-filter-input.jsx";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import './main-view.scss'

class MainView extends React.Component {
  constructor() {
    super();

    this.state = {
      movies: [],
      selectedMovie: "",
      user: "",
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem("user"),
      });
      this.getMovies(accessToken);
    }
  }

  getMovies(token) {
    axios
      .get("https://myflixmovies-fj.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Assign the result to the state
        this.props.setMovies(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie,
    });
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username,
    });

    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    this.getMovies(authData.token);
  }

  logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState({
      user: null,
    });
    console.log("logout successful");
    alert("You have been successfully logged out");
    window.open("/", "_self");
  }

  render() {
    let { movies, visibilityFilter } = this.props;
    let { user } = this.state;

    // if (!user)
    //   return <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />;
    if (!movies) return <div className="main-view" />;

    return (
      <div>
        <Router>
        <Navbar
            expand="lg"
            sticky="top"
            variant="dark"
            expand="lg"
            className="navbar shadow-sm mb-5"
          >
            <Navbar.Brand href="http://localhost:1234" className="navbar-brand">
              MyFlix
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
              className="justify-content-end"
              id="basic-navbar-nav"
            >
              <Form inline>
                
                 <VisibilityFilterInput
                className="mr-sm-2"
                visibilityFilter={visibilityFilter}
              />
              </Form>
             
              {!user ? (
                <ul>
                  <Link to={`/`}>
                    <Button variant="link" className="navbar-link">
                      Sign In
                    </Button>
                  </Link>
                  <Link to={`/register`}>
                    <Button variant="link" className="navbar-link">
                      Register
                    </Button>
                  </Link>
                </ul>
              ) : (
                <ul>
                  <Link to={`/`}>
                    <Button
                      variant="link"
                      className="navbar-link"
                      onClick={() => this.logOut()}
                    >
                      Sign Out
                    </Button>
                  </Link>
                  <Link to={`/users/${user}`}>
                    <Button variant="link" className="navbar-link">
                      My Account
                    </Button>
                  </Link>
                  <Link to={`/`}>
                    <Button variant="link" className="navbar-link">
                      Movies
                    </Button>
                  </Link>
                  <Link to={`/about`}>
                    <Button variant="link" className="navbar-link">
                      About
                    </Button>
                  </Link>
                </ul>
              )}
            </Navbar.Collapse>
          </Navbar>

          <div className="main-view">
            <Route
              exact
              path="/"
              render={() => {
                if (!user)
                  return (
                    <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                  );
                return <MoviesList movies={movies} />;
              }}
            />
            <Route path="/register" render={() => <RegistrationView />} />
            <Route
              path="/movies/:movieId"
              render={({ match }) => (
                <MovieView
                  movie={movies.find((m) => m._id === match.params.movieId)}
                />
              )}
            />
            <Route
              path="/update/:userId"
              render={() => {
                return <ProfileUpdate />;
              }}
            />
            <Route
              path="/directors/:name"
              render={({ match }) => {
                if (!movies) return <div className="main-view" />;
                return (
                  <DirectorView
                    director={movies.find(
                      (m) => m.Director.Name === match.params.name
                    )}
                    movies={movies}
                  />
                );
              }}
            />
            <Route
              path="/genres/:name"
              render={({ match }) => {
                if (!movies) return <div className="main-view" />;
                return (
                  <GenreView
                    genre={movies.find(
                      (m) => m.Genre.Name === match.params.name
                    )}
                    movies={movies}
                  />
                );
              }}
            />
            <Route
              exact
              path="/users/:userId"
              render={() => <ProfileView movies={movies} />}
            />
          </div>
        </Router>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return { movies: state.movies };
};

export default connect(mapStateToProps, { setMovies })(MainView);
