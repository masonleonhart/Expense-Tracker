import Calendar from 'react-calendar';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import 'react-calendar/dist/Calendar.css';

function MonthPage() {
    const dispatch = useDispatch();
    const currentMonth = useSelector(store => store.expense.currentMonthReducer);

    useEffect(() => {
        dispatch({ type: 'FETCH_MONTHLY_EXPENSES', payload: { incomingDay: 0, currentMonth } });
    }, []);

    return (
        <div className='container' style={{ display: 'flex', justifyContent: 'center' }}>
            <Calendar
                calendarType='US'
                // tileContent={({date}) => console.log(moment(date).format('YYYY-MM-DD'))}
                nextLabel={<p onClick={() => console.log('click')}>›</p>}
                
            >
            </Calendar>
        </div>
    );
};

export default MonthPage;