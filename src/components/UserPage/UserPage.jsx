import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlaidLink } from 'react-plaid-link';
import axios from 'axios';
import moment from 'moment';

import { Modal } from '@material-ui/core'

import './UserPage.css'

function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
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
    try {
      await axios.post('/api/plaid/exchange_token', { public_token });
      setTimeout(() => dispatch({ type: 'FETCH_USER' }), 3000);
    } catch (error) {
      console.log('Error in exchanging tokens', error);
    };
  });

  const toCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const handleCategorySubmit = e => {
    e.preventDefault();
    dispatch({ type: 'ADD_NEW_CATEGORY', payload: category.newCategoryReducer });
    setToggleCategoryAddForm(false);
  };

  const handleExpenseSubmit = e => {
    e.preventDefault();
    dispatch({ type: 'ADD_NEW_EXPENSE', payload: expense.newExpenseReducer });
    setToggleExpenseAddForm(false);
  };

  const handleIncomeSubmit = e => {
    e.preventDefault();
    dispatch({ type: 'ADD_NEW_INCOME', payload: expense.newIncomeReducer });
    setToggleIncomeAddForm(false);
  };

  const subRowClick = name => {
    dispatch({ type: 'FETCH_SUBCAT_TRANSACTIONS', payload: name });
    setToggleModal(true);
  };

  useEffect(() => {
    dispatch({ type: 'FETCH_LINK_TOKEN', payload: user.access_token });
    dispatch({ type: 'FETCH_CATEGORIES' });
    user.access_token ? dispatch({ type: 'FETCH_PLAID_TRANSACTIONS' }) : dispatch({ type: 'FETCH_UNCATEGORIZED' });
  }, []);

  return (
    <div className="container">
      {!user.access_token &&
        <PlaidLink
          token={plaid.linkToken}
          onSuccess={plaidLinkSuccess}
        >
          Connect to your Bank
      </PlaidLink>}
      {plaid.plaidError &&
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
        {expense.subcategoryExpenseReducer > 0 && <div style={{ backgroundColor: 'white', textAlign: 'center', height: '70%', overflowY: 'auto' }}>
          <h2>Expenses in {expense.subcategoryExpenseReducer[0].name}</h2>
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
        </div>}
      </Modal>
      <div style={{ display: 'flex' }}>
        <div>
          <h2>Categories</h2>
          {toggleCategoryAddForm &&
            <>
              <h3>Add a Category</h3>
              <form onSubmit={handleCategorySubmit} onReset={() => setToggleCategoryAddForm(false)}>
                <label htmlFor="category-name-input">Category Name</label>
                <br />
                <input type="text" id='category-name-input' value={category.newCategoryReducer.name} onChange={e => dispatch({ type: 'SET_NEW_CATEGORY_NAME', payload: e.target.value })} required />
                <br />
                <br />
                <button type='reset'>Cancel</button>
                <button type='submit'>Save</button>
              </form>
            </>
          }
          {category.categoryReducer.length > 0 &&
            <table id='category-table'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Total Spent in Category</th>
                  <th><button onClick={() => !toggleCategoryAddForm ? setToggleCategoryAddForm(true) : setToggleCategoryAddForm(false)}>Add Category</button></th>
                </tr>
              </thead>
              <tbody>
                {category.categoryReducer.map(category =>
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{toCurrency.format(category.coalesce)}</td>
                    <td><button onClick={() => dispatch({ type: 'DELETE_CATEGORY', payload: category.id })}>Delete Category</button></td>
                  </tr>)}
              </tbody>
            </table >
          }
        </div>
        <div>
          <h2>Subcategories</h2>
          {category.subcategoryReducer.length > 0 &&
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Transactions in subcategory</th>
                </tr>
              </thead>
              <tbody>
                {category.subcategoryReducer.map(subcategory => <tr onClick={() => subRowClick(subcategory.name)} key={subcategory.name}>
                  <td>{subcategory.name}</td>
                  <td>{subcategory.count}</td>
                </tr>)}
              </tbody>
            </table>
          }
        </div>
      </div>
      <h2>Uncategorized Transactions</h2>
      <div id='expense-container'>
        {category.categoryReducer.length > 0 && expense.uncategorizedExpenseReducer.length > 0 ?
          <table id='expense-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
                <th>
                  <button onClick={() => !toggleExpenseAddForm ? setToggleExpenseAddForm(true) : setToggleExpenseAddForm(false)}>Add Expense</button>
                  <button onClick={() => !toggleIncomeAddForm ? setToggleIncomeAddForm(true) : setToggleIncomeAddForm(false)}>Add Income</button>
                </th>
              </tr>
            </thead>
            <tbody>
              {expense.uncategorizedExpenseReducer.map(expense => <tr key={expense.id}>
                <td>{expense.name}</td>
                <td className={expense.income ? 'income-amount' : 'expense-amount'}>{toCurrency.format(Number(expense.amount) < 0 ? (Number(expense.amount) * -1) : Number(expense.amount))}</td>
                <td>{moment(expense.date).format('YYYY-MM-DD')}</td>
                <td>
                  {expense.category_id === null && expense.income === true ? <></>
                    : expense.category_id === null ?
                      <select onChange={e => dispatch({ type: 'UPDATE_EXPENSE_CATEGORY', payload: { expense_id: expense.id, category_id: e.target.value } })} id="category-select" >
                        <option value="0">Select a Category</option>
                        {category.categoryReducer.map(category => <option value={category.id} key={category.id}>{category.name}</option>)}
                      </select> : expense.category_name
                  }
                </td>
                <td>{!expense.transaction_id && <button onClick={() => dispatch({ type: 'DELETE_EXPENSE', payload: expense.id })} >Delete Item</button>}</td>
              </tr>)}
            </tbody>
          </table> : <></>}
        {toggleExpenseAddForm &&
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
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
