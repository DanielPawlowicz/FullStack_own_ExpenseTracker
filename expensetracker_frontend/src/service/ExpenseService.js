import axios from "axios";

const API_URL = "http://localhost:8080";

class ExpenseService {

    // Get this month balance value
    getThisMonthBalance () {
        return axios.get(API_URL + "/expensesThisMonthSummary");
    }

    // Get all expenses display
    getAllExpenses(){
        return axios.get(API_URL + "/allExpensesOrdered");
    }

    // Get expenses value from specific month
    getSpecificMonthValue(m, y){
        return axios.get(API_URL + `expensesSpecificMonthSummary?month=${m}&year=${y}`)
    }

}

export default new ExpenseService;