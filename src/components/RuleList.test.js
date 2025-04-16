import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RuleList from "./RuleList";

describe("RuleList", () => {
  const rules = [
    {
      id: 1,
      name: "Rule A",
      description: "Desc A",
      createdAt: new Date().toISOString(),
      businessLogic: { type: "AND", conditions: [] }
    },
    {
      id: 2,
      name: "Rule B",
      description: "Desc B",
      createdAt: new Date().toISOString(),
      businessLogic: { type: "OR", conditions: [] }
    }
  ];
  it("renders rule names", () => {
    render(<RuleList rules={rules} onDelete={jest.fn()} />);
    expect(screen.getByText("Rule A")).toBeInTheDocument();
    expect(screen.getByText("Rule B")).toBeInTheDocument();
  });
  it("filters by search", () => {
    render(<RuleList rules={rules} onDelete={jest.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "Rule A" }
    });
    expect(screen.getByText("Rule A")).toBeInTheDocument();
    expect(screen.queryByText("Rule B")).not.toBeInTheDocument();
  });
  it("calls onDelete when confirmed", () => {
    const onDelete = jest.fn();
    render(<RuleList rules={rules} onDelete={onDelete} />);
    fireEvent.click(screen.getAllByTitle(/delete/i)[0]);
    fireEvent.click(screen.getByText(/confirm/i));
    expect(onDelete).toHaveBeenCalled();
  });
  it("opens and closes view dialog", () => {
    render(<RuleList rules={rules} onDelete={jest.fn()} />);
    fireEvent.click(screen.getAllByTitle(/view/i)[0]);
    expect(screen.getByText(/rule details/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/close/i));
    expect(screen.queryByText(/rule details/i)).not.toBeInTheDocument();
  });
});
