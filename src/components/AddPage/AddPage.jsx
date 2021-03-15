import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import "./AddPage.css";
import {
  TextField,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Button,
  MenuItem,
  makeStyles,
  InputLabel,
  Select,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

function AddPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const category = useSelector((store) => store.category);
  const expense = useSelector((store) => store.expense);

  const handleCategorySubmit = (e) => {
    // Function to handle the submit of adding a new category, prevent page reload, add new category to database,
    // and set the view of the form to false

    e.preventDefault();
    dispatch({
      type: "ADD_NEW_CATEGORY",
      payload: category.newCategoryReducer,
    });
    history.push("/user");
  };

  const handleExpenseSubmit = (e) => {
    // Function to handle the submit of adding a new expense, prevent page reload, add new expense to database,
    // and set the view of the form to false

    e.preventDefault();
    dispatch({ type: "ADD_NEW_EXPENSE", payload: expense.newExpenseReducer });
    history.push("/user");
  };

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#4CBB17",
      },
    },
  });

  const useStyles = makeStyles({
    button: {
      color: "white",
      margin: "auto",
    },
    selectOutlinedFormControl: {
      minWidth: 170,
    },
  });

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className="container">
        <br />
        <div style={{ margin: "auto", width: "fit-content" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              dispatch({ type: "RESET_NEW_CATEGORY_REDUCER" });
              dispatch({ type: "RESET_NEW_EXPENSE_REDUCER" });
              history.push("/user");
            }}
          >
            Cancel
          </Button>
          <br />
          <br />
        </div>
        <div id="forms-wrapper">
          <div>
            <h2>Add a Category</h2>
            <br />
            <form onSubmit={handleCategorySubmit}>
              <TextField
                required
                label="Category Name"
                variant="outlined"
                value={category.newCategoryReducer.name}
                onChange={(e) =>
                  dispatch({
                    type: "SET_NEW_CATEGORY_NAME",
                    payload: e.target.value,
                  })
                }
              />
              <br />
              <br />
              <br />
              <FormControl>
                <FormLabel>Necessity?</FormLabel>
                <RadioGroup row value={category.newCategoryReducer.necessity}>
                  <FormControlLabel
                    value={false}
                    onChange={(e) => {
                      dispatch({
                        type: "SET_NEW_CATEGORY_NECESSITY_FALSE",
                      });
                    }}
                    label="No"
                    labelPlacement="top"
                    control={<Radio color="primary" />}
                  ></FormControlLabel>
                  <FormControlLabel
                    value={true}
                    onChange={(e) => {
                      dispatch({ type: "SET_NEW_CATEGORY_NECESSITY_TRUE" });
                    }}
                    label="Yes"
                    labelPlacement="top"
                    control={<Radio color="primary" />}
                  ></FormControlLabel>
                </RadioGroup>
              </FormControl>
              <br />
              <br />
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                type="submit"
              >
                Add Category
              </Button>
            </form>
            <br />
          </div>
          <div>
            <h2>Add a Transaction</h2>
            <br />
            <form onSubmit={handleExpenseSubmit}>
              <FormControl>
                <FormLabel>Type of Transaction</FormLabel>
                <RadioGroup row value={expense.newExpenseReducer.income}>
                  <FormControlLabel
                    value={false}
                    onChange={(e) => {
                      dispatch({ type: "SET_NEW_EXPENSE_INCOME_FALSE" });
                    }}
                    label="Expense"
                    labelPlacement="top"
                    control={<Radio color="primary" />}
                  ></FormControlLabel>
                  <FormControlLabel
                    value={true}
                    onChange={(e) => {
                      dispatch({
                        type: "SET_NEW_EXPENSE_CATEGORY",
                        payload: "",
                      });
                      dispatch({ type: "SET_NEW_EXPENSE_INCOME_TRUE" });
                    }}
                    label="Income"
                    labelPlacement="top"
                    control={<Radio color="primary" />}
                  ></FormControlLabel>
                </RadioGroup>
              </FormControl>
              <br />
              <br />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  required
                  disableToolbar
                  disableFuture
                  variant="inline"
                  format="yyyy-MM-dd"
                  label="Transaction Date"
                  value={moment(expense.newExpenseReducer.date)}
                  onChange={(date) =>
                    dispatch({
                      type: "SET_NEW_EXPENSE_DATE",
                      payload: moment(date).format("YYYY-MM-DD"),
                    })
                  }
                />
              </MuiPickersUtilsProvider>
              <br />
              <br />
              {!expense.newExpenseReducer.income && (
                <>
                  <FormControl
                    variant="outlined"
                    className={classes.selectOutlinedFormControl}
                  >
                    <InputLabel id="add-expense-label">
                      Select a Category
                    </InputLabel>
                    <Select
                      labelId="add-expense-label"
                      label="Select a Category"
                      value={expense.newExpenseReducer.category_id}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_NEW_EXPENSE_CATEGORY",
                          payload: e.target.value,
                        })
                      }
                    >
                      {category.categoryReducer.map((category) => (
                        <MenuItem value={category.id} key={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <br />
                  <br />
                </>
              )}
              <TextField
                required
                label="Transaction Name"
                variant="outlined"
                value={expense.newExpenseReducer.name}
                onChange={(e) =>
                  dispatch({
                    type: "SET_NEW_EXPENSE_NAME",
                    payload: e.target.value,
                  })
                }
              />
              <br />
              <br />
              <TextField
                required
                type="number"
                label="Transaction Amount"
                variant="outlined"
                value={expense.newExpenseReducer.amount}
                onChange={(e) =>
                  dispatch({
                    type: "SET_NEW_EXPENSE_AMOUNT",
                    payload: e.target.value,
                  })
                }
              />
              <br />
              <br />
              <div id="add-submit-button">
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  type="submit"
                >
                  Add Transaction
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default AddPage;
