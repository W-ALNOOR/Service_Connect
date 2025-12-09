import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import DashboardSummarySection from '../components/dashboard/DashboardSummarySection';

// Mock SummaryCard so we can easily assert label + value output
vi.mock('./SummaryCard.jsx', () => ({
  default: ({ label, value }) => (
    <div data-testid='summary-card'>
      <span>{label}</span>:<span>{value}</span>
    </div>
  ),
}));

describe('DashboardSummarySection', () => {
  const baseProps = {
    loadingBookings: false,
    loadingServices: false,
    totalBookings: 10,
    bookingsSummary: null,
    asCustomer: [{ _id: '1' }, { _id: '2' }],
    asProvider: [{ _id: '3' }],
    pendingCount: 2,
    acceptedCount: 3,
    completedCount: 4,
    cancelledCount: 1,
    rejectedCount: 0,
    providerRevenue: 123.45,
    myServicesCount: 5,
  };

  it('returns null when loadingBookings or loadingServices is true', () => {
    const { container: c1 } = render(
      <DashboardSummarySection
        {...baseProps}
        loadingBookings={true}
        loadingServices={false}
      />
    );
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(
      <DashboardSummarySection
        {...baseProps}
        loadingBookings={false}
        loadingServices={true}
      />
    );
    expect(c2.firstChild).toBeNull();
  });

  it('renders all summary cards with correct values (fallback to asCustomer/asProvider lengths)', () => {
    render(<DashboardSummarySection {...baseProps} />);

    expect(screen.getByText(/Total Bookings/i).nextSibling.textContent).toBe(
      String(baseProps.totalBookings)
    );

    // Fallbacks because bookingsSummary is null
    expect(screen.getByText(/As Customer/i).nextSibling.textContent).toBe(
      String(baseProps.asCustomer.length)
    );
    expect(screen.getByText(/As Provider/i).nextSibling.textContent).toBe(
      String(baseProps.asProvider.length)
    );

    expect(screen.getByText(/Pending/i).nextSibling.textContent).toBe(
      String(baseProps.pendingCount)
    );
    expect(screen.getByText(/Accepted/i).nextSibling.textContent).toBe(
      String(baseProps.acceptedCount)
    );
    expect(screen.getByText(/Completed/i).nextSibling.textContent).toBe(
      String(baseProps.completedCount)
    );
    expect(screen.getByText(/Cancelled/i).nextSibling.textContent).toBe(
      String(baseProps.cancelledCount)
    );
    expect(screen.getByText(/Rejected/i).nextSibling.textContent).toBe(
      String(baseProps.rejectedCount)
    );

    expect(
      screen.getByText(/Provider Revenue \(Completed\)/i).nextSibling
        .textContent
    ).toBe(`$${baseProps.providerRevenue.toFixed(2)}`);

    expect(screen.getByText(/My Services/i).nextSibling.textContent).toBe(
      String(baseProps.myServicesCount)
    );
  });

  it('uses bookingsSummary counts when provided', () => {
    const propsWithSummary = {
      ...baseProps,
      bookingsSummary: {
        asCustomerCount: 99,
        asProviderCount: 77,
      },
      asCustomer: [{ _id: '1' }], // different from summary to prove override
      asProvider: [{ _id: '2' }],
    };

    render(<DashboardSummarySection {...propsWithSummary} />);

    expect(screen.getByText(/As Customer/i).nextSibling.textContent).toBe('99');
    expect(screen.getByText(/As Provider/i).nextSibling.textContent).toBe('77');
  });
});
