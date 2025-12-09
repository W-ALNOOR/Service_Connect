
import { render, screen } from "@testing-library/react";
import Home from "./Home";
 
test("Home page renders the title", () => {
  render(<Home />);
 
  // Expect the word SERVICECONNECT to appear
  const title = screen.getByText(/serviceconnect/i);
  expect(title).toBeInTheDocument();
});