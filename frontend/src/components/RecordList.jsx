import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import splashLogo from "../assets/images/splash-logo.png";



export default function RecordList() {
  const [records, setRecords] = useState([]);

  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5050/api/record/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const records = await response.json();
      setRecords(records);
    }
    getRecords();
    return;
  }, [records.length]);

  // This method will delete a record
  async function deleteRecord(id) {
    await fetch(`http://localhost:5050/api/record/${id}`, {
      method: "DELETE",
    });
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  // This method will map out the records on the table
  function recordList() {
    return records.map((record) => {
      return (
        <tr key={record._id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
          <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
            {record.level}
          </td>
          <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
            ${Number(record.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </td>
          <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
            <div className="flex justify-between items-start">
              <div>
                {record.response.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < record.response.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
              <img 
                src={splashLogo} 
                alt="Logo" 
                className="h-20 w-auto object-contain ml-4"
              />
            </div>
          </td>
          <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
            <div className="flex gap-2">
              <Link
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-sky-100 hover:bg-sky-200 h-9 rounded-md px-3"
                to={`/edit/${record._id}`}
              >
                Edit
              </Link>
              <button
                onClick={() => deleteRecord(record._id)}
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-sky-100 hover:bg-sky-200 hover:text-accent-foreground h-9 rounded-md px-3"
                type="button"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      );
    });
  }



  // This following section will display the table with the records of individuals.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Loan Requests</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Loan Type
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Loan Amount
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Bank Response
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {recordList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}