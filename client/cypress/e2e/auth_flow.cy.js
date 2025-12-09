describe("Auth Flow - Register and Dashboard", () => {
  it("registers a new customer and reaches the dashboard", () => {
    // unique email every time
    const email = `test${Date.now()}@example.com`;
 
    // Go to Register page
    cy.visit("http://localhost:5174/register");
 
    // Fill form
    cy.get('input[name="name"]').type("Test User");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type("Password123!");
    cy.get('select[name="role"]').select("customer");
 
    // Submit form
    cy.get('button[type="submit"]').click();
 
    // Should redirect to dashboard
    cy.url().should("include", "/dashboard");
    cy.contains("Dashboard");
  });
});