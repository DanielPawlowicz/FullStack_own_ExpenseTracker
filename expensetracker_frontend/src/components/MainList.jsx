import React, { useEffect, useRef, useState } from 'react';
import ExpenseService from '../service/ExpenseService';
import { IconButton } from '@mui/material';
// icons
import DeleteIcon from '@mui/icons-material/Delete'; // delete
import EditNoteIcon from '@mui/icons-material/EditNote'; // edit
import CottageIcon from '@mui/icons-material/Cottage'; // housing
import BathtubIcon from '@mui/icons-material/Bathtub'; // utilities
import RestaurantIcon from '@mui/icons-material/Restaurant'; // food
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'; // transportation
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'; // health
import AccessibilityIcon from '@mui/icons-material/Accessibility'; // personal
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'; // entertainment
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'; // other

const MainList = () => {

    const [thisMBalance, setThisMBalance] = useState(0);
    const [allExpensesList, setAllExpensesList] = useState([]);
    const [editedExpense, setEditedExpense] = useState(null); // State to hold the edited expense details
    const formRef = useRef(null); // Ref for the form element
    const [exportMonth, setExportMonth] = useState(getCurrentMonthYear()); 

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

    // get the icon component based on the expense type
    const getExpenseIcon = (expenseType) => {
        switch (expenseType) {
            case 'HOUSING':
                return <CottageIcon />;
            case 'UTILITIES':
                return <BathtubIcon />;
            case 'FOOD':
                return <RestaurantIcon />;
            case 'TRANSPORTATION':
                return <DirectionsCarIcon />;
            case 'HEALTH':
                return <LocalHospitalIcon />;
            case 'PERSONAL':
                return <AccessibilityIcon />;
            case 'ENTERTAINMENT':
                return <SportsEsportsIcon />;
            case 'OTHER':
                return <MoreHorizIcon />;
            default:
                return <MoreHorizIcon />;
        }
    };

    // deleting expense
    const deleteExpense = async (id) => {
        try{
            ExpenseService.deleteExpense(id);
            getBalance();
            getAllExpenses();
            window.location.reload();
        } catch(err){
            console.error("Error deleting expense: " + err);
        }
    }

    //save expense
    const expenseSave = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const expenseValue = formData.get('expenseValue');
        const description = formData.get('description');
        const expenseDate = formData.get('expenseDate');
        const expenseType = formData.get('expenseType');
        console.log({expenseValue, description, expenseDate, expenseType});

        if (editedExpense) {
            // If an expense is being edited, call editExpense instead of saveExpense
            ExpenseService.editExpense(editedExpense.id, {expenseValue, description, expenseDate, expenseType})
                .then(() => {
                    console.log('Expense edited successfully');
                    showNotification(`Expense edited\nsuccessfully`);
                    setEditedExpense(null); // Reset editedExpense state
                    getBalance();
                    getAllExpenses();

                    if (formRef.current) {
                        formRef.current.reset();
                    }
                })
                .catch((error) => {
                    console.error('Error editing expense:', error);
                });
        } else {
            ExpenseService.saveExpense({expenseValue, description, expenseDate, expenseType})
                .then(() => {
                    console.log('Expense registered successfully');
                    showNotification(`Expense added\nsuccessfully`);
                    getBalance();
                    getAllExpenses();
                })
                .catch((error) => {
                    console.error('Error registering expense:', error);
                });
        }   
    }

    const editExpense = (expense) => {
        setEditedExpense(expense); // Set the expense to be edited
        // Populate form fields with the selected expense details
        document.getElementById('expenseValue').value = expense.expenseValue;
        document.getElementById('description').value = expense.description;
        document.getElementById('expenseDate').value = expense.expenseDate;
        document.getElementById('expenseType').value = expense.expenseType;
    };

    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');
    
        setTimeout(() => { notification.classList.remove('show'); }, 1500);
    }


