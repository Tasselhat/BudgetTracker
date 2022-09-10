import React from "react";
import { Link } from "react-router-dom";
import ChartComponent from "./ChartComponent";
import "../css/TrackerRings.css";

const data = [
  { label: "rent", value: 600 },
  { label: "utilites", value: 80 },
  { label: "food", value: 300 },
  { label: "entertainment", value: 80 },
  { label: "subscriptions", value: 20 },
  { label: "savings", value: 520 },
];

const savingsData = [
  { label: "stocks", value: 110 },
  { label: "savings", value: 100 },
  { label: "roth IRA", value: 200 },
  { label: "crypto", value: 110 },
];

export default class TrackerRings extends React.Component {
  constructor(props) {
    super(props);

    this.state = { label: "Rent", percentage: "0", value: "0" };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    this.setState({ label: "Enter Expense Name" });
    alert("An expense was submitted: " + this.state.label);
    event.preventDefault();
  }

  render() {
    return (
      <div className="tracker-rings-container">
        <div>
          <ChartComponent data={data} />
          <ChartComponent data={savingsData} />
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <h3>Enter your expenses</h3>
            <label htmlFor="label">Expense</label>
            <input
              name="label"
              type="text"
              autoComplete="off"
              value={this.state.label}
              onChange={this.handleInputChange}
            ></input>
            <input
              name="percentage"
              type="number"
              min="1"
              max="100"
              value={this.state.percentage}
              onChange={this.handleInputChange}
            />
            <label htmlFor="percentage">% </label><label htmlFor="cost">or cost in $</label>
            <input
              name="cost"
              type="number"
              min="0"
              max="1000000"
              value={this.state.value}
              onChange={this.handleInputChange}
            />
            <input type="submit" value="Submit"></input>
          </form>
          <h1><Link to="/admin">Admin</Link></h1>
        </div>
      </div>
    );
  }
}
