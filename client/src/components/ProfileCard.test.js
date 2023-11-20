import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import ProfileCard from "./ProfileCard";

// Mock axios
jest.mock('axios');

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const mockProfileData = {
  Username: 'testuser',
  Bio: 'This is a test bio',
  CreationDate: {
    day: 1,
    month: 1,
    year: 2022,
  },
}

describe('ProfileCard Component', () => {
  test('renders ProfileCard component with mocked data', async () => {
    axios.get.mockResolvedValue({ data: mockProfileData })

    render(<ProfileCard Username="testuser" />)

    // Wait for data fetching to complete
    await waitFor(() => {
      // Ensure that the important data is rendered after fetching
      const usernameElement = screen.getByText('testuser')
      expect(usernameElement).toBeInTheDocument()
    })
    const bioElement = screen.getByText('This is a test bio')
    expect(bioElement).toBeInTheDocument()
    expect(screen.getByText(`Member since: ${mockProfileData.CreationDate.day} ${monthNames[mockProfileData.CreationDate.month - 1]} ${mockProfileData.CreationDate.year}`)).toBeInTheDocument()
  })
})
