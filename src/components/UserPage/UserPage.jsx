import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlaidLink } from 'react-plaid-link';
import axios from 'axios';
import moment from 'moment';

import { Modal, Select, InputLabel, MenuItem, FormControl, makeStyles } from '@material-ui/core';

import MaterialTable from 'material-table';
import tableIcons from '../../hooks/materialTableIcons';

import './UserPage.css'

function UserPage() {
  const dispatch = useDispatch();
  const expense = useSelector(store => store.expense);
  const category = useSelector(store => store.category);
  const plaid = useSelector(store => store.plaid);
  const user = useSelector(store => store.user);

  const [toggleExpenseAddForm, setToggleExpenseAddForm] = useState(false);
  const [toggleIncomeAddForm, setToggleIncomeAddForm] = useState(false);
  const [toggleCategoryAddForm, setToggleCategoryAddForm] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);

  const plaidLinkSuccess = React.useCallback(async public_token => {
    // An on success function for the plaid link, when a successful link is created, wait 3 seconds and
    // fetch the user again so the access token appears in state

    try {
      await axios.post('/api/plaid/exchange_token', { public_token });
      setTimeout(() => dispatch({ type: 'FETCH_USER' }), 3000);
    } catch (error) {
      console.log('Error in exchanging tokens', error);
    };
  });

  const toCurrency = new Intl.NumberFormat('en-US', {
    // Converts a number to US currency format

    style: 'currency',
    currency: 'USD',
  });

  const handleCategorySubmit = e => {
    // Function to handle the submit of adding a new category, prevent page reload, add new category to database,
    // and set the view of the form to false

    e.preventDefault();
    dispatch({ type: 'ADD_NEW_CATEGORY', payload: category.newCategoryReducer });
    setToggleCategoryAddForm(false);
  };

  const handleExpenseSubmit = e => {
    // Function to handle the submit of adding a new expense, prevent page reload, add new expense to database,
    // and set the view of the form to false

    e.preventDefault();
    dispatch({ type: 'ADD_NEW_EXPENSE', payload: expense.newExpenseReducer });
    setToggleExpenseAddForm(false);
  };

  const handleIncomeSubmit = e => {
    // Function to handle the submit of adding a new income, prevent page reload, add new income to database,
    // and set the view of the form to false

    e.preventDefault();
    dispatch({ type: 'ADD_NEW_INCOME', payload: expense.newIncomeReducer });
    setToggleIncomeAddForm(false);
  };

  const subRowClick = name => {
    // When a user clicks a row inside of the subcategory table, fetch all of the transactions inside that subcat
    // and toggle the view of the modal to true

    dispatch({ type: 'FETCH_SUBCAT_TRANSACTIONS', payload: name });
    setToggleModal(true);
  };

  const useStyles = makeStyles({
    formControl: {
      minWidth: 150
    }
  });

  const classes = useStyles();

  useEffect(() => {
    dispatch({ type: 'FETCH_LINK_TOKEN', payload: user.access_token });
    dispatch({ type: 'FETCH_CATEGORIES' });
    dispatch({ type: 'FETCH_SUBCATEGORIES' });

    // If the user has an access token associated with their profile, fetch transactions using the plaid api,
    // else fetch transactions from the database
    user.access_token ? dispatch({ type: 'FETCH_PLAID_TRANSACTIONS' }) : dispatch({ type: 'FETCH_UNCATEGORIZED' });
  }, []);

  return (
    <div className="container">
      {!user.access_token &&
        // If the user does not have an access token, render the plaidLink button to connect thier bank account
        <PlaidLink
          token={plaid.linkToken}
          onSuccess={plaidLinkSuccess}
        >
          Connect to your Bank
      </PlaidLink>}
      {plaid.plaidError &&
        // If plaid threw an error when trying to connect, render a plaidlink for the user to refresh their credentials
        <>
          <p>There was an error with Plaid, please update your bank credentials.</p>
          <PlaidLink
            token={plaid.linkToken}
            onSuccess={(public_token, metadata) => setTimeout(() => { dispatch({ type: 'SET_PLAID_ERROR_FALSE' }); dispatch({ type: 'FETCH_USER' }) }, 3000)}
          >
            Update your credentials
          </PlaidLink>
        </>
      }
      <Modal
        style={{
          width: '50%',
          margin: 'auto',
          height: '100%',
          top: '20%'
        }}
        open={toggleModal}
        onClose={() => setToggleModal(false)}
      >
        <div style={{ backgroundColor: 'white', textAlign: 'center', height: '70%', overflowY: 'auto' }}>
          <h2>Expenses in {expense.subcatViewNameReducer}</h2>
          <br />
          <table style={{ margin: 'auto' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {expense.subcategoryExpenseReducer.map(subcategoryExpense => {
                // Maps over the array of subcategroy expenses and checks if it is a plaid transaction or not
                // If the transaction is from plaid, render a table row with the transaction data

                for (const expense of expense.uncategorizedExpenseReducer) {
                  if (expense.transaction_id === subcategoryExpense.transaction_id) {
                    return (
                      <tr key={expense.id}>
                        <td>{expense.name}</td>
                        <td className={expense.income ? 'income-amount' : 'expense-amount'}>{toCurrency.format(Number(expense.amount) < 0 ? (Number(expense.amount) * -1) : Number(expense.amount))}</td>
                        <td>{moment(expense.date).format('YYYY-MM-DD')}</td>
                      </tr>
                    );
                  };
                };
              })}
            </tbody>
          </table>
          <br />
          <br />
          <button onClick={() => setToggleModal(false)}>OK</button>
          <br />
          <br />
        </div>
      </Modal>
      <div style={{ display: 'flex' }}>
        <div className='overviewTables'>
          <h1>Categories</h1>
          {toggleCategoryAddForm &&
            // Checks state of the add category toggle to render the form or not
            <>
              <h3>Add a Category</h3>
              <form onSubmit={handleCategorySubmit} onReset={() => setToggleCategoryAddForm(false)}>
                <label htmlFor="category-name-input">Category Name</label>
                <br />
                <input type="text" id='category-name-input' value={category.newCategoryReducer.name} onChange={e => dispatch({ type: 'SET_NEW_CATEGORY_NAME', payload: e.target.value })} required />
                <br />
                <label htmlFor="necessity-false">Category of Necessities?</label>
                <br />
                <label htmlFor="necessity-false">No</label>
                <input type="radio" name="necessity" id="necessity-false"
                  checked={!category.newCategoryReducer.necessity}
                  onChange={e => { dispatch({ type: 'SET_NEW_CATEGORY_NECESSITY_FALSE' }) }}
                />
                <label htmlFor="necessity-true">Yes</label>
                <input type="radio" name="necessity" id="necessity-true"
                  checked={category.newCategoryReducer.necessity}
                  onChange={e => { dispatch({ type: 'SET_NEW_CATEGORY_NECESSITY_TRUE' }) }}
                />
                <br />
                <br />
                <button type='reset'>Cancel</button>
                <button type='submit'>Save</button>
              </form>
            </>
          }
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Total Spent in Category</th>
                <th><button onClick={() => !toggleCategoryAddForm ? setToggleCategoryAddForm(true) : setToggleCategoryAddForm(false)}>Add Category</button></th>
              </tr>
            </thead>
            {category.categoryReducer.length > 0 &&
              // If there is data in the category reducer, render the table body
              <tbody>
                {category.categoryReducer.map(category =>
                  // creates a table row for each item in the category reducer
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{toCurrency.format(category.coalesce)}</td>
                    <td><button onClick={() => dispatch({ type: 'DELETE_CATEGORY', payload: category.id })}>Delete Category</button></td>
                  </tr>)}
              </tbody>}
          </table >
        </div>
        <div className='overviewTables'>
          <h1>Subcategories</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Transactions in subcategory</th>
              </tr>
            </thead>
            {category.subcategoryReducer.length > 0 &&
              // If there is data in the subcategory reducer, render the table body
              <tbody>
                {category.subcategoryReducer.map(subcategory =>
                  // Creates a table row for each item in the subcategory reducer
                  <tr className='subcategory-row' onClick={() => subRowClick(subcategory.name)} key={subcategory.name}>
                    <td>{subcategory.name}</td>
                    <td>{subcategory.count}</td>
                  </tr>)}
              </tbody>}
          </table>
        </div>
      </div>
      <MaterialTable
        style={{ maxWidth: '80%', margin: 'auto' }}
        title='Uncategorized Expenses'
        icons={tableIcons}
        columns={[
          { title: 'Name', field: 'name' },
          {
            title: 'Date', render: (rowData) => {
              return (
                <>
                  {moment(rowData.date).format('YYYY-MM-DD')}
                </>
              );
            }
          },
          {
            title: 'Category', render: (rowData) => {
              return (
                <FormControl className={classes.formControl}>
                  <InputLabel id='select-label'>Select a Category</InputLabel>
                  <Select
                    labelId='select-label'
                    value={''}
                    onChange={e => dispatch({ type: 'UPDATE_EXPENSE_CATEGORY', payload: { expense_id: rowData.id, category_id: e.target.value } })}
                  >
                    {category.categoryReducer.map(category => <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>)}
                  </Select>
                </FormControl>
              )
            }
          },
          {
            title: 'Amount', type: 'currency', render: (rowData) => {
              return (
                <p className={rowData.income ? 'income-amount' : 'expense-amount'}>
                  {toCurrency.format(Number(rowData.amount) < 0 ?
                    (Number(rowData.amount) * -1) : Number(rowData.amount))}
                </p>
              );
            }
          },
        ]}
        data={expense.uncategorizedExpenseReducer}
      />
      {toggleExpenseAddForm &&
        // Checks the state of the add expense toggle to render a form or not
        <div>
          <h3>Add an Expense</h3>
          <form onSubmit={handleExpenseSubmit} onReset={() => setToggleExpenseAddForm(false)}>
            <label htmlFor="expense-category-select">Expense Category</label>
            <br />
            <select value={expense.newExpenseReducer.category_id} onChange={e => dispatch({ type: 'SET_NEW_EXPENSE_CATEGORY', payload: e.target.value })} id="expense-category-select" >
              <option value="0">Select a Category</option>
              {category.categoryReducer.map(category => <option value={category.id} key={category.id}>{category.name}</option>)}
            </select>
            <br />
            <label htmlFor="expense-name-input">Expense Name</label>
            <br />
            <input type="text" id='expense-name-input' value={expense.newExpenseReducer.name} onChange={e => dispatch({ type: 'SET_NEW_EXPENSE_NAME', payload: e.target.value })} required />
            <br />
            <label htmlFor="expense-amount-input">Expense Amount</label>
            <br />
            <input type="number" id="expense-amount-input" value={expense.newExpenseReducer.amount} onChange={e => dispatch({ type: 'SET_NEW_EXPENSE_AMOUNT', payload: e.target.value })} required />
            <br />
            <label htmlFor="expense-date-input">Expense Date</label>
            <br />
            <input type="date" id='expense-date-input' value={expense.newExpenseReducer.date} onChange={e => dispatch({ type: 'SET_NEW_EXPENSE_DATE', payload: e.target.value })} required />
            <br />
            <br />
            <button type='reset'>Cancel</button>
            <button type='submit'>Save</button>
          </form>
        </div>
      }
      {toggleIncomeAddForm &&
        // Checks the state of the add expense toggle to render a form or not
        <div>
          <h3>Add an Income</h3>
          <form onSubmit={handleIncomeSubmit} onReset={() => setToggleIncomeAddForm(false)}>
            <label htmlFor="income-name-input">Income Name</label>
            <br />
            <input type="text" id='income-name-input' value={expense.newIncomeReducer.name} onChange={e => dispatch({ type: 'SET_NEW_INCOME_NAME', payload: e.target.value })} required />
            <br />
            <label htmlFor="income-amount-input">Income Amount</label>
            <br />
            <input type="number" id="income-amount-input" value={expense.newIncomeReducer.amount} onChange={e => dispatch({ type: 'SET_NEW_INCOME_AMOUNT', payload: e.target.value })} required />
            <br />
            <label htmlFor="income-date-input">Income Date</label>
            <br />
            <input type="date" id='income-date-input' value={expense.newIncomeReducer.date} onChange={e => dispatch({ type: 'SET_NEW_INCOME_DATE', payload: e.target.value })} required />
            <br />
            <br />
            <button type='reset'>Cancel</button>
            <button type='submit'>Save</button>
          </form>
        </div>
      }
    </div>
  );
}

export default UserPage;
