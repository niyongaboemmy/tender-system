import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { RiFileExcel2Fill } from "react-icons/ri";

interface ExportToExcelProps {
  fileData: any[];
  fileName: string;
  btnName?: string;
  className?: string;
  showIcon?: boolean;
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({
  fileData,
  fileName,
  btnName = "Excel",
  className = "flex items-center gap-1 px-2 py-1 pr-3 rounded text-green-700 bg-white border hover:text-white hover:bg-green-700 border-green-700 font-bold",
  showIcon = true,
}) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (apiData: any[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <button
      onClick={(e) => exportToCSV(fileData, fileName)}
      className={className}
    >
      {showIcon && (
        <div>
          <RiFileExcel2Fill className="text-xl" />
        </div>
      )}
      <div className="truncate">{btnName}</div>
    </button>
  );
};

export default React.memo(ExportToExcel);
