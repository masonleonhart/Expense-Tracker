import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import moment from "moment";

import {
  Button,
  Modal,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import MaterialTable from "material-table";
import tableIcons from "../../hooks/materialTableIcons";

import DeleteIcon from "@material-ui/icons/Delete";
import MoreVert from "@material-ui/icons/MoreVert";
import Add from "@material-ui/icons/Add";

import "./UserPage.css";

function UserPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const expense = useSelector((store) => store.expense);
  const category = useSelector((store) => store.category);
  const user = useSelector((store) => store.user);

  const [toggleSubcatExpenses, setToggleSubcatExpenses] = useState(false);
  const [toggleCatExpenses, setToggleCatExpenses] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);

  const toCurrency = new Intl.NumberFormat("en-US", {
    // Converts a number to US currency format

    style: "currency",
    currency: "USD",
  });

  const mainRowClick = (obj) => {
    // When a user clicks a row inside of the category table, fetch all of the transactions inside that cat
    // and toggle the view of the modal to true

    dispatch({ type: "FETCH_CAT_TRANSACTIONS", payload: obj });
    setToggleCatExpenses(true);
    setToggleModal(true);
  };

  const subRowClick = (name) => {
    // When a user clicks a row inside of the subcategory table, fetch all of the transactions inside that subcat
    // and toggle the view of the modal to true

    dispatch({ type: "FETCH_SUBCAT_TRANSACTIONS", payload: name });
    setToggleSubcatExpenses(true);
    setToggleModal(true);
  };

  const handleModalClose = () => {
    setToggleModal(false);
    setToggleCatExpenses(false);
    setToggleSubcatExpenses(false);
  };

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#4CBB17",
      },
    },
  });

  const useStyles = makeStyles({
    uncategorizedFormControl: {
      minWidth: 150,
    },
    categoriesButton: {
      minWidth: 10,
    },
    incomeAmount: {
      color: "green",
    },
    expenseAmount: {
      color: "red",
    },
    modalButton: {
      color: "white",
    },
  });

  const classes = useStyles();

  useEffect(() => {
    dispatch({ type: "FETCH_LINK_TOKEN", payload: user.access_token });
    dispatch({ type: "FETCH_CATEGORIES" });
    dispatch({ type: "FETCH_SUBCATEGORIES" });

    // If the user has an access token associated with their profile, fetch transactions using the plaid api,
    // else fetch transactions from the database
    user.access_token
      ? dispatch({ type: "FETCH_PLAID_TRANSACTIONS" })
      : dispatch({ type: "FETCH_UNCATEGORIZED" });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="container">
        <Modal
          style={{
            width: "40%",
            maxWidth: "60%",
            margin: "auto",
            height: "100%",
            top: "20%",
          }}
          className={classes.modal}
          disableAutoFocus={true}
          open={toggleModal}
          onClose={handleModalClose}
        >
          <div
            style={{
              backgroundColor: "white",
              textAlign: "center",
              height: "fit-content%",
              maxHeight: "80%",
              overflowY: "auto",
              borderRadius: "2%",
            }}
          >
            {toggleCatExpenses && (
              <>
                <h2>Expenses in {expense.catViewNameReducer}</h2>
                <br />
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {expense.categoryExpenseReducer.map((categoryExpense) => (
                        <TableRow key={categoryExpense.id}>
                          <TableCell>{categoryExpense.name}</TableCell>
                          <TableCell>
                            {moment(categoryExpense.date).format("MM-DD-YYYY")}
                          </TableCell>
                          <TableCell
                            className={
                              categoryExpense.income
                                ? classes.incomeAmount
                                : classes.expenseAmount
                            }
                          >
                            {toCurrency.format(
                              Number(categoryExpense.amount) < 0
                                ? Number(categoryExpense.amount) * -1
                                : Number(categoryExpense.amount)
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <br />
                <br />
                <Button
                  className={classes.modalButton}
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    setToggleCatExpenses(false);
                    setToggleModal(false);
                  }}
                >
                  OK
                </Button>
              </>
            )}
            {toggleSubcatExpenses && (
              <>
                <h2>Expenses in {expense.subcatViewNameReducer}</h2>
                <br />
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {expense.subcategoryExpenseReducer.map(
                        (subcategoryExpense) => {
                          // Maps over the array of subcategroy expenses and checks if it is a plaid transaction or not
                          // If the transaction is from plaid, render a table row with the transaction data

                          for (const expense of expense.uncategorizedExpenseReducer) {
                            if (
                              expense.transaction_id ===
                              subcategoryExpense.transaction_id
                            ) {
                              return (
                                <TableRow key={expense.id}>
                                  <TableCell>{expense.name}</TableCell>
                                  <TableCell>
                                    {moment(expense.date).format("MM-DD-YYYY")}
                                  </TableCell>
                                  <TableCell
                                    className={
                                      expense.income
                                        ? classes.incomeAmount
                                        : classes.expenseAmount
                                    }
                                  >
                                    {toCurrency.format(
                                      Number(expense.amount) < 0
                                        ? Number(expense.amount) * -1
                                        : Number(expense.amount)
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          }
                        }
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <br />
                <br />
                <Button
                  className={classes.modalButton}
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    setToggleSubcatExpenses(false);
                    setToggleModal(false);
                  }}
                >
                  OK
                </Button>
              </>
            )}
            <br />
            <br />
          </div>
        </Modal>
        <br />
        <div id="home-category-tables-wrapper">
          <div
            id="home-categories-table"
            className={!user.access_token ? "full-width" : ""}
          >
            <MaterialTable
              title="Categories"
              icons={tableIcons}
              columns={[
                { title: "Name", field: "name" },
                {
                  title: "Necessity",
                  sorting: false,
                  render: (rowData) => {
                    return <>{rowData.necessity ? <p>Yes</p> : <p>No</p>}</>;
                  },
                },
                {
                  title: "Expenses in Category",
                  sorting: false,
                  type: "numeric",
                  render: (rowData) => {
                    return <p>{rowData.count}</p>;
                  },
                },
              ]}
              actions={[
                {
                  tooltip: "Details",
                  icon: () => {
                    return <MoreVert />;
                  },
                  onClick: (event, rowData) => {
                    mainRowClick({ name: rowData.name, id: rowData.id });
                  },
                },
                {
                  tooltip: "Delete Category",
                  icon: () => {
                    return <DeleteIcon />;
                  },
                  onClick: (event, rowData) => {
                    dispatch({ type: "DELETE_CATEGORY", payload: rowData.id });
                  },
                },
                {
                  tooltip: "Add Category",
                  isFreeAction: true,
                  icon: () => {
                    return <Add />;
                  },
                  onClick: (event, rowData) => {
                    history.push("add");
                  },
                },
              ]}
              options={{
                actionsColumnIndex: -1,
              }}
              data={category.categoryReducer}
            />
          </div>
          <br />
          <br />
          <div
            id="home-subcategories-table"
            className={!user.access_token ? "display-none" : ""}
          >
            <MaterialTable
              title="Subcategories"
              icons={tableIcons}
              columns={[
                { title: "Name", field: "name" },
                {
                  title: "Expenses in Subcategory",
                  sorting: false,
                  type: "numeric",
                  render: (rowData) => {
                    return <p>{rowData.count}</p>;
                  },
                },
              ]}
              actions={[
                {
                  tooltip: "Details",
                  icon: () => {
                    return <MoreVert />;
                  },
                  onClick: (event, rowData) => {
                    subRowClick(rowData.name);
                  },
                },
              ]}
              options={{
                actionsColumnIndex: -1,
              }}
              data={category.subcategoryReducer}
            />
          </div>
        </div>
        <br />
        <MaterialTable
          style={{ maxWidth: "91%", margin: "auto" }}
          title="Uncategorized Expenses"
          icons={tableIcons}
          options={{
            pageSize: 10,
          }}
          columns={[
            { title: "Name", field: "name" },
            {
              title: "Date",
              render: (rowData) => {
                return <>{moment(rowData.date).format("MM-DD-YYYY")}</>;
              },
            },
            {
              title: "Category",
              render: (rowData) => {
                return (
                  <FormControl className={classes.uncategorizedFormControl}>
                    <InputLabel id="select-label">Select a Category</InputLabel>
                    <Select
                      labelId="select-label"
                      value={""}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_EXPENSE_CATEGORY",
                          payload: {
                            expense_id: rowData.id,
                            category_id: e.target.value,
                          },
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
                );
              },
            },
            {
              title: "Amount",
              type: "currency",
              render: (rowData) => {
                return (
                  <p
                    className={
                      rowData.income ? "income-amount" : "expense-amount"
                    }
                  >
                    {toCurrency.format(
                      Number(rowData.amount) < 0
                        ? Number(rowData.amount) * -1
                        : Number(rowData.amount)
                    )}
                  </p>
                );
              },
            },
          ]}
          actions={[
            {
              tooltip: "Add Transaction",
              isFreeAction: true,
              icon: () => {
                return <Add />;
              },
              onClick: (event, rowData) => {
                history.push("/add");
              },
            },
          ]}
          data={expense.uncategorizedExpenseReducer}
        />
      </div>
    </ThemeProvider>
  );
}

export default UserPage;
