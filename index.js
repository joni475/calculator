const calculator = document.querySelector(".calculator");
const display = calculator.querySelector(".calculator__display");
const calcButton = calculator.querySelector(".calculator__keys");

const pressKey = (key) => {
  calcButton.querySelector(`[data-key="${key}"]`).click();
};

const getDisplayValue = (_) => {
  return calculator.querySelector(".calculator__display").textContent;
};

const resetCalculator = (_) => {
  pressKey("clear");
  pressKey("clear");

  console.assert(getDisplayValue() === "0", "Calculator cleared");
  console.assert(!calculator.dataset.firstValue, "No first value");
  console.assert(!calculator.dataset.operator, "No operator value");
  console.assert(!calculator.dataset.modifierValue, "No modifier value");
};


const pressKeys = (...keys) => {
  keys.forEach(pressKey);
};
//*********************************//

const calculate = (firstValue, operator, secondValue) => {
  firstValue = parseFloat(firstValue);
  secondValue = parseFloat(secondValue);
  if (operator === "plus") return firstValue + secondValue;
  if (operator === "minus") return firstValue - secondValue;
  if (operator === "times") return firstValue * secondValue;
  if (operator === "divide") return firstValue / secondValue;
};

function handleClearKey(calculator, button) {
  const { firstValue, operator, modifierValue} = calculator.dataset;

  if (button.textContent === "AC") {
    delete calculator.dataset.firstValue;
    delete calculator.dataset.operator;
    delete calculator.dataset.modifierValue;
    resetCalculator()
  }
  display.textContent = "0";
  button.textContent = "AC";
}

function handleNumberKey(calculator, button) {
  const result = getDisplayValue();
  const { key } = button.dataset;
  const {previousButton} = calculator.dataset

  if (result === "0") {
    display.textContent = key;
  } else {
    display.textContent = result + key;
  }
  if (previousButton === "operator") {
    display.textContent = key;
  }
  if (previousButton === "equal") {
    display.textContent = key;
  }
}

function handleDecimalKey(calculator) {
  const result = getDisplayValue();
  const { previousButton } = calculator.dataset;

  if (!result.includes(".")) {
    display.textContent = result + ".";
  }
  if (previousButton === "operator" || previousButton === "equal") {
    display.textContent = "0.";
  }
}

function handleOperatorKey(calculator, button) {
  const result = getDisplayValue();
  const { firstValue, operator, previousButton } = calculator.dataset;
  const { key } = button.dataset;

  const secondValue = parseFloat(result);
  button.classList.add("selected");

  if (
    previousButton !== "operator" &&
    previousButton !== "equal" &&
    firstValue  &&
    operator
  ) {
    const newResult = calculate(firstValue, operator, secondValue);

    display.textContent = newResult;
    calculator.dataset.firstValue = newResult;
  } else {
    calculator.dataset.firstValue = result;
  }

  if (previousButton === "number") {
    calculator.dataset.operator = key;
  }
}

function handleEqualKey(calculator, button) {
  const result = getDisplayValue();
  const { firstValue, operator, modifierValue } = calculator.dataset;

  const secondValue = modifierValue || parseFloat(result);

  if (firstValue && operator) {
    const newResult = calculate(firstValue, operator, secondValue);

    display.textContent = newResult;
    calculator.dataset.firstValue = newResult;
    calculator.dataset.modifierValue = secondValue;
  } else {
    display.textContent = parseFloat(result) * 1;
  }
}

calcButton.addEventListener("click", (event) => {
  if (!event.target.closest("button")) return;
  const button = event.target;
  const { buttonType, key } = button.dataset;
  const { previousButton } = calculator.dataset;

  const result = display.textContent;

  const selectedRemover = [...calcButton.children]
    .filter((selected) => selected.dataset.buttonType === "operator")
    .forEach((selected) => selected.classList.remove("selected"));

  // not clear
  if (buttonType !== "clear") {
    const clear = calculator.querySelector('[data-key="clear"]');
    clear.textContent = "CE";
  }

  switch (buttonType) {
    case "clear":
      handleClearKey(calculator, button);
      break;
    case "number":
      handleNumberKey(calculator, button);
      break;
    case "decimal":
      handleDecimalKey(calculator);
      break;
    case "operator":
      handleOperatorKey(calculator, button);
      break;
    case "equal":
      handleEqualKey(calculator, button);
      break;
  }

  calculator.dataset.previousButton = buttonType;

});
  
// ****** TESTING [very important] ******//

const runTest = (test) => {
  pressKeys(...test.keys);
  console.assert(getDisplayValue() === test.result, test.message);
  resetCalculator();
};

const tests = [
  {
    message: "Number Decimal Number",
    keys: ["1", "decimal", "1"],
    result: "1.1",
  },
  {
    message: "Number Operator Number",
    keys: ["1", "plus", "2", "equal"],
    result: "3",
  },
  {
    message: "Number Equal",
    keys: ["5", "equal"],
    result: "5",
  },
  {
    message: "Number Decimal Equal",
    keys: ["2", "decimal", "4", "5", "equal"],
    result: "2.45",
  },
  {
    message: "Decimal Key",
    keys: ["decimal"],
    result: "0.",
  },
  {
    message: "Decimal Decimal",
    keys: ["2", "decimal", "decimal"],
    result: "2.",
  },
  {
    message: "Decimal Number Decimal",
    keys: ["2", "decimal", "5", "decimal", "5"],
    result: "2.55",
  },
  {
    message: "Decimal Equal",
    keys: ["2", "decimal", "equal"],
    result: "2",
  },
  {
    message: "Equal",
    keys: ["equal"],
    result: "0",
  },
  {
    message: "Equal Number",
    keys: ["equal", "3"],
    result: "3",
  },
  {
    message: "Number Equal Number",
    keys: ["5", "equal", "3"],
    result: "3",
  },
  {
    message: "Equal Decimal",
    keys: ["equal", "decimal"],
    result: "0.",
  },
  {
    message: "Number Equal Decimal",
    keys: ["5", "equal", "decimal"],
    result: "0.",
  },
  {
    message: "Calculation + operation",
    keys: ["1", "plus", "1", "equal", "plus", "1", "equal"],
    result: "3",
  },
  {
    message: "Operator Decimal",
    keys: ["times", "decimal"],
    result: "0.",
  },
  {
    message: "Number Operator Decimal",
    keys: ["5", "times", "decimal"],
    result: "0.",
  },
  {
    message: "Number Operator Equal",
    keys: ["7", "divide", "equal"],
    result: "1",
  },
  {
    message: "Operator calculation",
    keys: ["9", "minus", "5", "minus"],
    result: "4",
  },
  {
    message: "Number Operator Operator",
    keys: ["9", "times", "divide"],
    result: "9",
  },
  {
    message: "Number Operator Equal Equal",
    keys: ["9", "minus", "equal", "equal"],
    result: "-9",
  },
  {
    message: "Number Operator Number Equal Equal",
    keys: ["8", "minus", "5", "equal", "equal"],
    result: "-2",
  },
  {
    message: "Operator follow-up calculation",
    keys: ["1", "plus", "2", "plus", "3", "plus", "4", "plus", "5", "plus"],
    result: "15",
  },
];

tests.forEach(runTest);
