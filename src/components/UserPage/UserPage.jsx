import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import UserPageCategory from './UserPage.category';
import UserPageExpense from './UserPage.expense';

import './UserPage.css'

function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'FETCH_CATEGORIES' });
    dispatch({ type: 'FETCH_EXPENSES' });
  }, []);

  return (
    <div className="container">
      <UserPageCategory />
      <br />
      <br />
      <UserPageExpense />
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
