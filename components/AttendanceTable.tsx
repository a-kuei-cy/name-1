
import React from 'react';
import { Student, AttendanceStatus } from '../types';
import StudentRow from './StudentRow';

interface AttendanceTableProps {
  students: Student[];
  onStatusChange: (studentId: number, newStatus: AttendanceStatus) => void;
  onDeleteStudent: (studentId: number) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ students, onStatusChange, onDeleteStudent }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold text-slate-700">班級</th>
              <th scope="col" className="px-6 py-4 font-semibold text-slate-700">姓名</th>
              <th scope="col" className="px-6 py-4 font-semibold text-slate-700 text-center">簽到狀態</th>
              <th scope="col" className="px-6 py-4 font-semibold text-slate-700 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  onStatusChange={onStatusChange}
                  onDelete={onDeleteStudent}
                />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-10 text-slate-500">
                  尚未新增任何學生
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
