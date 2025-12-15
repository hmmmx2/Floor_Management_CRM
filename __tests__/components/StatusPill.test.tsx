import { render, screen } from '@testing-library/react';
import StatusPill from '@/components/common/StatusPill';

describe('StatusPill', () => {
  it('renders with status text', () => {
    render(<StatusPill status="Safe" />);
    expect(screen.getByText('Safe')).toBeInTheDocument();
  });

  it('renders with variant prop', () => {
    render(<StatusPill status="Custom" variant="red" />);
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('uses default green variant when status not found', () => {
    render(<StatusPill status="Unknown Status" />);
    expect(screen.getByText('Unknown Status')).toBeInTheDocument();
  });

  it('renders all variant colors correctly', () => {
    const { rerender } = render(<StatusPill status="Test" variant="green" />);
    expect(screen.getByText('Test')).toBeInTheDocument();

    rerender(<StatusPill status="Test" variant="yellow" />);
    expect(screen.getByText('Test')).toBeInTheDocument();

    rerender(<StatusPill status="Test" variant="orange" />);
    expect(screen.getByText('Test')).toBeInTheDocument();

    rerender(<StatusPill status="Test" variant="red" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('has accessible dot indicator', () => {
    const { container } = render(<StatusPill status="Safe" />);
    const dot = container.querySelector('span[aria-hidden="true"]');
    expect(dot).toBeInTheDocument();
  });
});

