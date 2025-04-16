import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RuleBuilder from "./RuleBuilder";

describe("RuleBuilder", () => {
  it("renders the rule builder UI", () => {
    render(<RuleBuilder onSave={jest.fn()} />);
    expect(screen.getByText(/business rule builder/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rule name/i)).toBeInTheDocument();
  });
  it("shows validation warning if saving with empty rule", () => {
    render(<RuleBuilder onSave={jest.fn()} />);
    fireEvent.click(screen.getByText(/save rule/i));
    expect(
      screen.getByText(/please fix the following issues/i)
    ).toBeInTheDocument();
  });
  it("calls onSave with valid rule", () => {
    const onSave = jest.fn();
    render(<RuleBuilder onSave={onSave} />);
    fireEvent.change(screen.getByLabelText(/rule name/i), {
      target: { value: "My Rule" }
    });
    // Add a condition to the root group
    fireEvent.click(screen.getByText(/add condition/i));
    fireEvent.change(screen.getByLabelText(/field/i), {
      target: { value: "$.field" }
    });
    fireEvent.change(screen.getByLabelText(/operator/i), {
      target: { value: "eq" }
    });
    fireEvent.change(screen.getByLabelText(/value/i), {
      target: { value: "123" }
    });
    fireEvent.click(screen.getByText(/save rule/i));
    expect(onSave).toHaveBeenCalled();
  });
});
