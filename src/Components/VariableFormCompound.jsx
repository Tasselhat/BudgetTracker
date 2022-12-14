import * as React from "react";
import "../css/Dashboard.css";

const VariablesFormCompound = ({
  onUpdate,
  initialAmount,
  period,
  growthRate,
  monthlyContribution,
}) => {
  const [state, setState] = React.useState({
    initialAmount: initialAmount,
    period: period,
    growthRate: growthRate,
    monthlyContribution: monthlyContribution,
  });

  return (
    <section>
      <br />
      <h2>Financials</h2>
      <div className="varaible-form-wrapper">
        <label htmlFor="initialAmount">
          Initial Amount ($)
          <input
            type="number"
            id="initialAmount"
            name="initialAmount"
            value={state.initialAmount}
            onChange={({ target }) =>
              setState({ ...state, initialAmount: Number(target.value) })
            }
          />
        </label>
        <label htmlFor="period">
          Investment Period (Years)
          <input
            type="number"
            id="period"
            name="period"
            value={state.period}
            onChange={({ target }) =>
              setState({ ...state, period: Number(target.value) })
            }
          />
        </label>
        <label htmlFor="growthRate">
          Annual Growth Rate (%)
          <input
            type="number"
            id="growthRate"
            name="growthRate"
            value={state.growthRate}
            onChange={({ target }) =>
              setState({ ...state, growthRate: Number(target.value) })
            }
          />
        </label>
        <label htmlFor="monthlyContribution">
          Monthly Contribution ($)
          <input
            type="number"
            id="monthlyContribution"
            name="monthlyContribution"
            value={state.monthlyContribution}
            onChange={({ target }) =>
              setState({ ...state, monthlyContribution: Number(target.value) })
            }
          />
        </label>
      </div>
      <button type="button" onClick={() => onUpdate(state)}>
        Update Chart
      </button>
    </section>
  );
};

export default VariablesFormCompound;
