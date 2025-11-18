
import React from 'react';
import { Student, AttendanceStatus } from '../types';

interface StudentRowProps {
  student: Student;
  onStatusChange: (studentId: number, newStatus: AttendanceStatus) => void;
  onDelete: (studentId: number) => void;
}

const statusConfig = {
    [AttendanceStatus.ON_TIME]: {
        bg: 'bg-green-100',
        button: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
        text: '準時'
    },
    [AttendanceStatus.LATE]: {
        bg: 'bg-yellow-100',
        button: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
        text: '遲到'
    },
    [AttendanceStatus.ABSENT]: {
        bg: 'bg-red-100',
        button: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
        text: '請假'
    }
};


const StudentRow: React.FC<StudentRowProps> = ({ student, onStatusChange, onDelete }) => {
  const { bg } = statusConfig[student.status];

  const getButtonClass = (status: AttendanceStatus) => {
    const isActive = student.status === status;
    return `px-4 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      isActive
        ? `${statusConfig[status].button} text-white`
        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
    }`;
  };

  return (
    <tr className={`${bg} transition-colors duration-300 border-b border-slate-200 last:border-b-0`}>
      <td className="px-6 py-4 whitespace-nowrap text-slate-800">{student.className}</td>
      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{student.name}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => onStatusChange(student.id, AttendanceStatus.ON_TIME)}
            className={getButtonClass(AttendanceStatus.ON_TIME)}
            aria-pressed={student.status === AttendanceStatus.ON_TIME}
          >
            {statusConfig[AttendanceStatus.ON_TIME].text}
          </button>
          <button
            onClick={() => onStatusChange(student.id, AttendanceStatus.LATE)}
            className={getButtonClass(AttendanceStatus.LATE)}
            aria-pressed={student.status === AttendanceStatus.LATE}
          >
            {statusConfig[AttendanceStatus.LATE].text}
          </button>
          <button
            onClick={() => onStatusChange(student.id, AttendanceStatus.ABSENT)}
            className={getButtonClass(AttendanceStatus.ABSENT)}
            aria-pressed={student.status === AttendanceStatus.ABSENT}
          >
            {statusConfig[AttendanceStatus.ABSENT].text}
          </button>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <button
          onClick={() => onDelete(student.id)}
          className="text-slate-500 hover:text-red-600 transition-colors duration-150 ease-in-out"
          aria-label={`刪除學生 ${student.name}`}
          title={`刪除學生 ${student.name}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default StudentRow;
