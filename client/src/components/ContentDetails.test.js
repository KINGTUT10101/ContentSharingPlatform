import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import ContentDetails from './ContentDetails';

// Mock axios
jest.mock('axios')

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const mockContentData = {
  ContentID: '1',
  Title: 'Sample Content',
  UpdatedDate: {
    day: 1,
    month: 1,
    year: 2023,
  },
  Description: 'Sample description',
  Downloads: 10000,
  Tags: ['Tag1', 'Tag2'],
}

describe('ContentDetails Component', () => {
  test('renders ContentDetails component with mock data', async () => {
    axios.get.mockResolvedValueOnce({ data: mockContentData })

    render(<ContentDetails ContentID={1} />)

    // Check if important values were still rendered
    await waitFor(() => {
      expect(screen.getByText(mockContentData.Title)).toBeInTheDocument()
    })
    expect(screen.getByText(mockContentData.Description)).toBeInTheDocument()
    expect(screen.getByText(mockContentData.Tags[0])).toBeInTheDocument()
    expect(screen.getByText(mockContentData.Tags[1])).toBeInTheDocument()
    expect(screen.getByText(mockContentData.Downloads.toLocaleString())).toBeInTheDocument()
    expect(screen.getByText(`Last updated: ${mockContentData.UpdatedDate.day} ${monthNames[mockContentData.UpdatedDate.month - 1]} ${mockContentData.UpdatedDate.year}`)).toBeInTheDocument()
  })
})