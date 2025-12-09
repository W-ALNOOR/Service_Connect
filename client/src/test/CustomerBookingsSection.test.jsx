import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CustomerBookingsSection from '../components/dashboard/CustomerBookingsSection';
import { vi } from 'vitest';

// Helper booking
const mockBooking = {
  _id: '123',
  service: 'svc1',
  provider: 'user1',
  status: 'pending',
  priceAtTime: 100,
  date: new Date('2025-01-01T12:00:00Z').toISOString(),
  notes: 'Initial notes',
  createdAt: new Date('2025-01-01T11:00:00Z').toISOString(),
};

describe('CustomerBookingsSection', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows empty state when there are no bookings', () => {
    render(
      <CustomerBookingsSection
        asCustomer={[]}
        setAsCustomer={() => {}}
        token={null}
        getUserLabel={() => ''}
        getServiceLabel={() => ''}
      />
    );

    expect(
      screen.getByText(/You have not booked any services yet./i)
    ).toBeInTheDocument();
  });

  it('shows an error if user tries to save without a token', async () => {
    render(
      <CustomerBookingsSection
        asCustomer={[mockBooking]}
        setAsCustomer={() => {}}
        token={null} // no token
        getUserLabel={() => 'Provider Name'}
        getServiceLabel={() => 'Service Name'}
      />
    );

    fireEvent.click(screen.getByText(/Edit/i));

    // Click Save while not logged in
    fireEvent.click(screen.getByText(/Save/i));

    // Error message should appear
    expect(
      await screen.findByText(/You must be logged in to edit a booking./i)
    ).toBeInTheDocument();
  });

  it('calls fetch and updates bookings on successful save', async () => {
    const setAsCustomerMock = vi.fn((updater) => updater([mockBooking]));

    const updatedBooking = {
      ...mockBooking,
      notes: 'Updated notes',
    };

    // Mock global fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ booking: updatedBooking }),
    });

    render(
      <CustomerBookingsSection
        asCustomer={[mockBooking]}
        setAsCustomer={setAsCustomerMock}
        token='valid-token'
        getUserLabel={() => 'Provider Name'}
        getServiceLabel={() => 'Service Name'}
      />
    );

    // Enter edit mode
    fireEvent.click(screen.getByText(/Edit/i));

    // Change notes
    const notesTextarea = screen.getByDisplayValue(/Initial notes/i);
    fireEvent.change(notesTextarea, { target: { value: 'Updated notes' } });

    // Click Save
    fireEvent.click(screen.getByText(/Save/i));

    // Assert fetch was called with correct URL and method
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `/api/bookings/${mockBooking._id}`,
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        }),
      })
    );

    // Assert setAsCustomer was called with updated booking
    await waitFor(() => {
      expect(setAsCustomerMock).toHaveBeenCalledTimes(1);
    });
  });

  it('shows error message when fetch fails', async () => {
    const setAsCustomerMock = vi.fn();

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Failed to update booking' }),
    });

    render(
      <CustomerBookingsSection
        asCustomer={[mockBooking]}
        setAsCustomer={setAsCustomerMock}
        token='valid-token'
        getUserLabel={() => 'Provider Name'}
        getServiceLabel={() => 'Service Name'}
      />
    );

    fireEvent.click(screen.getByText(/Edit/i));
    fireEvent.click(screen.getByText(/Save/i));

    expect(
      await screen.findByText(/Failed to update booking/i)
    ).toBeInTheDocument();

    // No state update should happen
    expect(setAsCustomerMock).not.toHaveBeenCalled();
  });
});
