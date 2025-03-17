it("should display welcome message", () => {
    cy.visit("/");
    cy.contains("Hello, frontend").should("exist");
  });
  