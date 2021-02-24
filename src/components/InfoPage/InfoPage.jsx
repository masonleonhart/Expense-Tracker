import React from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

function InfoPage() {
  const dispatch = useDispatch();
  const currentDay = useSelector(store => store.expense.currentDayReducer);

  const handleClick = (incomingDay) => {
    dispatch({ type: 'SET_DAY', payload: incomingDay });
  };
  
  dispatch({ type: 'FETCH_DAILY_EXPENSES', payload: currentDay });

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <h1>{moment().add(currentDay, 'days').format('MMMM')}</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <button onClick={() => dispatch({ type: 'DECREMENT_DAY' })}>Decrease Day</button>
        <h4 onClick={() => handleClick(-2)}>{moment().add(currentDay - 2, 'days').format('DD')}</h4>
        <h4 onClick={() => handleClick(-1)}>{moment().add(currentDay - 1, 'days').format('DD')}</h4>
        <h2 onClick={() => handleClick(0)}>{moment().add(currentDay, 'days').format('DD')}</h2>
        <h4 onClick={() => handleClick(1)}>{moment().add(currentDay + 1, 'days').format('DD')}</h4>
        <h4 onClick={() => handleClick(2)}>{moment().add(currentDay + 2, 'days').format('DD')}</h4>
        <button onClick={() => dispatch({ type: 'INCREMENT_DAY' })}>Add Day</button>
      </div>
      <br />
      <br />
      <br />
      <table id='expense-table' style={{margin: 'auto'}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Category</th>
          </tr>
        </thead>
        {/* <tbody>
          {expense.expenseReducer.map(expense => <tr key={expense.id}>
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
          </tr>)}
        </tbody> */}
      </table>
    </div>
  );
};

export default InfoPage;
