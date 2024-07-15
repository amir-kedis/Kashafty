import { useGetSectorCountsQuery } from "../../redux/slices/stat/stat.logistics.slice";

const SectorCountsTable = () => {
  const { data, error, isLoading } = useGetSectorCountsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <table className="simple-table-for-checkboxes">
      <thead>
        <tr>
          <th className="num-col">#</th>
          <th>اسم القطاع</th>
          <th>عدد الكشافة</th>
        </tr>
      </thead>
      <tbody>
        {data.sectorCounts.map((sector, index) => (
          <tr key={sector.sectorName}>
            <td className="num-col">{index + 1}</td>
            <td>{sector.sectorName}</td>
            <td>{sector.scoutCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SectorCountsTable;
