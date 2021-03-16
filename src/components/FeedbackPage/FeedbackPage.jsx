import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import "./FeedbackPage.css";

import { Button, TextField, makeStyles } from "@material-ui/core";

import { Alert } from "@material-ui/lab";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

function FeedbackPage() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const [errorAlertToggle, setErrorAlertToggle] = useState(false);
  const [successAlertToggle, setSuccessAlertToggle] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [errorBadRequest, setErrorBadRequest] = useState(true);

  const handleKeySubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.put(`/api/user/keycheck`, {
        keyInput,
      });
      console.log(response);
      setKeyInput("");
      {errorAlertToggle && setErrorAlertToggle(false);}
      setSuccessAlertToggle(true);
      setTimeout(() => dispatch({ type: "FETCH_USER" }), 3000);
    } catch (err) {
      if (err.response.status !== 400) {
        setErrorBadRequest(false);
      } else if (errorBadRequest !== true && err.response.status === 400) {
        setErrorBadRequest(true);
      }

      console.log("Error in submitting key", err);
      setErrorAlertToggle(true);
    }
  };

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#4CBB17",
      },
    },
  });

  const useStyles = makeStyles({
    keySubmitButton: {
      color: "white",
      marginLeft: ".5rem",
      marginTop: "1rem",
    },
  });

  const classes = useStyles();

  useEffect(() => {
    dispatch({ type: "FETCH_LINK_TOKEN", payload: user.access_token });
  }, []);

  console.log(successAlertToggle);

  return (
    <ThemeProvider theme={theme}>
      <div
        className="containter"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <br />
        {!user.plaid_key && (
          <div id="plaid-key-form">
            <h2>Do you have a Plaid Key?</h2>
            {errorAlertToggle && (
              <>
                <Alert
                  onClose={() => setErrorAlertToggle(false)}
                  severity="error"
                >
                  {errorBadRequest
                    ? "Invalid key, please try again."
                    : "There was an error in checking your key."}
                </Alert>
                <br />
              </>
            )}
            {successAlertToggle && (
              <>
                <Alert onClose={() => setSuccessAlertToggle(false)}>
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
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default FeedbackPage;
