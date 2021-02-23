import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './UserPage.css'

function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);
  const category = useSelector(store => store.category);

  useEffect(() => {
    dispatch({ type: 'FETCH_CATEGORIES' });
  }, []);

  return (
    <div className="container">
      <h2>Categories</h2>
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
              <td><p>{category.name}</p></td>
              <td><p>${category.sum}</p></td>
              <td><button>Delete Category</button></td>
            </tr>
          )}

        </tbody>
      </table >
      <br />
      <br />
      <h2>Expenses</h2>
      <table id='expense-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Category</th>
            <th>Add Expense</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
