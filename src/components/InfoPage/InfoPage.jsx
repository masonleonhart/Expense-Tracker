import React, { useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './InfoPage.css';

function InfoPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentDay = useSelector(store => store.expense.currentDayReducer); // The current day that is stored in the ecpense reducer
  const expense = useSelector(store => store.expense); // Access the espense store
  const category = useSelector(store => store.category); // Access the category store

  const toCurrency = new Intl.NumberFormat('en-US', {
    // Converts a number to US currency format

    style: 'currency',
    currency: 'USD',
  });

  const handleClick = (incomingDay) => {
    // Fetches expenses and categories for the new day that the user is navigating to

    dispatch({ type: 'FETCH_DAILY_EXPENSES', payload: { incomingDay, currentDay: currentDay + incomingDay } });
    dispatch({ type: 'FETCH_DAILY_CATEGORIES', payload: currentDay + incomingDay });
  };

  useEffect(() => {
    // Fetches expenses and categories

    dispatch({ type: 'FETCH_DAILY_EXPENSES', payload: { incomingDay: 0, currentDay } });
    dispatch({ type: 'FETCH_DAILY_CATEGORIES', payload: currentDay });
  }, []);

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <h1 className='day-nav' onClick={() => {
        // Lets you navigate to the month page of the displayed month if the user clicks on the h1

        let clickedMonth = moment().add(currentDay, 'days').startOf('month');
        let currentMonth = moment().startOf('month');
        let difference = clickedMonth.diff(currentMonth, 'months')

        dispatch({ type: 'GO_TO_MONTH', payload: difference });
        history.push('/month');
      }}>{moment().add(currentDay, 'days').format('MMMM')}</h1>
      <br />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '50%' }}>
          <h1 className='day-nav' onClick={() => handleClick(-1)}>‹</h1>
          <h4 className='day-nav' onClick={() => handleClick(-2)}>{moment().add(currentDay - 2, 'days').format('DD')}</h4>
          <h4 className='day-nav' onClick={() => handleClick(-1)}>{moment().add(currentDay - 1, 'days').format('DD')}</h4>
          <h2 className='day-nav' onClick={() => handleClick(0)}>{moment().add(currentDay, 'days').format('DD')}</h2>
          <h4 className='day-nav' onClick={() => handleClick(1)}>{moment().add(currentDay + 1, 'days').format('DD')}</h4>
          <h4 className='day-nav' onClick={() => handleClick(2)}>{moment().add(currentDay + 2, 'days').format('DD')}</h4>
          <h1 className='day-nav' onClick={() => handleClick(1)}>›</h1>
        </div>
      </div>
      <br />
      <br />
      <br />
      <table style={{ margin: 'auto' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Total Spent in Category</th>
          </tr>
        </thead>
        <tbody>
          {category.dailyCategoryReducer.map(category =>
            // Creates a table row for each item inside the list of daily categoreis
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{toCurrency.format(category.sum)}</td>
            </tr>)}
        </tbody>
      </table >
      <br />
      <br />
      <table style={{ margin: 'auto' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {expense.dailyExpenseReducer.map(expense =>
            // Creates a table row for each item inside the list of daily expenses

            <tr key={expense.id}>
              <td>{expense.name}</td>
              {/* if a negative amount, remove the negative and give the income class to highlight green If the amount
              is positive, give the expense class to highlight red */}
              <td className={expense.income ? 'income-amount' : 'expense-amount'}>{toCurrency.format(Number(expense.amount) < 0 ? (Number(expense.amount) * -1) : Number(expense.amount))}</td>
              <td>{moment(expense.date).format('YYYY-MM-DD')}</td>
              <td>{expense.category_name}</td>
            </tr>)}
        </tbody>
      </table>
    </div>
  );
};

export default InfoPage;
