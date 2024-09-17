describe("Login Functionally", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("should login successfully with valid credentials", () => {
    cy.get('input[name="emailOrMobile"]').type("general@gmail.com");
    cy.get('input[name="password"]').type("1234");

    cy.get('button[type="submit"]').click();
    cy.url().then((url) => {
      console.log(url);
    });
    cy.url().should("include", "/dashboard");

    cy.window().its("localStorage.token").should("exist");
    cy.get(".colorful > :nth-child(2)").should("not.equal", "لا يوجد بيانات");
  });

  it("should show error for invalid credentials", () => {
    cy.get('input[name="emailOrMobile"]').type("wrong@gmail.com");
    cy.get('input[name="password"]').type("1234");

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/login");
    cy.window().its("localStorage.token").should("not.exist");
  });
});
