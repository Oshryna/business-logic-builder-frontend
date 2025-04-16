import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ConditionGroup from "./ConditionGroup";

describe("ConditionGroup", () => {
  const baseGroup = {
    type: "AND",
    name: "All Conditions",
    conditions: []
  };
  it("renders the group name and type", () => {
    render(
      <ConditionGroup
        group={baseGroup}
        onChange={jest.fn()}
        onDelete={jest.fn()}
        level={0}
      />
    );
    expect(screen.getByText("All Conditions")).toBeInTheDocument();
    expect(screen.getByDisplayValue("AND")).toBeInTheDocument();
  });
  it("calls onChange when adding a condition", () => {
    const onChange = jest.fn();
    render(
      <ConditionGroup
        group={baseGroup}
        onChange={onChange}
        onDelete={jest.fn()}
        level={0}
      />
    );
    fireEvent.click(screen.getByText(/add condition/i));
    expect(onChange).toHaveBeenCalled();
  });
  it("calls onChange when changing group type", () => {
    const onChange = jest.fn();
    render(
      <ConditionGroup
        group={baseGroup}
        onChange={onChange}
        onDelete={jest.fn()}
        level={0}
      />
    );
    fireEvent.change(screen.getByDisplayValue("AND"), {
      target: { value: "OR" }
    });
    expect(onChange).toHaveBeenCalled();
  });
  it("calls onDelete when delete is clicked", () => {
    const onDelete = jest.fn();
    render(
      <ConditionGroup
        group={baseGroup}
        onChange={jest.fn()}
        onDelete={onDelete}
        level={1}
      />
    );
    fireEvent.click(screen.getByTitle(/delete group/i));
    expect(onDelete).toHaveBeenCalled();
  });
});
