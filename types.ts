
export enum AttendanceStatus {
  ON_TIME = '準時',
  LATE = '遲到',
  ABSENT = '請假',
}

export interface Student {
  id: number;
  name: string;
  status: AttendanceStatus;
  className: string;
}