// RENDER

    // expenses grouped by month and day
    const renderExpensesByMonthAndDay = () => {
        const groupedExpenses = groupExpensesByMonthAndDay();
        return Object.entries(groupedExpenses).map(([month, data]) => (
            <div key={month} className='month-container'>
                <h2 className='month-name'>{month} <span className='monthly-value'>{data.totalValue} <span className='zl'>zł</span></span></h2>
                {Object.entries(data.days)
                    .sort(([a], [b]) => b - a) // Sort the days in descending order
                    .map(([day, expenses]) => (
                        <div key={day} className='day-container'>
                            <h3 className='day-name'>{day}</h3>
                            <table>
                                <tbody>
                                    {expenses.map(exp => (
                                        <tr key={exp.id} className='single-expense'>
                                            <td className='e-value'><b>{exp.expenseValue} </b><span>zł</span></td>
                                            <td className='e-type'>{getExpenseIcon(exp.expenseType)}</td>
                                            <td className='e-descr'>{exp.description}</td>
                                            <td className='controls'>
                                                <IconButton className='icnbtn' onClick={() => editExpense(exp)}>
                                                    <EditNoteIcon className='icon' />
                                                </IconButton>
                                                
                                                <IconButton className='icnbtn'onClick={() => deleteExpense(exp.id)} >
                                                    <DeleteIcon className='icon'/>
                                                </IconButton>
                                                
                                            </td>
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


    function getCurrentMonthYear() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Ensure month is two digits
        return `${year}-${month}`; // Format: YYYY-MM
    }

    const handleExport = () => {
        const [year, month] = exportMonth.split('-'); // Split exportMonth into year and month
        ExpenseService.excelExport(year, month)
        .then(response => {
            // Create a blob from the response data
            const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
    
            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);
    
            // Create a link element to initiate the download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `expenses_${year}_${month}.xlsx`);
    
            // Append the link to the body and click it
            document.body.appendChild(link);
            link.click();
    
            // Clean up
            window.URL.revokeObjectURL(url);
          })

            .catch(error => {
                // Handle error
                console.error('Export error:', error);
            });
    };



  return (
    <>
        <div className='container'>
            <div className="heading">
                <div className='new-expense'>
                    {/* <p>New Expense</p> */}

                    <div id="notification" class="notification"></div>

                    <form ref={formRef} onSubmit={expenseSave}>
                        <label>Value: <input id="expenseValue" name="expenseValue" type='number' step='0.01'/></label>
                        <label>Description: <input id="description" name="description" type='text' /></label>
                        <label>Date: <input id="expenseDate" name="expenseDate" type='date'  defaultValue={new Date().toISOString().split('T')[0]} /></label>
                        <label>Type: <select id="expenseType" name="expenseType">
                                <option value="PERSONAL">Personal</option>
                                <option value="FOOD">Food</option>
                                <option value="HOUSING">Housing</option>
                                <option value="TRANSPORTATION">Transport</option>
                                <option value="HEALTH">Health</option>
                                <option value="UTILITIES">Utilities</option>
                                <option value="ENTERTAINMENT">Entertainment</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </label>
                        <button className={editedExpense ? 'submit edit' : 'submit'}>{editedExpense ? 'Save Changes' : 'Add'}</button>
                    </form>
                </div>

                <h3 className='title'>This month expenses</h3>
                <h1 className='this-month-balance'>{thisMBalance} <span>zł</span></h1>

            </div>
            <div className="inside-container">

                <div className='panel left-panel controls'>
                    <form >
                        <h3>Excel Export</h3>
                        <label>Month: <input type="month" id="exportMonth" name="exportMonth" value={exportMonth} onChange={(e) => setExportMonth(e.target.value)}/></label>
                        <br/>
                        <button className='export' type="button" onClick={handleExport}>Export</button>
                    </form>
                </div>

                <div className='panel right-panel content'>

                    <div className="expense-list">
                        {renderExpensesByMonthAndDay()}
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default MainList