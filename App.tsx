
import React, { useState } from 'react';
import Header from './components/Header';
import AttendanceTable from './components/AttendanceTable';
import { Student, AttendanceStatus } from './types';

const App: React.FC = () => {
  const initialClassName = '軟體工程 B 班';
  const [classes, setClasses] = useState<Record<string, Student[]>>({
    [initialClassName]: [
      { id: 1, name: '王小明', status: AttendanceStatus.ON_TIME, className: initialClassName },
      { id: 2, name: '陳大文', status: AttendanceStatus.ON_TIME, className: initialClassName },
      { id: 3, name: '李美麗', status: AttendanceStatus.LATE, className: initialClassName },
      { id: 4, name: '張三', status: AttendanceStatus.ABSENT, className: initialClassName },
    ],
  });

  const [activeClass, setActiveClass] = useState(initialClassName);
  const [newClassName, setNewClassName] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [batchStudentNames, setBatchStudentNames] = useState('');

  const handleStatusChange = (studentId: number, newStatus: AttendanceStatus) => {
    const updatedStudents = (classes[activeClass] || []).map((student) =>
      student.id === studentId ? { ...student, status: newStatus } : student
    );
    setClasses({ ...classes, [activeClass]: updatedStudents });
  };
  
  const getNextId = () => {
    const allStudents = Object.values(classes).flat();
    // Fix: Explicitly type `s` as `Student` to help TypeScript's type inference, which was failing and causing `s` to be typed as `unknown`.
    return allStudents.length > 0 ? Math.max(...allStudents.map((s: Student) => s.id)) + 1 : 1;
  }

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim() === '' || !activeClass) return;

    const newStudent: Student = {
      id: getNextId(),
      name: newStudentName.trim(),
      status: AttendanceStatus.ON_TIME,
      className: activeClass,
    };

    const updatedStudents = [...(classes[activeClass] || []), newStudent];
    setClasses({ ...classes, [activeClass]: updatedStudents });
    setNewStudentName('');
  };

  const handleAddNewClass = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedClassName = newClassName.trim();
    if (trimmedClassName && !classes[trimmedClassName]) {
      setClasses({ ...classes, [trimmedClassName]: [] });
      setActiveClass(trimmedClassName);
      setNewClassName('');
    }
  };

  const handleBatchImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (batchStudentNames.trim() === '' || !activeClass) return;

    const names = batchStudentNames.split('\n').map(name => name.trim()).filter(name => name !== '');
    let nextId = getNextId();
    
    const newStudents: Student[] = names.map(name => ({
      id: nextId++,
      name: name,
      status: AttendanceStatus.ON_TIME,
      className: activeClass,
    }));

    const updatedStudents = [...(classes[activeClass] || []), ...newStudents];
    setClasses({ ...classes, [activeClass]: updatedStudents });
    setBatchStudentNames('');
  };

  const handleExportCSV = () => {
    if (!activeClass || !classes[activeClass] || classes[activeClass].length === 0) {
      alert('目前班級沒有學生資料可匯出。');
      return;
    }

    const headers = ["班級", "姓名", "簽到狀態"];
    const rows = (classes[activeClass] || []).map(student => [
      student.className,
      student.name,
      student.status
    ]);

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Add BOM for Excel compatibility
    csvContent += headers.join(",") + "\n";

    rows.forEach(rowArray => {
      let row = rowArray.join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeClass}_簽到表.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteStudent = (studentId: number) => {
    if (!activeClass) return;
    const updatedStudents = (classes[activeClass] || []).filter(
      (student) => student.id !== studentId
    );
    setClasses({ ...classes, [activeClass]: updatedStudents });
  };

  const handleClearClass = () => {
    if (!activeClass || !window.confirm(`您確定要清除「${activeClass}」的所有學生資料嗎？此操作無法復原。`)) {
      return;
    }
    setClasses({ ...classes, [activeClass]: [] });
  };

  const handleDeleteClass = () => {
    const classNames = Object.keys(classes);
    if (classNames.length <= 1) {
      alert("無法刪除最後一個班級。");
      return;
    }
    if (!activeClass || !window.confirm(`您確定要刪除「${activeClass}」班級嗎？此操作將會刪除班級內所有學生資料，且無法復原。`)) {
      return;
    }

    const deletedIndex = classNames.findIndex(name => name === activeClass);

    // Use a more robust, immutable pattern to remove the class
    const { [activeClass]: _, ...newClasses } = classes;
    setClasses(newClasses);

    // Intelligently select the next active class for better UX
    const remainingClassNames = Object.keys(newClasses);
    if (remainingClassNames.length > 0) {
      // Select the class at the same index (which is now the next class) 
      // or the last class if the deleted one was the last.
      const newActiveIndex = Math.min(deletedIndex, remainingClassNames.length - 1);
      setActiveClass(remainingClassNames[newActiveIndex]);
    } else {
      setActiveClass(''); // Fallback, should not be reached
    }
  };

  const currentStudents = classes[activeClass] || [];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Header classNameValue={activeClass} />
      
      <div className="max-w-4xl mx-auto">
        {/* --- Class Management --- */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">班級管理</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Class Selector & Actions */}
            <div className="space-y-4">
              <div>
                <label htmlFor="class-select" className="block text-sm font-medium text-slate-700 mb-1">選擇班級</label>
                <select
                  id="class-select"
                  value={activeClass}
                  onChange={(e) => setActiveClass(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {Object.keys(classes).map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>
              <form onSubmit={handleAddNewClass} className="flex space-x-2">
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="輸入新班級名稱"
                  className="flex-grow mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out whitespace-nowrap">新增班級</button>
              </form>
              <div className="flex space-x-2">
                <button
                    onClick={handleClearClass}
                    disabled={currentStudents.length === 0}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                >
                    清除班級學生
                </button>
                 <button
                    onClick={handleDeleteClass}
                    disabled={Object.keys(classes).length <= 1}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                >
                    刪除班級
                </button>
              </div>
            </div>

            {/* Student Add Forms */}
            <div className="space-y-4">
              <form onSubmit={handleAddStudent} className="flex space-x-2">
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="輸入單一學生姓名"
                  className="flex-grow mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out whitespace-nowrap">新增學生</button>
              </form>
              <form onSubmit={handleBatchImport}>
                <textarea
                  value={batchStudentNames}
                  onChange={(e) => setBatchStudentNames(e.target.value)}
                  placeholder="批次輸入學生姓名，每行一位"
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                ></textarea>
                <button type="submit" className="mt-2 w-full px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition duration-150 ease-in-out">批次匯入</button>
              </form>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={handleExportCSV} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out">
              匯出 CSV
            </button>
          </div>
        </div>
        
        <AttendanceTable
          students={currentStudents}
          onStatusChange={handleStatusChange}
          onDeleteStudent={handleDeleteStudent}
        />
      </div>
    </div>
  );
};

export default App;
