import { useSelector } from 'react-redux';

function UserPageExpense() {
    const Expense = useSelector(store => store.Expense);

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
                        <th>Add Expense</th>
                    </tr>
                </thead>
            </table>
        </>
    );
};

export default UserPageExpense;