import React, { useEffect, useState } from 'react';
import ExpenseService from '../service/ExpenseService';

const MainList = () => {

    const [thisMBalance, setThisMBalance] = useState(0);
    const [allExpensesList, setAllExpensesList] = useState([]);

    // fetch the balance from this month when site is loading
    useEffect(() => {
        getBalance();
        getAllExpenses();
    }, []);

    // get the balance from this month
    const getBalance = () => {
        ExpenseService.getThisMonthBalance().then(res => {
            setThisMBalance(res.data);
        }).catch(err => {
            console.error("Error fetching balance: ", err);
        });
    };

    // get all expenses
    const getAllExpenses = () => {
        ExpenseService.getAllExpenses().then((res) => {
            setAllExpensesList(res.data);
            console.log(allExpensesList);
        }).catch((err) => {
            console.error("Error fetching all expenses: ", err);
        });
    };

    // convert month number to month name
    const getMonthName = (month) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[month - 1];
    };

    // group expenses by month and day
    const groupExpensesByMonthAndDay = () => {
        const groupedExpenses = {};
        allExpensesList.forEach(expense => {
            const expenseDate = new Date(expense.expenseDate);
            const month = getMonthName(expenseDate.getMonth() + 1); // Adding 1 to get the correct month index
            const day = expenseDate.getDate(); // Get day number
            if (!groupedExpenses[month]) {
                groupedExpenses[month] = {
                    totalValue: 0,
                    days: {}
                };
            }
            if (!groupedExpenses[month].days[day]) {
                groupedExpenses[month].days[day] = [];
            }
            groupedExpenses[month].days[day].push(expense);
            groupedExpenses[month].totalValue += expense.expenseValue;
        });
        return groupedExpenses;
    };

    // expenses grouped by month and day
    const renderExpensesByMonthAndDay = () => {
        const groupedExpenses = groupExpensesByMonthAndDay();
        return Object.entries(groupedExpenses).map(([month, data]) => (
            <div key={month}>
                <h2 className='month-name'>{month} </h2>
                <h3 className='month-value'>{data.totalValue}</h3>
                {Object.entries(data.days)
                    .sort(([a], [b]) => b - a) // Sort the days in descending order
                    .map(([day, expenses]) => (
                        <div key={day}>
                            <h3>{day}</h3>
                            <table>
                                <tbody>
                                    {expenses.map(exp => (
                                        <tr key={exp.id}>
                                            {/* <td>{exp.expenseDate}</td> */}
                                            <td>{exp.expenseValue}</td>
                                            <td>{exp.description}</td>
                                            <td>{exp.expenseType}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                }
            </div>
        ));
    };



  return (
    <>
        <div className='container'>

            <h2 className='title'>Expense Tracker</h2>

            <div className='panel left-panel controls'>
                {/* <p>ajdfssssssssssssssssssssssssssssssssssk</p> */}
            </div>

            <div className='panel right-panel content'>

                <div className="balance">
                    <h1 className='this-month-balance'>{thisMBalance}</h1>
                </div>

                <div className='new-expense'>
                    <form>

                    </form>
                </div>

                <div className="expense-list">
                    {renderExpensesByMonthAndDay()}
                </div>
            </div>
        </div>
    </>
  )
}

export default MainList