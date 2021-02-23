import { useSelector } from 'react-redux';

function UserPageCategory() {
    const categories = useSelector(store => store.category.categoryReducer);

    return (
        <>
            <h2>Categories</h2>
            <table id='category-table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Total Spent in Category</th>
                        <th><button>Add Category</button></th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category =>
                        <tr key={category.id}>
                            <td>{category.name}</td>
                            <td>${category.sum}</td>
                            <td><button>Delete Category</button></td>
                        </tr>)}
                </tbody>
            </table >
        </>
    );
};

export default UserPageCategory;