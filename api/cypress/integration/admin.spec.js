describe('Admin Login Flow', () => {
    it('redirects to login when not authenticated', () => {
      cy.visit('/admin/dashboard');
      cy.url().should('include', '/admin/login');
    });
  
    it('logs in with valid credentials', () => {
      cy.visit('/admin/login');
      cy.get('input[placeholder="Email"]').type('admin@example.com');
      cy.get('input[placeholder="Password"]').type('password123');
      cy.get('button').contains('Login').click();
      cy.url().should('include', '/admin/dashboard');
    });
  });
  