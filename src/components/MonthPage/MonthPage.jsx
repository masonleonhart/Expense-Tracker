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
    const category = useSelector(store => store.category);

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
            dispatch({ type: 'FETCH_MONTHLY_EXPENSES', payload: currentMonth + incomingMonth });
            dispatch({ type: 'FETCH_MONTHLY_CATEGORIES', payload: currentMonth + incomingMonth });
        };
    };

    useEffect(() => {
        dispatch({ type: 'FETCH_DAILY_SUMS', payload: { incomingMonth: 0, currentMonth } })
        dispatch({ type: 'FETCH_MONTHLY_EXPENSES', payload: currentMonth });
        dispatch({ type: 'FETCH_MONTHLY_CATEGORIES', payload: currentMonth });
    }, []);

    return (
        <div className='container'>
            <Calendar
                calendarType='US'
                tileContent={renderSum}
                minDetail='month'
                nextLabel={<p className='nav-tile' onClick={() => handleClick(1)}>›</p>}
                prevLabel={<p className='nav-tile' onClick={({ date }) => handleClick(-1, date)}>‹</p>}
                tileClassName='calendar-tile'
                showNeighboringMonth={false}
                maxDate={new Date(moment().endOf('month').format('YYYY-MM-DD'))}
                defaultActiveStartDate={new Date(
                    (Number(moment().add(currentMonth, 'months').format('YYYY'))),
                    (Number(moment().add(currentMonth, 'months').format('MM'))) - 1,
                    (Number(moment().add(currentMonth, 'months').format('DD'))),
                )}
            >
            </Calendar>
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
                    {category.monthlyCategoryReducer.map(category =>
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
                    {expense.monthlyExpenseReducer.map(expense => <tr key={expense.id}>
                        <td>{expense.name}</td>
                        <td className={expense.income ? 'income-amount' : 'expense-amount'}>{toCurrency.format(Number(expense.amount) < 0 ? (Number(expense.amount) * -1) : Number(expense.amount))}</td>
                        <td>{moment(expense.date).format('YYYY-MM-DD')}</td>
                        <td>{expense.category_name}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    );
};

export default MonthPage;