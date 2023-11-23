import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import ProfileCard from "./ProfileCard";

// Mock axios
jest.mock('axios');

const timestampDate = new Date ()
const month = timestampDate.toLocaleString('default', { month: 'long' });
const day = timestampDate.getDate();
const year = timestampDate.getFullYear();

const mockProfileData = {
  username: 'testuser',
  bio: 'This is a test bio',
  creationdate: timestampDate.toISOString ()
}

describe('ProfileCard Component', () => {
  test('renders ProfileCard component with mocked data', async () => {
    axios.get.mockResolvedValue({ data: mockProfileData })

    render(<ProfileCard Username="testuser" />)

    // Wait for data fetching to complete
    await waitFor(() => {
      // Ensure that the important data is rendered after fetching
      const usernameElement = screen.getByText(mockProfileData.username)
      expect(usernameElement).toBeInTheDocument()
    })
    const bioElement = screen.getByText('This is a test bio')
    expect(bioElement).toBeInTheDocument()
    expect(screen.getByText(`Member since: ${day} ${month} ${year}`)).toBeInTheDocument()
  })
})
