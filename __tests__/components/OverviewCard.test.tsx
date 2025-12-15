import { render, screen } from '@testing-library/react';
import OverviewCard from '@/components/cards/OverviewCard';
import { render as customRender } from '../utils/test-utils';

describe('OverviewCard', () => {
  it('renders title and value', () => {
    customRender(<OverviewCard title="Total Nodes" value="42" />);
    expect(screen.getByText('Total Nodes')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders helper text when provided', () => {
    customRender(
      <OverviewCard
        title="Total Nodes"
        value="42"
        helper="10 online / 32 offline"
      />
    );
    expect(screen.getByText('10 online / 32 offline')).toBeInTheDocument();
  });

  it('renders subLabel when provided', () => {
    customRender(
      <OverviewCard
        title="Riskiest Node"
        value="123456"
        subLabel="3ft water level"
      />
    );
    expect(screen.getByText('3ft water level')).toBeInTheDocument();
  });

  it('renders trend with up direction', () => {
    customRender(
      <OverviewCard
        title="Water Level"
        value="10"
        trend={{ label: 'Increasing', direction: 'up' }}
      />
    );
    expect(screen.getByText('Increasing')).toBeInTheDocument();
  });

  it('renders trend with down direction', () => {
    customRender(
      <OverviewCard
        title="Water Level"
        value="10"
        trend={{ label: 'Decreasing', direction: 'down' }}
      />
    );
    expect(screen.getByText('Decreasing')).toBeInTheDocument();
  });

  it('renders trend with flat direction', () => {
    customRender(
      <OverviewCard
        title="Water Level"
        value="10"
        trend={{ label: 'Stable', direction: 'flat' }}
      />
    );
    expect(screen.getByText('Stable')).toBeInTheDocument();
  });

  it('does not render helper or subLabel when not provided', () => {
    customRender(<OverviewCard title="Test" value="100" />);
    expect(screen.queryByText(/online|offline/i)).not.toBeInTheDocument();
  });
});

