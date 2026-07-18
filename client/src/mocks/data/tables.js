import { TABLE_STATUS } from '../../constants/tableStatus';

export const MOCK_TABLES = [
  { id: 'T1', number: '1', capacity: 2, status: TABLE_STATUS.AVAILABLE },
  { id: 'T2', number: '2', capacity: 4, status: TABLE_STATUS.AVAILABLE },
  { id: 'T3', number: '3', capacity: 4, status: TABLE_STATUS.OCCUPIED },
  { id: 'T4', number: '4', capacity: 6, status: TABLE_STATUS.AVAILABLE },
  { id: 'T5', number: '5', capacity: 4, status: TABLE_STATUS.RESERVED },
  { id: 'T6', number: '6', capacity: 2, status: TABLE_STATUS.AVAILABLE },
  { id: 'T7', number: '7', capacity: 8, status: TABLE_STATUS.AVAILABLE },
  { id: 'T8', number: '8', capacity: 4, status: TABLE_STATUS.OCCUPIED },
  { id: 'T9', number: '9', capacity: 4, status: TABLE_STATUS.AVAILABLE },
];
