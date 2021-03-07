import Calendar from 'react-calendar';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Paper } from '@material-ui/core';

import MaterialTable from 'material-table';
import tableIcons from '../../hooks/materialTableIcons';

import 'react-calendar/dist/Calendar.css';
import './MonthPage.css'

function MonthPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const currentMonth = useSelector(store => store.expense.currentMonthReducer); // Accesses the current month that is stored inside of the expense reducer
    const expense = useSelector(store => store.expense); // Acccess the expense store
    const category = useSelector(store => store.category);  // Access the category store

    const toCurrency = new Intl.NumberFormat('en-US', {
        // Converts a number to US currency format

        style: 'currency',
        currency: 'USD',
    });

    const renderSum = ({ date }) => {
        // Renders a sum to display on the calendar day, if a negative sum, remove the negative and give the income class to highlight green
        // If the sum is positive, give the expense class to highlight red

        for (const transaction of expense.dailySumsReducer) {
            if (moment(date).format('YYYY-MM-DD') === moment(transaction.date).format('YYYY-MM-DD')) {
                return (
                    <p style={{ margin: '0' }} className={transaction.sum.includes('-') ? 'daily-sum-income' : 'daily-sum-expense'}>{toCurrency.format(Number(transaction.sum) < 0 ? (Number(transaction.sum) * -1) : Number(transaction.sum))}</p>
                );
            };
        };
    };

    const handleClick = (incomingMonth) => {
        // Fetches daily sums to display on calendar, monthly expenses, and monthly categories. If the current month is the month
        // that we are in and you are trying to advance a month, return out of the function

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
            <br />
            <Paper style={{ maxWidth: 'fit-content', margin: 'auto' }}>
                <br />
                <Calendar
                    calendarType='US'
                    tileContent={renderSum}
                    minDetail='month'
                    nextLabel={<p className='nav-tile' onClick={() => handleClick(1)}>›</p>}
                    prevLabel={<p className='nav-tile' onClick={({ date }) => handleClick(-1, date)}>‹</p>}
                    tileClassName='calendar-tile'
                    showNeighboringMonth={false}
                    maxDate={new Date(moment().endOf('month').add(1, 'day').format('YYYY-MM-DD'))}
                    defaultActiveStartDate={new Date(
                        (Number(moment().add(currentMonth, 'months').format('YYYY'))),
                        (Number(moment().add(currentMonth, 'months').format('MM'))) - 1,
                        (Number(moment().add(currentMonth, 'months').format('DD'))),
                    )}
                    onClickDay={(value) => {
                        // Allows a user to click a calendar day to navigate to the day page of the day that was clicked

                        let clickedDay = moment(value).startOf('day');
                        let currentDay = moment().startOf('day');
                        let difference = clickedDay.diff(currentDay, 'days')

                        dispatch({ type: 'GO_TO_DAY', payload: difference });
                        history.push('/day');
                    }}
                >
                </Calendar>
                <br />
            </Paper>
            <br />
            <br />
            <div id='month-tables-wrapper'>
                <div id='month-categories-table'>
                    <MaterialTable
                        title='Categories'
                        icons={tableIcons}
                        columns={[
                            { title: 'Name', field: 'name' },
                            {
                                title: 'Necessity', render: (rowData) => {
                                    return (
                                        <>
                                            {rowData.necessity ? <p>Yes</p> : <p>No</p>}
                                        </>
                                    );
                                }
                            },
                            { title: 'Total Spent', field: 'sum', type: 'currency' }
                        ]}
                        data={category.monthlyCategoryReducer}
                    />
                </div>
                <br />
                <br />
                <div id='month-transactions-table'>
                    <MaterialTable
                        title='Transactions'
                        icons={tableIcons}
                        columns={[
                            { title: 'Name', field: 'name' },
                            {
                                title: 'Date', render: (rowData) => {
                                    return (
                                        <>
                                            {moment(rowData.date).format('MM-DD-YYYY')}
                                        </>
                                    );
                                }
                            },
                            { title: 'Category', field: 'category_name' },
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
                        data={expense.monthlyExpenseReducer}
                    />

                </div>
            </div>
        </div>
    );
};

export default MonthPage;