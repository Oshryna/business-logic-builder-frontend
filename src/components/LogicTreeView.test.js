import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LogicTreeView from "./LogicTreeView";

describe("LogicTreeView", () => {
  const businessLogic = {
    type: "AND",
    name: "All Conditions",
    conditions: [
      {
        field: "$.field1",
        operator: "eq",
        value_prop: { value: "123", type: "const" },
        name: "Cond1"
      },
      {
        type: "OR",
        name: "Any Group",
        conditions: [
          {
            field: "$.field2",
            operator: "ne",
            value_prop: { value: "456", type: "const" },
            name: "Cond2"
          }
        ]
      }
    ]
  };
  it("renders group and condition nodes", () => {
    render(<LogicTreeView businessLogic={businessLogic} />);
    expect(screen.getByText("All Conditions must be true")).toBeInTheDocument();
    expect(screen.getByText("Cond1")).toBeInTheDocument();
    expect(screen.getByText("Any Group")).toBeInTheDocument();
    expect(screen.getByText("Cond2")).toBeInTheDocument();
  });
  it("expands and collapses nodes", () => {
    render(<LogicTreeView businessLogic={businessLogic} />);
    const expandBtn = screen.getAllByTitle(/expand/i)[0];
    fireEvent.click(expandBtn);
    // Should still render children (Collapse is not unmounting)
    expect(screen.getByText("Cond2")).toBeInTheDocument();
  });
  it("handles zoom controls", () => {
    render(<LogicTreeView businessLogic={businessLogic} />);
    const zoomInBtn = screen.getByTitle(/zoom in/i);
    fireEvent.click(zoomInBtn);
    const zoomOutBtn = screen.getByTitle(/zoom out/i);
    fireEvent.click(zoomOutBtn);
    // No assertion needed, just ensure no crash
  });
});
