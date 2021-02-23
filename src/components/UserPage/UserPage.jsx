import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './UserPage.css'

function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const dispatch = useDispatch();
  const expense = useSelector(store => store.expense);
  const category = useSelector(store => store.category);

  let [toggleExpenseAddForm, setToggleExpenseAddForm] = useState(false);

  const handleExpenseSubmit = e => {
    e.preventDefault();
    dispatch({ type: 'ADD_NEW_EXPENSE', payload: expense.newExpenseReducer });
    setToggleExpenseAddForm(false);
  };

  useEffect(() => {
    dispatch({ type: 'FETCH_CATEGORIES' });
    dispatch({ type: 'FETCH_EXPENSES' });
  }, []);

  return (
    <div className="container">
      <h2>Categories</h2>
      {category.categoryReducer.length > 0 &&
        <>
          <table id='category-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Total Spent in Category</th>
                <th><button>Add Category</button></th>
              </tr>
            </thead>
            <tbody>
              {category.categoryReducer.map(category =>
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>${category.sum}</td>
                  <td><button>Delete Category</button></td>
                </tr>)}
            </tbody>
          </table >
          <br />
          <br />
        </>}
      {toggleExpenseAddForm &&
        <>
          <form onSubmit={handleExpenseSubmit} onReset={() => setToggleExpenseAddForm(false)}>
            <label htmlFor="category-select">Transaction Category</label>
            <br />
            <select value={expense.newExpenseReducer.category_id} onChange={e => dispatch({ type: 'SET_NEW_EXPENSE_CATEGORY', payload: e.target.value })} id="category-select" >
              <option value="0">Select a Category</option>
              {category.categoryReducer.map(category => <option value={category.id} key={category.id}>{category.name}</option>)}
            </select>
            <br />
            <label htmlFor="name-input">Transaction Name</label>
            <br />
            <input type="text" id='name-input' value={expense.newExpenseReducer.name} onChange={e => dispatch({ type: 'SET_NEW_EXPENSE_NAME', payload: e.target.value })} required />
            <br />
            <label htmlFor="amount-input">Transaction Amount</label>
            <br />
            <input type="number" id="amount-input" value={expense.newExpenseReducer.amount} onChange={e => dispatch({ type: 'SET_NEW_EXPENSE_AMOUNT', payload: e.target.value })} required />
            <br />
            <label htmlFor="date-input">Transaction Date</label>
            <br />
            <input type="date" id='date-input' value={expense.newExpenseReducer.date} onChange={e => dispatch({ type: 'SET_NEW_EXPENSE_DATE', payload: e.target.value })} required />
            <br />
            <br />
            <button type='reset'>Cancel</button>
            <button type='submit'>Save</button>
          </form>
          <br />
          <br />
        </>
      }
      <h2>Expenses</h2>
      {expense.expenseReducer.length > 0 && category.categoryReducer.length > 0 ?
        <table id='expense-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
              <th><button onClick={() => !toggleExpenseAddForm ? setToggleExpenseAddForm(true) : setToggleExpenseAddForm(false)}>Add Expense</button></th>
            </tr>
          </thead>
          <tbody>
            {expense.expenseReducer.map(expense => <tr key={expense.id}>
              <td>{expense.name}</td>
              <td>${expense.amount}</td>
              <td>{expense.date}</td>
              <td>
                {expense.category_id === null ?
                  <select onChange={e => dispatch({ type: 'UPDATE_EXPENSE_CATEGORY', payload: { expense_id: expense.id, category_id: e.target.value } })} id="category-select" >
                    <option value="0">Select a Category</option>
                    {category.categoryReducer.map(category => <option value={category.id} key={category.id}>{category.name}</option>)}
                  </select> :
                  category.categoryReducer[expense.category_id - 1].name}
              </td>
              <td><button>Delete Expense</button></td>
            </tr>)}
          </tbody>
        </table> : <> </>}
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
