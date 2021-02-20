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
          <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">MyFlix</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href={`/users/${user}`}>My Account</Nav.Link>
                {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">
                    Something
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">
                    Separated link
                  </NavDropdown.Item>
                </NavDropdown> */}
                <Nav.Link href={`/`}>Sign In</Nav.Link>
                {!user ? (
                  <div>
                    <Nav.Link href={`/`}>Sign In</Nav.Link>
                    <Nav.Link href={`/register`}>Register</Nav.Link>
                  </div>
                ) : (
                  <div>
                    <Nav.Link href={`/`} onClick={() => this.logOut()}>
                      Sign Out
                    </Nav.Link>
                    <Nav.Link to={`/users/${user}`}>My Account</Nav.Link>
                    <Nav.Link href={`/`}>Movies</Nav.Link>
                    <Nav.Link href={`/about`}>About</Nav.Link>
                 </div>
                )}
                
              </Nav>
            </Navbar.Collapse>
            <Form inline>
                  <VisibilityFilterInput
                    placeholder="Search"
                    className="mr-sm-2"
                    visibilityFilter={visibilityFilter}
                  />
                </Form>
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
