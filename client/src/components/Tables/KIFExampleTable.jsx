import DataTable from './DataTable';

const columns = [
  {
    name: 'ID',
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: 'Naziv',
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: 'Količina',
    selector: (row) => row.amount,
    sortable: true,
  },
  {
    name: 'Cijena',
    selector: (row) => row.price,
    sortable: true,
  },
  {
    name: 'Datum',
    selector: (row) => row.date,
    sortable: true,
  },
];

const fetchData = async ({ page, perPage, sortField, sortOrder }) => {
  try {
    const params = new URLSearchParams({
      page,
      perPage,
      ...(sortField && { sortField }),
      sortOrder: sortOrder || 'asc',
    });

    const res = await fetch(`http://localhost:10000/api/kif-data?${params}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const KifTable = () => {
  return <DataTable title="KIF Tabela" columns={columns} fetchData={fetchData} />;
};

export default KifTable;
