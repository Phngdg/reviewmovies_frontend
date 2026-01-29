import React, { useState } from "react";
import MovieDataService from "../services/movies";
import { Link, useParams, useLocation } from "react-router-dom";

const AddReview = props => {
  const { id } = useParams(); // Lấy ID phim từ URL
  let location = useLocation(); // Lấy dữ liệu state truyền qua Link (cho Edit)
  
  let initialReviewState = "";
  let editing = false;

  // Kiểm tra nếu đang ở chế độ Edit (có dữ liệu currentReview truyền qua)
  if (location.state && location.state.currentReview) {
    editing = true;
    initialReviewState = location.state.currentReview.review;
  }

  const [review, setReview] = useState(initialReviewState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    setReview(event.target.value);
  };

  const saveReview = () => {
    var data = {
      review: review,
      name: props.user.name,
      user_id: props.user.id,
      movie_id: id 
    };

    if (editing) {
      data.review_id = location.state.currentReview._id;
      MovieDataService.updateReview(data)
        .then(response => {
          setSubmitted(true);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      MovieDataService.createReview(data)
        .then(response => {
          setSubmitted(true);
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  return (
    <div>
      {props.user ? (
        <div className="submit-form">
          {submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <Link to={"/movies/" + id} className="btn btn-success">
                Back to Movie
              </Link>
            </div>
          ) : (
            <div>
              <div className="form-group mb-3">
                <label htmlFor="description">{editing ? "Edit" : "Create"} Review</label>
                <input
                  type="text"
                  className="form-control"
                  id="text"
                  required
                  value={review}
                  onChange={handleInputChange}
                  name="text"
                />
              </div>
              <button onClick={saveReview} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          Please log in.
        </div>
      )}
    </div>
  );
};

export default AddReview;