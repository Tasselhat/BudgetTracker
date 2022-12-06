import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ChartComponent from "./ChartComponent";

const data = [
  { label: "rent", value: 1340 },
  { label: "utilites", value: 80 },
  { label: "food", value: 300 },
  { label: "car", value: 287 },
  { label: "entertainment", value: 80 },
  { label: "Saving/Investments", value: 520 },
  { label: "misc", value: 100 },
  { label: "Extra Income", value: 234 },
];

const GetExpenses = (updatedKey) => {
  const [budget, setBudget] = useState();
  const [key, setKey] = useState(updatedKey);
  const [chartData, setChartData] = useState();
  const [arrayExists, setArrayExists] = useState(false);
  const [expensesExceedIncomeWarning, setExpensesExceedIncomeWarning] =
    useState("");
  const [noIncomeWarning, setNoIncomeWarning] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getBudgets = async () => {
      try {
        const response = await axiosPrivate.get("/expenses", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setBudget(response.data);
        const chartData = [];
        const budgetObject = response.data;
        if (!budgetObject) return setArrayExists(false);

        const income = budgetObject.income;
        const savingsObject = budgetObject.saving;
        const savingTotalAmount = !savingsObject ? 0 : savingsObject.total;
        const savingPercentOfIncome = !savingsObject
          ? 0
          : savingsObject.percent;

        const expensesArrayLength = Object.keys(budgetObject.expenses).length;
        if (expensesArrayLength > 0) {
          setArrayExists(true);
        }
        if (savingTotalAmount && savingPercentOfIncome) {
          const savingAsPerecentOfIncome = Math.round(
            income * (savingPercentOfIncome / 100)
          );
          if (savingAsPerecentOfIncome > savingTotalAmount) {
            chartData.push({
              label: "Saving/Investments",
              value: savingAsPerecentOfIncome,
            });
          } else {
            chartData.push({
              label: "Saving/Investments",
              value: savingTotalAmount,
            });
          }
        } else if (!savingTotalAmount) {
          const savingAsPerecentOfIncome = Math.round(
            income * (savingPercentOfIncome / 100)
          );
          chartData.push({
            label: "Saving/Investments",
            value: savingAsPerecentOfIncome,
          });
        } else {
          chartData.push({
            label: "Saving/Investments",
            value: savingTotalAmount,
          });
        }
        if (!income) {
          for (let i = 0; i < expensesArrayLength; i++) {
            chartData.push({
              label: budgetObject.expenses[i].expenseName,
              value: budgetObject.expenses[i].expenseFlatCost,
            });
          }
          setNoIncomeWarning(
            "Please enter your current income to properly display graph."
          );
        } else {
          for (let i = 0; i < expensesArrayLength; i++) {
            const percentageValue = Math.round(
              income * (budgetObject.expenses[i].expensePercentage / 100)
            );
            const flatCostValue = budgetObject.expenses[i].expenseFlatCost;
            if (percentageValue > flatCostValue) {
              chartData.push({
                label: budgetObject.expenses[i].expenseName,
                value: percentageValue,
              });
            } else {
              chartData.push({
                label: budgetObject.expenses[i].expenseName,
                value: flatCostValue,
              });
            }
          }
        }
        setChartData(chartData);
        const chartDataSum = chartData.reduce((accumulator, object) => {
          return accumulator + object.value;
        }, 0);
        if (chartDataSum < income) {
          const excess = income - chartDataSum;
          chartData.push({
            label: "Extra Income",
            value: excess,
          });
        } else {
          setExpensesExceedIncomeWarning(
            "Warning: Expenses currently exceed your entered income, consider reducing expenses, increasing monthly income, or adjusting any errors."
          );
        }
        setChartData(chartData);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getBudgets();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);

  if (arrayExists) {
    return (
      <section>
        <h2 className="header">Breakdown of expenses:</h2>
        <ChartComponent data={chartData} />
        <p
          className={noIncomeWarning ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {noIncomeWarning}
        </p>
        <p
          className={expensesExceedIncomeWarning ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {expensesExceedIncomeWarning}
        </p>
      </section>
    );
  } else {
    return (
      <>
        <h2 className="header">Example expenses chart:</h2>
        <ChartComponent data={data} />
      </>
    );
  }
};

export default GetExpenses;
