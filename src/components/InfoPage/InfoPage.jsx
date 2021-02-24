import React from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

function InfoPage() {
  const dispatch = useDispatch();
  const currentDay = useSelector(store => store.expense.currentDayReducer);

  const handleClick = (incomingDay) => {
    dispatch({ type: 'SET_DAY', payload: incomingDay });
  };

  console.log(currentDay)

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center' }}>{moment().add(currentDay, 'days').format('MMMM')}</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <button onClick={() => dispatch({ type: 'DECREMENT_DAY' })}>Decrease Day</button>
        <h4 onClick={() => handleClick(-2)}>{moment().add(currentDay - 2, 'days').format('DD')}</h4>
        <h4 onClick={() => handleClick(-1)}>{moment().add(currentDay - 1, 'days').format('DD')}</h4>
        <h2 onClick={() => handleClick(0)}>{moment().add(currentDay, 'days').format('DD')}</h2>
        <h4 onClick={() => handleClick(1)}>{moment().add(currentDay + 1, 'days').format('DD')}</h4>
        <h4 onClick={() => handleClick(2)}>{moment().add(currentDay + 2, 'days').format('DD')}</h4>
        <button onClick={() => dispatch({ type: 'INCREMENT_DAY' })}>Add Day</button>
      </div>
    </div>
  );
};

export default InfoPage;
