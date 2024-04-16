import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/o/i); // random letter
//   expect(linkElement).toBeInTheDocument();
// });

describe('TextField Component', () => {
  it('should allow entering a name', () => {
    render(<App />);
    const input = screen.getByTestId('name-input'); // register name input
    fireEvent.change(input, { target: { value: 'Paul' } });
    expect(input.value).toBe('Paul');
  });

});
