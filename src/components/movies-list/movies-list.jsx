import React from 'react';
import { connect } from 'react-redux';
import VisibilityFilterInput from '../visibility-filter-input/visibility-filter-input.jsx';
import { MovieCard } from '../movie-card/movie-card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

const mapStateToProps = state => {
  const { visibilityFilter } = state;
  return { visibilityFilter };
};

function MoviesList(props) {
  const { movies, visibilityFilter } = props;
  let filteredMovies = movies;

  if (visibilityFilter !== '') {
    filteredMovies = movies.filter(m => m.Title.toLocaleLowerCase().includes(visibilityFilter.toLocaleLowerCase()));
  }

  if (!movies) return <div className="main-view"/>;

  return <div className="movies-list"> 
  <Container>
      <Row>
        {filteredMovies.map(m => <MovieCard key={m._id} movie={m}/>)}
      </Row>
  </Container>
      
    </div>;
}


export default connect(mapStateToProps)(MoviesList);
