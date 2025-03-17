Cypress.Commands.add("getTitleText", () => {
    return cy.get("app-root h1").should("have.text", "Hello, frontend");

  });
  

  declare global {
    namespace Cypress {
      interface Chainable {
        getTitleText(): Chainable<JQuery<HTMLElement>>;
      }
    }
  }
  
  export {}; 
  