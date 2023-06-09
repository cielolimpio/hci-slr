import { Paper } from "../scopus/models";

interface PaperTableProps {
  papers: Paper[];
}

export default function PaperTable({ papers }: PaperTableProps) {
  return (
    <table className="min-w-full divide-y divide-darkgray divide table-fixed">
      <thead className="bg-gray-50">
        <tr className="w-full">
          <th scope="col" className="px-6 py-3 text-left text-md font-medium text-darkgray uppercase tracking-wider">
            Index
          </th>
          <th scope="col" className="px-6 py-3 text-left text-md font-medium text-darkgray uppercase tracking-wider">
            Document Title
          </th>
          <th scope="col" className="px-6 py-3 w-40 text-left text-md font-medium text-darkgray uppercase tracking-wider">
            Author
          </th>
          <th scope="col" className="px-6 py-3 text-left text-md font-medium text-darkgray uppercase tracking-wider">
            Year
          </th>
          <th scope="col" className="px-6 py-3 w-1/3 text-left text-md font-medium text-darkgray uppercase tracking-wider">
            Source
          </th>
        </tr>
      </thead>
      <tbody className="w-full bg-white divide-y divide-darkgray">
        {
          papers.map((paper, index) => (
            (
              <tr className="w-full" key={index}>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{index + 1}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{paper.title}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{paper.authorName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{paper.publicationYear}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{paper.source}</div>
                </td>
              </tr>
            )
          ))
        }
      </tbody>
    </table>
  );
}