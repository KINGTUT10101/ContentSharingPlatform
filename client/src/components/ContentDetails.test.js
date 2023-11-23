import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import ContentDetails from './ContentDetails';

// Mock axios
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

describe('ContentDetails Component', () => {
  test('renders ContentDetails component with mock data', async () => {
    axios.get.mockResolvedValueOnce({ data: mockContentData })

    render(
      <MemoryRouter initialEntries={['/']}>
        <ContentDetails ContentID={1} />
      </MemoryRouter>
    )

    // Check if important values were still rendered
    await waitFor(() => {
      expect(screen.getByText(mockContentData.Title)).toBeInTheDocument()
    })
    expect(screen.getByText(mockContentData.username)).toBeInTheDocument()
    expect(screen.getByText(mockContentData.Description)).toBeInTheDocument()
    expect(screen.getByText(mockContentData.Tags[0])).toBeInTheDocument()
    expect(screen.getByText(mockContentData.Tags[1])).toBeInTheDocument()
    expect(screen.getByText(mockContentData.Downloads.toLocaleString())).toBeInTheDocument()
    expect(screen.getByText(`- Last updated: ${day} ${month} ${year}`)).toBeInTheDocument()
  })
})