import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';  // Import MemoryRouter
import ContentCard from './ContentCard';

jest.mock('axios')

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

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
  AuthorUsername: 'Username',
}

describe('ContentCard Component', () => {
  test('renders ContentCard component with mock data', async () => {
    axios.get.mockResolvedValueOnce({ data: mockContentData })

    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <ContentCard ContentID="1" />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(getByText(mockContentData.Title)).toBeInTheDocument()
      expect(getByText(mockContentData.AuthorUsername)).toBeInTheDocument()
      expect(getByText(mockContentData.Tags[0])).toBeInTheDocument()
      expect(getByText(mockContentData.Tags[1])).toBeInTheDocument()
      expect(getByText(mockContentData.Downloads.toLocaleString())).toBeInTheDocument()
      expect(
        getByText(
          `Last Updated: ${mockContentData.UpdatedDate.day} ${
            monthNames[mockContentData.UpdatedDate.month - 1]
          } ${mockContentData.UpdatedDate.year}`
        )
      ).toBeInTheDocument()
    })
  })
})
