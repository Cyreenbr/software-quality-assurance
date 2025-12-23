// ***********************************************
// Custom Cypress Commands
// ***********************************************

/**
 * Login as admin user
 * Falls back to direct token method if API login fails
 */
Cypress.Commands.add("loginAdmin", () => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem("token");

    if (token) {
      // déjà logué
      return;
    }

    // Tentative via API
    cy.request({
      method: "POST",
      url: "http://localhost:5173/api/auth/login",
      body: {
        email: "admin@gmail.com",
        password: "admin",
      },
      failOnStatusCode: false, // important !
    }).then((response) => {
      if (response.status === 200 && response.body.token) {
        win.localStorage.setItem("token", response.body.token);
        return;
      }

      // fallback si la requête a échoué
      cy.loginAdminDirect();
    });
  });
});

/**
 * Login as admin user using direct token (bypass API if needed)
 * Use this if the backend is not available or login API is failing
 */
Cypress.Commands.add('loginAdminDirect', () => {
  // Visit signin first to ensure we're on the right domain
  cy.visit('/signin');
  
  // Set token directly in localStorage (mock login)
  cy.window().then((win) => {
    // Set a mock token
    win.localStorage.setItem('token', 'mock-admin-token-for-testing');
    win.localStorage.setItem('role', 'ADMIN');
    win.localStorage.setItem('email', Cypress.env('adminEmail') || 'admin@test.com');
  });
  
  // Navigate to home page
  cy.visit('/');
  
  // Verify we're logged in
  cy.window().its('localStorage.token').should('exist');
});

/**
 * Logout user
 */
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
  
  cy.visit('/signin');
});

/**
 * Generate a random CIN (Carte d'Identité Nationale) for testing
 * Format: 8 digits
 */
Cypress.Commands.add('generateCIN', () => {
  const randomCIN = Math.floor(10000000 + Math.random() * 90000000).toString();
  return cy.wrap(randomCIN);
});

/**
 * Force login by setting tokens directly in localStorage
 * Must be called BEFORE visiting any page to avoid redirects
 * The app uses Redux which reads from localStorage.user (object with role)
 */
Cypress.Commands.add("forceLogin", () => {
  cy.window().then((win) => {
    // Store token
    win.localStorage.setItem("token", "admin-mock-token");
    
    // Store user object with role (Redux reads from localStorage.user)
    const user = {
      id: 1,
      email: Cypress.env("adminEmail") || "admin@test.com",
      role: "admin", // RoleEnum.ADMIN value
      level: null,
    };
    win.localStorage.setItem("user", JSON.stringify(user));
  });

  // Ensuite seulement on visite une page (Home est la route par défaut)
  cy.visit("/");
});
