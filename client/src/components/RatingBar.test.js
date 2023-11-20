import React from 'react';
import { render, screen } from '@testing-library/react';
import RatingBar from './RatingBar';

describe('RatingBar Component', () => {
  test('renders RatingBar component with default props', () => {
    render(<RatingBar />)
    
    // Ensure the default version renders without errors
    const ratingBar = screen.getByTestId('rating-bar')
    expect(ratingBar).toBeInTheDocument()
  });

  test('renders RatingBar component with custom props', () => {
    render(<RatingBar fontSize="3rem" rating={75} />)
    
    // Ensure it renders with custom props
    const ratingBar = screen.getByTestId('rating-bar')
    expect(ratingBar).toBeInTheDocument()
  })
})
