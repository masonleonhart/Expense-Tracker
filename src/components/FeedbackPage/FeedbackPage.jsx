import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import "./FeedbackPage.css";

import { Button, TextField, makeStyles } from "@material-ui/core";

import { Alert } from "@material-ui/lab";

function FeedbackPage() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const [keyErrorAlertToggle, setKeyErrorAlertToggle] = useState(false);
  const [keySuccessAlertToggle, setKeySuccessAlertToggle] = useState(false);
  const [keyErrorBadRequest, setKeyErrorBadRequest] = useState(true);
  const [feedbackErrorAlertToggle, setFeedbackErrorAlertToggle] = useState(
    false
  );
  const [feedbackSuccessAlertToggle, setFeedbackSuccessAlertToggle] = useState(
    false
  );
  const [keyInput, setKeyInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");

  const handleKeySubmit = async (e) => {
    try {
      e.preventDefault();

      const response = await axios.put(`/api/user/keycheck`, {
        keyInput,
      });

      setKeyInput("");
      {
        keyErrorAlertToggle && setKeyErrorAlertToggle(false);
      }
      setKeySuccessAlertToggle(true);
      setTimeout(() => dispatch({ type: "FETCH_USER" }), 3000);
    } catch (err) {
      if (err.response.status !== 400) {
        setKeyErrorBadRequest(false);
      } else if (keyErrorBadRequest !== true && err.response.status === 400) {
        setKeyErrorBadRequest(true);
      }

      console.log("Error in submitting key", err);
      setKeyErrorAlertToggle(true);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    try {
      e.preventDefault();

      const response = await axios.post("/api/user/feedback", {
        feedbackInput,
      });

      console.log(response);
      setFeedbackInput("");
    } catch (error) {
      console.log("Error in submitting feedback", error);
    }
  };

  const useStyles = makeStyles({
    keySubmitButton: {
      color: "white",
      marginLeft: ".5rem",
      marginTop: "1rem",
    },
    feedbackSubmitButton: {
      color: "white",
    },
    feedbackTextField: {
      width: "15rem",
    },
  });

  const classes = useStyles();

  useEffect(() => {
    dispatch({ type: "FETCH_LINK_TOKEN", payload: user.access_token });
  }, []);

  return (
    <div
      className="container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {!user.plaid_key && (
        <div id="plaid-key-form">
          <h2 style={{ marginTop: 0 }}>Do you have a Plaid Key?</h2>
          {keyErrorAlertToggle && (
            <>
              <Alert
                onClose={() => setKeyErrorAlertToggle(false)}
                severity="error"
              >
                {keyErrorBadRequest
                  ? "Invalid key, please try again."
                  : "There was an error in checking your key."}
              </Alert>
              <br />
            </>
          )}
          {keySuccessAlertToggle && (
            <>
              <Alert onClose={() => setKeySuccessAlertToggle(false)}>
                Plaid Key added successfully!
              </Alert>
              <br />
            </>
          )}
          <form onSubmit={handleKeySubmit}>
            <TextField
              required
              label="Enter Key"
              variant="outlined"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.keySubmitButton}
            >
              Submit
            </Button>
          </form>
          <br />
          <br />
        </div>
      )}
      <h2 style={{ marginTop: 0 }}>Drop some feedback! (Anonymous)</h2>
      {feedbackErrorAlertToggle && (
        <>
          <Alert
            onClose={() => setFeedbackErrorAlertToggle(false)}
            severity="error"
          >
            Error in adding feedback.
          </Alert>
          <br />
        </>
      )}
      {feedbackSuccessAlertToggle && (
        <>
          <Alert onClose={() => setFeedbackSuccessAlertToggle(false)}>
            Feedback added successfully!
          </Alert>
          <br />
        </>
      )}
      <form onSubmit={handleFeedbackSubmit}>
        <TextField
          className={classes.feedbackTextField}
          multiline
          label="Feedback?"
          value={feedbackInput}
          onChange={(e) => setFeedbackInput(e.target.value)}
        />
        <br />
        <br />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.feedbackSubmitButton}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

export default FeedbackPage;
