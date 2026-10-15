import jsPDF from 'jspdf';
import { Student } from '../types';
import { COLLEGE_INFO } from '../data/initialData';

export const generateStudentMarksheetPDF = (student: Student) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Outer Border
  doc.setDrawColor(30, 64, 175); // Royal blue
  doc.setLineWidth(0.8);
  doc.rect(8, 8, pageWidth - 16, doc.internal.pageSize.getHeight() - 16);

  // Inner subtle border
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.rect(10, 10, pageWidth - 20, doc.internal.pageSize.getHeight() - 20);

  // College Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 35, 75);
  doc.text(COLLEGE_INFO.name, pageWidth / 2, 20, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(COLLEGE_INFO.tagline, pageWidth / 2, 25, { align: 'center' });
  doc.text(COLLEGE_INFO.address, pageWidth / 2, 29, { align: 'center' });

  // Divider Line
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(0.5);
  doc.line(14, 33, pageWidth - 14, 33);

  // Report Title Badge
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(pageWidth / 2 - 50, 36, 100, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 64, 175);
  doc.text('CONTINUOUS INTERNAL ASSESSMENT MARKSHEET', pageWidth / 2, 41.5, { align: 'center' });

  // Student Particulars Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 48, pageWidth - 28, 28, 1, 1, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 48, pageWidth - 28, 28, 1, 1, 'D');

  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);

  // Column 1
  doc.setFont('helvetica', 'bold');
  doc.text('Student Name:', 18, 54);
  doc.setFont('helvetica', 'normal');
  doc.text(student.name, 45, 54);

  doc.setFont('helvetica', 'bold');
  doc.text('Register No:', 18, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(student.regNo, 45, 60);

  doc.setFont('helvetica', 'bold');
  doc.text('Roll No:', 18, 66);
  doc.setFont('helvetica', 'normal');
  doc.text(student.rollNo, 45, 66);

  doc.setFont('helvetica', 'bold');
  doc.text('Branch / Sec:', 18, 72);
  doc.setFont('helvetica', 'normal');
  doc.text(`CSE / Sec ${student.section}`, 45, 72);

  // Column 2
  doc.setFont('helvetica', 'bold');
  doc.text('Degree / Dept:', 105, 54);
  doc.setFont('helvetica', 'normal');
  doc.text(student.department, 134, 54);

  doc.setFont('helvetica', 'bold');
  doc.text('Year / Semester:', 105, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(`III Year / Semester VI`, 134, 60);

  doc.setFont('helvetica', 'bold');
  doc.text('Class Advisor:', 105, 66);
  doc.setFont('helvetica', 'normal');
  doc.text(`Prof. ${student.advisorName}`, 134, 66);

  doc.setFont('helvetica', 'bold');
  doc.text('Head of Dept:', 105, 72);
  doc.setFont('helvetica', 'normal');
  doc.text(`Dr. ${student.hodName}`, 134, 72);

  // Table Header
  let startY = 82;
  doc.setFillColor(30, 64, 175);
  doc.rect(14, startY, pageWidth - 28, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);

  doc.text('Code', 17, startY + 5.5);
  doc.text('Course Title', 36, startY + 5.5);
  doc.text('IAT-1 (50)', 105, startY + 5.5);
  doc.text('IAT-2 (50)', 124, startY + 5.5);
  doc.text('Model (100)', 143, startY + 5.5);
  doc.text('Asgn (20)', 166, startY + 5.5);
  doc.text('Total (40)', 182, startY + 5.5);

  // Table Body
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8);

  startY += 8;
  student.internalMarks.forEach((mark, index) => {
    const rowY = startY + index * 8;
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, rowY, pageWidth - 28, 8, 'F');
    }
    doc.setDrawColor(226, 232, 240);
    doc.line(14, rowY + 8, pageWidth - 14, rowY + 8);

    doc.text(mark.subjectCode, 17, rowY + 5.5);
    // Truncate course name if needed
    const truncatedName = mark.subjectName.length > 34 ? mark.subjectName.substring(0, 32) + '...' : mark.subjectName;
    doc.text(truncatedName, 36, rowY + 5.5);
    doc.text(String(mark.iat1), 110, rowY + 5.5);
    doc.text(String(mark.iat2), 129, rowY + 5.5);
    doc.text(String(mark.modelExam), 149, rowY + 5.5);
    doc.text(String(mark.assignmentMark), 170, rowY + 5.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`${mark.totalInternal} (${mark.grade})`, 183, rowY + 5.5);
    doc.setFont('helvetica', 'normal');
  });

  const marksTableEndY = startY + student.internalMarks.length * 8 + 6;

  // Attendance & Academic Metrics Summary Cards
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, marksTableEndY, (pageWidth - 32) / 3, 20, 1.5, 1.5, 'F');
  doc.roundedRect(14 + (pageWidth - 32) / 3 + 2, marksTableEndY, (pageWidth - 32) / 3, 20, 1.5, 1.5, 'F');
  doc.roundedRect(14 + ((pageWidth - 32) / 3) * 2 + 4, marksTableEndY, (pageWidth - 32) / 3, 20, 1.5, 1.5, 'F');

  // Card 1: Attendance
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('OVERALL ATTENDANCE', 18, marksTableEndY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(student.overallAttendance >= 75 ? 22 : 220, student.overallAttendance >= 75 ? 101 : 38, student.overallAttendance >= 75 ? 52 : 38);
  doc.text(`${student.overallAttendance}%`, 18, marksTableEndY + 14);
  doc.setFontSize(7);
  doc.text(student.overallAttendance >= 75 ? 'ELIGIBLE FOR EXAMS' : 'SHORTAGE ALERT (<75%)', 18, marksTableEndY + 18);

  // Card 2: Cumulative GPA
  const card2X = 14 + (pageWidth - 32) / 3 + 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('CUMULATIVE CGPA', card2X, marksTableEndY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 64, 175);
  doc.text(student.cgpa.toFixed(2), card2X, marksTableEndY + 14);
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(`Current Sem GPA: ${student.currentGpa.toFixed(2)}`, card2X, marksTableEndY + 18);

  // Card 3: Arrear Status
  const card3X = 14 + ((pageWidth - 32) / 3) * 2 + 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('STANDING ARREARS', card3X, marksTableEndY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(student.arrearsCount === 0 ? 22 : 220, student.arrearsCount === 0 ? 101 : 38, student.arrearsCount === 0 ? 52 : 38);
  doc.text(student.arrearsCount === 0 ? 'NIL (ALL CLEAR)' : `${student.arrearsCount} Subject(s)`, card3X, marksTableEndY + 14);
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('Result Status: Verified', card3X, marksTableEndY + 18);

  // Academic Remarks Section
  const remarksY = marksTableEndY + 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('FACULTY & ADVISOR COUNSELING REMARKS:', 14, remarksY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  let currentRemarkY = remarksY + 5;
  student.remarks.slice(0, 2).forEach(rem => {
    doc.setTextColor(71, 85, 105);
    doc.text(`* [${rem.date}] - ${rem.authorName} (${rem.authorRole}):`, 14, currentRemarkY);
    currentRemarkY += 4;
    doc.setTextColor(15, 23, 42);
    const splitText = doc.splitTextToSize(rem.remark, pageWidth - 32);
    doc.text(splitText, 18, currentRemarkY);
    currentRemarkY += splitText.length * 4;
  });

  // Footer Signatures
  const footerY = doc.internal.pageSize.getHeight() - 26;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  doc.text('Student Signature', 20, footerY + 12);
  doc.text(`Prof. ${student.advisorName}\nClass Advisor`, pageWidth / 2 - 15, footerY + 8, { align: 'center' });
  doc.text(`Dr. ${student.hodName}\nHead of the Department`, pageWidth - 35, footerY + 8, { align: 'center' });

  // Timestamp
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')} via Info Institute of Engineering Academic Portal`, pageWidth / 2, doc.internal.pageSize.getHeight() - 11, { align: 'center' });

  // Save the PDF
  doc.save(`IIE_${student.regNo}_Marksheet.pdf`);
};

export const generateDepartmentSummaryPDF = (students: Student[], hodName: string) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Border
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(0.8);
  doc.rect(8, 8, pageWidth - 16, doc.internal.pageSize.getHeight() - 16);

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 35, 75);
  doc.text(COLLEGE_INFO.name, pageWidth / 2, 18, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`${COLLEGE_INFO.department} | ${COLLEGE_INFO.address}`, pageWidth / 2, 23, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 64, 175);
  doc.text('CONSOLIDATED CLASS ACADEMIC & ATTENDANCE PERFORMANCE REPORT', pageWidth / 2, 30, { align: 'center' });

  // Table Header
  let startY = 38;
  doc.setFillColor(30, 64, 175);
  doc.rect(14, startY, pageWidth - 28, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);

  doc.text('S.No', 16, startY + 5.5);
  doc.text('Reg Number', 28, startY + 5.5);
  doc.text('Roll No', 56, startY + 5.5);
  doc.text('Student Name', 80, startY + 5.5);
  doc.text('Class Advisor', 140, startY + 5.5);
  doc.text('Attendance %', 180, startY + 5.5);
  doc.text('Current GPA', 215, startY + 5.5);
  doc.text('CGPA', 245, startY + 5.5);
  doc.text('Arrears', 265, startY + 5.5);

  // Table Rows
  startY += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  students.forEach((s, idx) => {
    const rowY = startY + idx * 7.5;
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, rowY, pageWidth - 28, 7.5, 'F');
    }
    doc.setDrawColor(226, 232, 240);
    doc.line(14, rowY + 7.5, pageWidth - 14, rowY + 7.5);

    doc.setTextColor(15, 23, 42);
    doc.text(String(idx + 1), 16, rowY + 5);
    doc.text(s.regNo, 28, rowY + 5);
    doc.text(s.rollNo, 56, rowY + 5);
    doc.text(s.name, 80, rowY + 5);
    doc.text(`Prof. ${s.advisorName}`, 140, rowY + 5);

    // Color attendance
    if (s.overallAttendance < 75) {
      doc.setTextColor(220, 38, 38);
      doc.setFont('helvetica', 'bold');
      doc.text(`${s.overallAttendance}% (Alert)`, 180, rowY + 5);
      doc.setFont('helvetica', 'normal');
    } else {
      doc.setTextColor(22, 101, 52);
      doc.text(`${s.overallAttendance}%`, 180, rowY + 5);
    }

    doc.setTextColor(15, 23, 42);
    doc.text(s.currentGpa.toFixed(2), 215, rowY + 5);
    doc.text(s.cgpa.toFixed(2), 245, rowY + 5);
    
    if (s.arrearsCount > 0) {
      doc.setTextColor(220, 38, 38);
      doc.text(`${s.arrearsCount} Arrear`, 265, rowY + 5);
    } else {
      doc.setTextColor(22, 101, 52);
      doc.text('Nil', 265, rowY + 5);
    }
  });

  // Footer Signatures
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Class Advisor Verification', 30, footerY);
  doc.text(`Approved by: Dr. ${hodName} (HOD - CSE)`, pageWidth - 90, footerY);

  doc.save(`IIE_Department_CSE_Consolidated_Report.pdf`);
};
