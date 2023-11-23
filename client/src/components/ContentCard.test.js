import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';  // Import MemoryRouter
import ContentCard from './ContentCard';

jest.mock('axios')

const timestampDate = new Date ()
const month = timestampDate.toLocaleString('default', { month: 'long' });
const day = timestampDate.getDate();
const year = timestampDate.getFullYear();

const mockContentData = {
  ContentID: '1',
  Title: 'Sample Content',
  UpdatedDate: timestampDate.toISOString (),
  Description: 'Sample description',
  Downloads: 10000,
  Tags: ['Tag1', 'Tag2'],
  username: 'Username',
  avgRat: 0.5
}

describe('ContentCard Component', () => {
  test('renders ContentCard component with mock data', async () => {
    axios.get.mockResolvedValueOnce({ data: mockContentData })

    render(
      <MemoryRouter initialEntries={['/']}>
        <ContentCard ContentID="1" />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(mockContentData.Title)).toBeInTheDocument()
    })
    expect(screen.getByText(mockContentData.username)).toBeInTheDocument()
    expect(screen.getByText(mockContentData.Tags[0])).toBeInTheDocument()
    expect(screen.getByText(mockContentData.Tags[1])).toBeInTheDocument()
    expect(screen.getByText(mockContentData.Downloads.toLocaleString())).toBeInTheDocument()
    expect(
      screen.getByText(
        `Last Updated: ${day} ${month} ${year}`)).toBeInTheDocument()
  })
})
