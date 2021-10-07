const calculator = document.querySelector(".calculator")
const display = calculator.querySelector(".calculator__display")
const calcButton = calculator.querySelector(".calculator__keys")

calcButton.addEventListener("click", event => {
    if(!event.target.closest("button")) return
    const button = event.target
    const {buttonType, key} = button.dataset
    const {previousButton} = calculator.dataset
  
    const result = display.textContent

    const selectedRemover = [...calcButton.children]
    .filter(selected=> selected.dataset.buttonType === "operator")
    .forEach(selected=> selected.classList.remove("selected"))
       
          
   // number
    if(buttonType === "number") {
        if(result === "0") {
            display.textContent = key
        } else {
            display.textContent = result + key
        }
        if(previousButton === "operator") {
            display.textContent = key
        }
        if(previousButton === "equal") {
            display.textContent = key
        }
    }

// decimal
 if(buttonType === "decimal") {
     if(!result.includes(".")){
       display.textContent = result + "."   
     }
     if(previousButton === "operator" || previousButton === "equal") {
         display.textContent = "0."
     }
   
    } 
  
   
 // operator
 if(buttonType === "operator") {
     button.classList.add("selected")

     const firstValue = parseFloat(calculator.dataset.firstValue)
     const operator = calculator.dataset.operator
     const secondValue = parseFloat(result)

     if(
         previousButton !== "operator" &&
         previousButton !== "equal" &&
         typeof firstValue === "number" && 
         operator
         ){

     let newResult 
     if(operator === "plus") newResult = firstValue + secondValue
     if(operator === "minus") newResult = firstValue - secondValue
     if(operator === "times") newResult = firstValue * secondValue
     if(operator === "divide") newResult = firstValue / secondValue
    
     display.textContent = newResult
     calculator.dataset.firstValue = newResult
     } else {
     calculator.dataset.firstValue = result
     }

   if(previousButton === "number") {
     calculator.dataset.operator = key
   }
     
 }



 // equal
 if(buttonType === "equal") {
     const firstValue = parseFloat(calculator.dataset.firstValue)
     const operator = calculator.dataset.operator
     const modifierValue = parseFloat(calculator.dataset.modifierValue)
     const secondValue = modifierValue || parseFloat(result)
     if(typeof(firstValue) === "number" && operator){

     let newResult 
     if(operator === "plus") newResult = firstValue + secondValue
     if(operator === "minus") newResult = firstValue - secondValue
     if(operator === "times") newResult = firstValue * secondValue
     if(operator === "divide") newResult = firstValue / secondValue
    
     display.textContent = newResult
     calculator.dataset.firstValue = newResult
     calculator.dataset.modifierValue = secondValue
     }else {
         display.textContent = parseFloat(result) * 1
     }

 }
 // not clear
 if(buttonType !== "clear"){
     const clear = calculator.querySelector('[data-key="clear"]')
     clear.textContent = "CE"

    }
 // clear
 if(buttonType === "clear") {
     if(button.textContent === "AC"){
         delete calculator.dataset.firstValue
         delete calculator.dataset.operator
         delete calculator.dataset.modifierValue
     }
     display.textContent = "0"
     button.textContent = "AC"
 }
 
  calculator.dataset.previousButton = buttonType
})

// ****** TESTING [very important] ******//


// To press the key
const pressKey = key => {
    calcButton.querySelector(`[data-key="${key}"]`).click()
}
// Displayed result of the calculator
const getDisplayValue = _ => {
    return calculator.querySelector(".calculator__display").textContent
}
// Resetting the current test to test another 
const resetCalculator = _ => {
    pressKey("clear")
    pressKey("clear")

    console.assert(getDisplayValue() === "0", "Calculator cleared")
    console.assert(!calculator.dataset.firstValue, "No first value")
    console.assert(!calculator.dataset.operator, "No operator value")
    console.assert(!calculator.dataset.modifierValue, "No modifier value")
}

pressKey("2")
console.assert(getDisplayValue() === "2", "Number key")
resetCalculator()

// Enable us to make presskey on the same 
const pressKeys = (...keys) => {
  keys.forEach(pressKey)
}

// Help us not to write the console.assert and reset function for every test
const runTest = test => {
   pressKeys(...test.keys)
   console.assert(getDisplayValue() === test.result, test.message)
   resetCalculator() 
}

const tests = [
    {
       message: "Number Decimal Number",
       keys: ["1", "decimal", "1"],
       result: "1.1"
    },
    {
        message: "Number Operator Number",
        keys: ["1", "plus", "2", "equal"],
        result: "3"  
    },
    {
        message: "Number Equal",
        keys: ["5", "equal"],
        result: "5"
    },
    {
        message: "Number Decimal Equal",
        keys: ["2", "decimal", "4", "5", "equal"],
        result: "2.45"
    },
    {
        message: "Decimal Key",
        keys: ["decimal"],
        result: "0."
    },
    {
        message: "Decimal Decimal",
        keys: ["2", "decimal", "decimal"],
        result: "2."
    },
    {
        message: "Decimal Number Decimal",
        keys:["2", "decimal", "5", "decimal", "5"],
        result: "2.55"
    },
    {
        message: "Decimal Equal",
        keys: ["2", "decimal", "equal"],
        result: "2"
    },
    {
        message:"Equal",
        keys: ["equal"],
        result: "0"
    },
    {
        message: "Equal Number",
        keys: ["equal", "3"],
        result: "3"
    },
    {
        message: "Number Equal Number",
        keys: ["5", "equal", "3"],
        result: "3"
    },
    {
        message: "Equal Decimal",
        keys: ["equal", "decimal"],
        result: "0."
    },
    {
        message: "Number Equal Decimal",
        keys: ["5", "equal", "decimal"],
        result: "0."
    },
    {
        message: "Calculation + operation",
        keys: ["1", "plus", "1", "equal", "plus", "1", "equal"],
        result: "3"
    },
    {
        message: "Operator Decimal",
        keys: ["times", "decimal"],
        result: "0."
    },
    {
        message: "Number Operator Decimal",
        keys: ["5", "times", "decimal"],
        result: "0."
    },
    {
        message: "Number Operator Equal",
        keys: ["7", "divide", "equal"],
        result: "1"
    },
    {
        message: "Operator calculation",
        keys: ["9", "minus", "5", "minus"],
        result: "4"
    },
    {
        message: "Number Operator Operator",
        keys: ["9", "times", "divide"],
        result: "9"
    },
    {
        message: "Number Operator Equal Equal",
        keys: ["9", "minus", "equal", "equal"],
        result: "-9"
    },
    {
        message: "Number Operator Number Equal Equal",
        keys: ["8", "minus", "5", "equal", "equal"],
        result : "-2"
    },
    {
        message: "Operator follow-up calculation",
        keys: ["1", "plus", "2", "plus", "3", "plus", "4", "plus", "5", "plus"],
        result: "15"
    }
]

tests.forEach(runTest)