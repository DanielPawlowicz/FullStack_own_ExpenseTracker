package com.Daniel.ExpenseTracker_Backend.controller;

import com.Daniel.ExpenseTracker_Backend.model.Expense;
import com.Daniel.ExpenseTracker_Backend.model.ExpenseType;
import com.Daniel.ExpenseTracker_Backend.service.ExpenseServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ExpenseController {

    @Autowired
    private ExpenseServiceImpl expenseService;


// BASIC CRUD

    // add new expense
    @PostMapping("/addExpense")
    public ResponseEntity<?> newExpense(@RequestBody Expense expense){
        return new ResponseEntity<>(expenseService.saveExpense(expense), HttpStatus.CREATED);
    }

    // get all expenses
    @GetMapping("/allExpense")
    public ResponseEntity<?> getAllExpense(){
        return new ResponseEntity<>(expenseService.getAllExpense(), HttpStatus.OK);
    }

    // get single expense
    @GetMapping("expense/{id}")
    public ResponseEntity<?> getExpensesByType(@PathVariable Long id) {
        return new ResponseEntity<>(expenseService.getExpenseById(id), HttpStatus.OK);
    }

    // delete expense
    @DeleteMapping("deleteExpense/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id){
        return new ResponseEntity<>(expenseService.deleteExpense(id), HttpStatus.OK);
    }

    // edit expense
    @PutMapping("editExpense/{id}")
    public ResponseEntity<?> editExpense(@RequestBody Expense newExpense, @PathVariable Long id){
        return new ResponseEntity<>(expenseService.editExpense(newExpense, id), HttpStatus.OK);
    }



// OTHER

    // get expense by type
    @GetMapping("expensesByType")
    public List<Expense> getExpensesByType(@RequestParam("type") ExpenseType expenseType) {
        return expenseService.getExpensesByType(expenseType);
    }

    // get expense by date
    @GetMapping("/expensesByDate")
    public List<Expense> getExpensesByDate(@RequestParam("date") String date) {
        LocalDate expenseDate = LocalDate.parse(date);
        return expenseService.getExpensesByDate(expenseDate);
    }




}
