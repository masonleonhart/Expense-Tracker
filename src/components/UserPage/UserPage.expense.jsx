import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

function UserPageExpense() {
    const expense = useSelector(store => store.expense);
    const dispatch = useDispatch();

    let [toggleExpenseAddForm, setToggleAddForm] = useState(false);

    const handleExpenseSubmit = e => {
        e.preventDefault();
        dispatch({ type: 'ADD_NEW_EXPENSE', payload: expense.newExpenseReducer });
    };

    return (
        <>
            {toggleExpenseAddForm &&
                <>
                    <form onSubmit={handleExpenseSubmit} onReset={() => setToggleAddForm(false)}>
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
            <table id='expense-table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th><button onClick={() => !toggleAddForm ? setToggleAddForm(true) : setToggleAddForm(false)}>Add Expense</button></th>
                    </tr>
                </thead>
                <tbody>
                    {expense.expenseReducer.map(expense => <tr key={expense.id}>
                        <td>{expense.name}</td>
                        <td>${expense.amount}</td>
                        <td>{expense.date}</td>
                        <td>{expense.category_id}</td>
                        <td><button>Delete Expense</button></td>
                    </tr>)}
                </tbody>
            </table>
        </>
    );
};

export default UserPageExpense;