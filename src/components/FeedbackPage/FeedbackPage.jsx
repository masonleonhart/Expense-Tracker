import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import "./FeedbackPage.css";

import { Button, TextField, makeStyles, Paper } from "@material-ui/core";

import { Alert } from "@material-ui/lab";

import CategorizePic from "../../Assets/CategorizePic.png";
import DetailsPic from "../../Assets/DetailsPic.png";
import AddTransPic from "../../Assets/AddTransPic.png";
import CalendarDay from "../../Assets/CalendarDay.png";
import NavbarPic from "../../Assets/NavbarPic.png";
import DayNavPic from "../../Assets/DayNavPic.png";

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
      {
        feedbackErrorAlertToggle && setFeedbackErrorAlertToggle(false);
      }
      setFeedbackSuccessAlertToggle(true);
    } catch (error) {
      console.log("Error in submitting feedback", error);
      setFeedbackErrorAlertToggle(true);
    }
  };

  const useStyles = makeStyles({
    keySubmitButton: {
      color: "white",
    },
    feedbackSubmitButton: {
      color: "white",
    },
    feedbackTextField: {
      width: "15rem",
    },
    paper: {
      padding: "2rem",
      width: "91%",
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
  });

  const classes = useStyles();

  useEffect(() => {
    dispatch({ type: "FETCH_LINK_TOKEN", payload: user.access_token });
  }, []);

  return (
    <div className="container">
      <Paper className={classes.paper}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <div
            id="plaid-key-form"
            style={{ display: user.plaid_key && "none" }}
          >
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
              <br />
              <br />
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
          <div>
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
                variant="outlined"
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
        </div>
        <br />
        <h1>How to use Melt</h1>
        <br />
        <div className="tutorial-section">
          <img src={NavbarPic} style={{ width: "27rem" }} />
          <p>
            Melt is divided into three sections, "Overview" or "Home",
            "Monthly", and a "Daily" section. Each section allows you to see how
            you spend your money differently in different categories and over
            different periods of time.
          </p>
        </div>
        <br />
        <div className="tutorial-section reverse">
          <p>
            Click on the plus in either the "Uncategorized Transactions" or the
            "Categories" tables on the Home Page to add transactions or income
            and categories to Melt.
          </p>
          <img src={AddTransPic} style={{ width: "10rem" }} />
        </div>
        <br />
        <div className="tutorial-section">
          <img src={CategorizePic} style={{ width: "15rem" }} />
          <p>
            Use the "Select a Category" dropdown on the Uncategorized Expenses
            table to assign your expenses to categoreies (income by defualt is
            uncategorized and doesn't appear in the Uncategorized Expenses
            table).
          </p>
        </div>
        <br />
        <div className="tutorial-section reverse">
          <p>
            Click on the three stacked dots in the Categories table on the Home
            Page to see how many expenses you've added to that category.
          </p>
          <img src={DetailsPic} style={{ width: "10rem" }} />
        </div>
        <div className="tutorial-section">
          <img src={CalendarDay} style={{ width: "15rem" }} />
          <p>
            The calendar on the Month section shows your daily net-income for
            each day on the calendar, a table of categories that you have
            transactions in for that month, and a list of all of your
            transactions for that month (expenses and incomes). The Daily
            section has the same tables, but over that day.
          </p>
        </div>
        <br />
        <div className="tutorial-section reverse">
          <p>
            Navigate to Mint's Day section by clicking the navigation button in
            the header, or by clicking on a specific day on the calendar in the
            Month section. Navigate throughout the different days by clicking
            the dates in the Day section, and head back to the Month section by
            clicking the month on the top of the Day navigation.
          </p>
          <img src={DayNavPic} style={{ width: "26rem" }} />
        </div>
      </Paper>
    </div>
  );
}

export default FeedbackPage;
