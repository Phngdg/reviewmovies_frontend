import React, { useState, useEffect } from "react";
import MovieDataService from "../services/movies";
import { Link } from "react-router-dom";

const MoviesList = props => {
  const [movies, setMovies] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchRating, setSearchRating] = useState("");
  const [ratings, setRatings] = useState(["All Ratings"]);
  
  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(0);
  const [currentSearchMode, setCurrentSearchMode] = useState("");

  useEffect(() => {
    retrieveMovies();
    retrieveRatings();
  }, []);

  useEffect(() => {
    // Khi đổi trang thì gọi lại API tương ứng với chế độ tìm kiếm
    retrieveNextPage();
  }, [currentPage]);

  const retrieveNextPage = () => {
     if (currentSearchMode === "findByTitle")
       findByTitle();
     else if (currentSearchMode === "findByRating")
       findByRating();
     else
       retrieveMovies();
  };

  const retrieveMovies = () => {
    MovieDataService.getAll(currentPage)
      .then(response => {
        setMovies(response.data.movies);
        setCurrentPage(response.data.page);
        setEntriesPerPage(response.data.entries_per_page);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveRatings = () => {
    MovieDataService.getRatings()
      .then(response => {
        setRatings(["All Ratings"].concat(response.data));
      })
      .catch(e => {
        console.log(e);
      });
  };

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const onChangeSearchRating = e => {
    const searchRating = e.target.value;
    setSearchRating(searchRating);
  };

  const find = (query, by) => {
    MovieDataService.find(query, by, currentPage)
      .then(response => {
        setMovies(response.data.movies);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByTitle = () => {
    setCurrentSearchMode("findByTitle");
    find(searchTitle, "title");
  };

  const findByRating = () => {
    setCurrentSearchMode("findByRating");
    if (searchRating === "All Ratings") {
      retrieveMovies();
    } else {
      find(searchRating, "rated");
    }
  };

  return (
    <div className="App">
      <div className="row mb-3">
        {/* Tìm kiếm theo Title */}
        <div className="col-md-4 input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" onClick={findByTitle}>
              Search
            </button>
          </div>
        </div>
        
        {/* Tìm kiếm theo Rating */}
        <div className="col-md-4 input-group">
          <select onChange={onChangeSearchRating} className="form-control">
            {ratings.map((rating, index) => {
              return (
                <option value={rating} key={index}> {rating} </option>
              )
            })}
          </select>
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" onClick={findByRating}>
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {movies.map((movie) => {
          return (
            <div className="col-lg-4 pb-1" key={movie._id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="card-text">
                    <strong>Rated: </strong>{movie.rated}<br />
                    <strong>Plot: </strong>{movie.plot}
                  </p>
                  <Link to={"/movies/" + movie._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                    View Reviews
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Nút Next Page */}
      <br />
      <button 
        className="btn btn-link" 
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Get next page
      </button>
    </div>
  );
};

export default MoviesList;