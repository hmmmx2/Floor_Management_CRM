// Mock Next.js server modules before imports
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: jest.fn().mockResolvedValue(data),
      status: init?.status || 200,
      ...data,
    })),
  },
}));

jest.mock('@/lib/mongodb', () => ({
  connectToDatabase: jest.fn(),
}));

import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

// Import after mocks
const { GET } = require('@/app/api/nodes/route');

describe('/api/nodes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns nodes data successfully', async () => {
    const mockNodes = [
      {
        _id: { toString: () => '123' },
        node_id: '102782478',
        latitude: 1.531427,
        longitude: 110.357783,
        current_level: 0,
        is_dead: false,
        last_updated: new Date('2025-12-01T12:07:19.857Z'),
        created_at: new Date('2025-11-24T06:36:00.369Z'),
      },
    ];

    (connectToDatabase as jest.Mock).mockResolvedValue({
      db: {
        collection: jest.fn(() => ({
          find: jest.fn(() => ({
            sort: jest.fn(() => ({
              toArray: jest.fn().mockResolvedValue(mockNodes),
            })),
          })),
        })),
      },
    });

    const response = await GET();
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(1);
    expect(data.data[0].node_id).toBe('102782478');
    expect(data.count).toBe(1);
  });

  it('handles database connection errors', async () => {
    (connectToDatabase as jest.Mock).mockRejectedValue(
      new Error('Database connection failed')
    );

    const response = await GET();
    const data = await response.json();

    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to fetch nodes data');
  });

  it('transforms MongoDB documents correctly', async () => {
    const mockNodes = [
      {
        _id: { toString: () => '123' },
        node_id: '102782478',
        latitude: 1.531427,
        longitude: 110.357783,
        current_level: 2,
        is_dead: false,
        last_updated: new Date('2025-12-01T12:07:19.857Z'),
        created_at: new Date('2025-11-24T06:36:00.369Z'),
      },
    ];

    (connectToDatabase as jest.Mock).mockResolvedValue({
      db: {
        collection: jest.fn(() => ({
          find: jest.fn(() => ({
            sort: jest.fn(() => ({
              toArray: jest.fn().mockResolvedValue(mockNodes),
            })),
          })),
        })),
      },
    });

    const response = await GET();
    const data = await response.json();

    expect(data.data[0]).toMatchObject({
      _id: '123',
      node_id: '102782478',
      latitude: 1.531427,
      longitude: 110.357783,
      current_level: 2,
      is_dead: false,
    });
  });

  it('returns empty array when no nodes found', async () => {
    (connectToDatabase as jest.Mock).mockResolvedValue({
      db: {
        collection: jest.fn(() => ({
          find: jest.fn(() => ({
            sort: jest.fn(() => ({
              toArray: jest.fn().mockResolvedValue([]),
            })),
          })),
        })),
      },
    });

    const response = await GET();
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.data).toEqual([]);
    expect(data.count).toBe(0);
  });
});
