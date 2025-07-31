import { useEffect, useState, useMemo } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import makeCustomStyles from './DynamicTable.styles';

const DynamicTable = ({ title, columns, apiEndpoint }) => {
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const customStyles = useMemo(() => makeCustomStyles(), []);

    const containerStyle = {
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%',
    };

    const titleStyle = useMemo(
        () => ({
            marginBottom: '20px',
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--cui-primary)',
            fontFamily: "'Segoe UI', sans-serif",
        }),
        []
    );

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page,
                perPage,
                ...(sortField && { sortField }),
                sortOrder,
            });

            const res = await fetch(`${apiEndpoint}?${params.toString()}`);
            if (!res.ok) throw new Error(`Error ${res.status}`);

            const result = await res.json();
            setData(result.data);
            setTotalRows(result.total);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, perPage, sortField, sortOrder]);

    return (
        <div style={containerStyle}><Card className="my-4 shadow-sm border-0">
            <Card.Body>
                <Card.Title style={titleStyle}>{title}</Card.Title>
                <DataTable
                    columns={columns}
                    data={data}
                    progressPending={loading}
                    progressComponent={<Spinner animation="border" />}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    onChangeRowsPerPage={(newPerPage) => {
                        setPerPage(newPerPage);
                        setPage(1);
                    }}
                    onChangePage={(p) => setPage(p)}
                    onSort={(col, dir) => {
                        setSortField(col.sortField || col.selector?.name || col.selector);
                        setSortOrder(dir);
                    }}
                    sortServer
                    highlightOnHover
                    responsive
                    customStyles={customStyles}
                />
            </Card.Body>
        </Card>
        </div>

    );
};

export default DynamicTable;
