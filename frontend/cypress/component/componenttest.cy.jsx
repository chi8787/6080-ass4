import React from 'react';
import { mount } from '@cypress/react';
import Login from './Login';

describe('Login Component', () => {
  it('renders login form', () => {
    mount(<Login />);
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button').contains('Login').should('exist');
  });

  it('allows inputs', () => {
    mount(<Login />);
    cy.get('input[name="email"]').type('test@example.com').should('have.value', 'test@example.com');
    cy.get('input[name="password"]').type('password').should('have.value', 'password');
  });
});
