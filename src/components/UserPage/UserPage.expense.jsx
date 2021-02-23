import { useSelector } from 'react-redux';

function UserPageExpense() {
    const expenses = useSelector(store => store.expense.expenseReducer);

    return (
        <>
            <h2>Expenses</h2>
            <table id='expense-table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th><button>Add Expense</button></th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map(expense => <tr key={expense.id}>
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