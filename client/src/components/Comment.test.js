import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import Comment from './Comment';

// Mock axios
jest.mock('axios');

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const mockCommentData = {
  CommentID: 1,
  CommentText: 'This is a test comment',
  CreationDate: {
    day: 10,
    month: 11,
    year: 2022,
  },
  UserEmail: 'test@example.com',
}

const mockUserData = {
  Username: 'TestUser',
  CreationDate: {
    day: 5,
    month: 8,
    year: 2021,
  },
}

describe('Comment Component', () => {
  test('renders Comment component with mock data', async () => {
    axios.get.mockResolvedValueOnce({ data: mockCommentData })
    axios.get.mockResolvedValueOnce({ data: mockUserData })

    const { getByText } = render(<Comment CommentID={1} />)

    await waitFor(() => {
      expect(getByText(`Member since: ${mockUserData.CreationDate.day} ${monthNames[mockUserData.CreationDate.month - 1]} ${mockUserData.CreationDate.year}`)).toBeInTheDocument()
      expect(getByText(`${mockUserData.Username} - Posted: ${mockCommentData.CreationDate.day} ${monthNames[mockCommentData.CreationDate.month - 1]} ${mockCommentData.CreationDate.year}`)).toBeInTheDocument()
      expect(getByText(mockCommentData.CommentText)).toBeInTheDocument()
    })
  })
})
