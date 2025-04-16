import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Condition from "./Condition";

describe("Condition", () => {
  const baseCondition = {
    name: "Test Condition",
    field: "$.field",
    operator: "eq",
    value_prop: { value: "123" },
    comparison_prop: { type: "simple", name: "" }
  };
  it("renders the condition name and chips", () => {
    render(
      <Condition
        condition={baseCondition}
        onChange={jest.fn()}
        onDelete={jest.fn()}
        index={0}
      />
    );
    expect(screen.getByText("Test Condition")).toBeInTheDocument();
    expect(screen.getByText("$.field")).toBeInTheDocument();
    expect(screen.getByText("equals")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
  });
  it("calls onDelete when delete is clicked", () => {
    const onDelete = jest.fn();
    render(
      <Condition
        condition={baseCondition}
        onChange={jest.fn()}
        onDelete={onDelete}
        index={1}
      />
    );
    fireEvent.click(screen.getByTitle(/delete condition/i));
    expect(onDelete).toHaveBeenCalledWith(1);
  });
  it("expands and collapses details", () => {
    render(
      <Condition
        condition={baseCondition}
        onChange={jest.fn()}
        onDelete={jest.fn()}
        index={0}
      />
    );
    const expandBtn = screen.getByTitle(/expand/i);
    fireEvent.click(expandBtn);
    expect(screen.getByLabelText(/field/i)).toBeInTheDocument();
    fireEvent.click(screen.getByTitle(/collapse/i));
    // Details should still be in the document (Collapse is not unmounting)
    expect(screen.getByLabelText(/field/i)).toBeInTheDocument();
  });
  it("calls onChange when editing fields", () => {
    const onChange = jest.fn();
    render(
      <Condition
        condition={baseCondition}
        onChange={onChange}
        onDelete={jest.fn()}
        index={0}
      />
    );
    fireEvent.click(screen.getByTitle(/expand/i));
    fireEvent.change(screen.getByLabelText(/field/i), {
      target: { value: "$.newField" }
    });
    expect(onChange).toHaveBeenCalledWith(
      0,
      expect.objectContaining({ field: "$.newField" })
    );
  });
});
