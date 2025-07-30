import React from 'react';
import Table from './DataTable';

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
  const total = 25;
  const fullData = Array.from({ length: total }, (_, i) => {
    const id = i + 1;
    return {
      id,
      name: `Artikal ${id}`,
      amount: Math.floor(Math.random() * 100),
      price: `${(Math.random() * 100).toFixed(2)} KM`,
      date: `2025-07-${((id % 30) + 1).toString().padStart(2, '0')}`,
    };
  });

  if (sortField) {
    fullData.sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];
      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const start = (page - 1) * perPage;
  const paged = fullData.slice(start, start + perPage);

  return { data: paged, total };
};

const KifTable = () => {
  return <Table title="KIF Tabela" columns={columns} fetchData={fetchData} />;
};

export default KifTable;
