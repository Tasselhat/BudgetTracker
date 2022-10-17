import * as React from "react";
import defaultState from "./dashboardDefaults";

function VariablesFormCompound({ onUpdate }) {
  const [state, setState] = React.useState(defaultState);

  const { initialAmount, period, growthRate, monthlyContribution } = state;

  return (
    <section>
      <h2>Financials</h2>
      <div className="flex">
        <label htmlFor="initialAmount">
          Initial Amount ($)
          <input
            type="number"
            id="initialAmount"
            name="initialAmount"
            value={initialAmount}
            onChange={({ target }) => setState({ ...state, initialAmount: Number(target.value) })}
          />
        </label>
        <label htmlFor="period">
          Investment Period (Years)
          <input
            type="number"
            id="period"
            name="period"
            value={period}
            onChange={({ target }) => setState({ ...state, period: Number(target.value) })}
          />
        </label>
        <label htmlFor="growthRate">
          Annual Growth Rate (%)
          <input
            type="number"
            id="growthRate"
            name="growthRate"
            value={growthRate}
            onChange={({ target }) => setState({ ...state, growthRate: Number(target.value) })}
          />
        </label>
        <label htmlFor="monthlyContribution">
          Monthly Contribution (£)
          <input
            type="number"
            id="monthlyContribution"
            name="monthlyContribution"
            value={monthlyContribution}
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
}

export default VariablesFormCompound;