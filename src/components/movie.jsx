import React, { useState, useEffect } from "react";
import MovieDataService from "../services/movies";
import { Link, useParams } from "react-router-dom";
import moment from 'moment'; // Cài thêm: npm install moment

const Movie = props => {
  const { id } = useParams();
  const [movie, setMovie] = useState({
    id: null,
    title: "",
    rated: "",
    reviews: []
  });

  const getMovie = id => {
    MovieDataService.get(id)
      .then(response => {
        setMovie(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getMovie(id);
  }, [id]);

  const deleteReview = (reviewId, index) => {
    MovieDataService.deleteReview(reviewId, props.user.id)
      .then(response => {
        setMovie((prevState) => {
          prevState.reviews.splice(index, 1);
          return ({ ...prevState });
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      <div className="container">
        {movie ? (
          <div>
            <h5>{movie.title}</h5>
            <p>
              <strong>Plot: </strong>{movie.plot}<br />
              <strong>Rated: </strong>{movie.rated}
            </p>
            <div className="mt-4">
              <Link to={"/movies/" + id + "/review"} className="btn btn-primary mb-3">
                Add Review
              </Link>
              <h4>Reviews</h4>
              <div className="row">
                {movie.reviews && movie.reviews.length > 0 ? (
                  movie.reviews.map((review, index) => {
                    return (
                      <div className="col-lg-4 pb-1" key={index}>
                        <div className="card">
                          <div className="card-body">
                            <p className="card-text">
                              {review.review}<br />
                              <strong>User: </strong>{review.name}<br />
                              <strong>Date: </strong>{moment(review.date).format("Do MMMM YYYY")}
                            </p>
                            {props.user && props.user.id === review.user_id &&
                              <div className="row">
                                <Link 
                                  to={{ pathname: "/movies/" + id + "/review" }}
                                  state={{ currentReview: review }}
                                  className="col-6 btn btn-primary col-lg-5 mx-1 mb-1"
                                >
                                  Edit
                                </Link>
                                <button 
                                  onClick={() => deleteReview(review._id, index)}
                                  className="btn btn-danger col-lg-5 mx-1 mb-1"
                                >
                                  Delete
                                </button>
                              </div>
                            }
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-sm-4">
                    <p>No reviews yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <br />
            <p>No movie selected.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movie;