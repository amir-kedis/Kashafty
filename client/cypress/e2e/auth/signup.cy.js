describe("Registration Functionality", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  it("should register successfully with valid information", () => {
    const uniqueId = Date.now().toString();
    const email = `johndoe${uniqueId}@example.com`;
    const uniquePhone11Digits = `010${uniqueId.slice(-8)}`;

    cy.get('input[name="firstName"]').type("John");
    cy.get('input[name="middleName"]').type("Doe");
    cy.get('input[name="lastName"]').type("Smith");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="phone"]').type(uniquePhone11Digits);
    cy.get('input[name="password"]').type("securePassword123");
    cy.get('input[name="rePassword"]').type("securePassword123");
    cy.get('input[name="gender"][value="ذكر"]').check();
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/dashboard");
    cy.window().its("localStorage.token").should("exist");
  });

  it("should show error for existing email", () => {
    const uniqueId = Date.now().toString();
    const uniquePhone11Digits = `010${uniqueId.slice(-8)}`;
    const email = "existing@example.com"; // Using a known existing email

    cy.get('input[name="firstName"]').type("Jane");
    cy.get('input[name="middleName"]').type("Ann");
    cy.get('input[name="lastName"]').type("Doe");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="phone"]').type(uniquePhone11Digits);
    cy.get('input[name="password"]').type("anotherPassword456");
    cy.get('input[name="rePassword"]').type("anotherPassword456");
    cy.get('input[name="gender"][value="أنثى"]').check();
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/signup");
    cy.window().its("localStorage.token").should("not.exist");
  });

  it("should show error for password mismatch", () => {
    const uniqueId = Date.now().toString();
    const uniquePhone11Digits = `010${uniqueId.slice(-8)}`;
    const email = `alice${uniqueId}@example.com`;

    cy.get('input[name="firstName"]').type("Alice");
    cy.get('input[name="middleName"]').type("Marie");
    cy.get('input[name="lastName"]').type("Johnson");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="phone"]').type(uniquePhone11Digits);
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="rePassword"]').type("differentPassword123");
    cy.get('input[name="gender"][value="أنثى"]').check();
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/signup");
    cy.window().its("localStorage.token").should("not.exist");
  });
});
