import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { Link } from "react-router-dom";

export class MovieCard extends React.Component {
  render() {
    const { movie } = this.props;

    return (
      <Card style={{ width: '16rem' }}>
        <Card.Img variant="top" src={movie.ImagePath} />
        <Card.Body class="card-body">
          <Card.Title>{movie.Title}</Card.Title>
          {/* <Card.Text>{movie.Description}</Card.Text> */}
          <Link to={`/movies/${movie._id}`}>
            <Button class="open" variant="link">Open</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }
}