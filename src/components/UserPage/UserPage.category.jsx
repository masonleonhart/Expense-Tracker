import { useSelector } from 'react-redux';

function UserPageCategory() {
    const category = useSelector(store => store.category);

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
                    {category.categoryReducer.map(category =>
                        <tr key={category.id}>
                            <td><p>{category.name}</p></td>
                            <td><p>${category.sum}</p></td>
                            <td><button>Delete Category</button></td>
                        </tr>
                    )}

                </tbody>
            </table >
        </>
    );
};

export default UserPageCategory;