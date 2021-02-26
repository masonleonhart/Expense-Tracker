import Calendar from 'react-calendar';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import 'react-calendar/dist/Calendar.css';
import './MonthPage.css'

function MonthPage() {
    const dispatch = useDispatch();
    const currentMonth = useSelector(store => store.expense.currentMonthReducer);
    const expense = useSelector(store => store.expense);

    const toCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const renderSum = ({ date }) => {
        for (const transaction of expense.dailySumsReducer) {
            if (moment(date).format('YYYY-MM-DD') === moment(transaction.date).format('YYYY-MM-DD')) {
                return (
                    <p style={{ margin: '0' }} className={transaction.sum.includes('-') ? 'daily-sum-income' : 'daily-sum-expense'}>{toCurrency.format(Number(transaction.sum) < 0 ? (Number(transaction.sum) * -1) : Number(transaction.sum))}</p>
                );
            };
        };
    };

    const handleClick = (incomingMonth) => {
        if ((currentMonth === 0 && incomingMonth !== -1)) {
            return;
        } else {
            dispatch({ type: 'FETCH_DAILY_SUMS', payload: { incomingMonth, currentMonth: currentMonth + incomingMonth } });
        };
    };

    useEffect(() => {
        dispatch({ type: 'FETCH_DAILY_SUMS', payload: { incomingMonth: 0, currentMonth } })
        dispatch({ type: 'FETCH_MONTHLY_EXPENSES', payload: { incomingMonth: 0, currentMonth } });
    }, []);

    return (
        <div className='container' style={{ display: 'flex', justifyContent: 'center' }}>
            <Calendar
                calendarType='US'
                tileContent={renderSum}
                minDetail='month'
                nextLabel={<p className='nav-tile' onClick={() => handleClick(1)}>›</p>}
                prevLabel={<p className='nav-tile' onClick={({date}) => handleClick(-1, date)}>‹</p>}
                tileClassName='calendar-tile'
                showNeighboringMonth={false}
                maxDate={new Date(moment().endOf('month').format('YYYY-MM-DD'))}
            >
            </Calendar>
        </div>
    );
};

export default MonthPage;