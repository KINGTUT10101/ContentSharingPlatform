import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Comment from './Comment';
import { MemoryRouter } from 'react-router-dom';

// Mock axios
jest.mock('axios');

const timestampDate = new Date();
const month = timestampDate.toLocaleString('default', { month: 'long' });
const day = timestampDate.getDate();
const year = timestampDate.getFullYear();

const mockCommentData = {
  ccd: timestampDate.toISOString(),
  ucd: timestampDate.toISOString(),
  username: 'testuser',
  commenttext: 'this is a comment'
};

describe('Comment Component', () => {
  test('renders Comment component with mock data', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Comment CommentData={mockCommentData} />
      </MemoryRouter>
    );

    // Wait for the Link component to be rendered
    await waitFor(() => {
      expect(screen.getByText(`Member since: ${day} ${month} ${year}`)).toBeInTheDocument();
    });

    // Assert that other elements are present
    expect(screen.getByText(`- Posted: ${day} ${month} ${year}`)).toBeInTheDocument();
    expect(screen.getByText(mockCommentData.commenttext)).toBeInTheDocument();
    expect(screen.getByText(mockCommentData.username)).toBeInTheDocument();
  });
});
