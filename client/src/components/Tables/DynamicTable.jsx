import { useEffect, useState } from 'react';
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import api from '../../services/api';
import './DynamicTable.css';
import makeCustomStyles from './DynamicTable.styles';

const DynamicTable = ({
    title,
    columns,
    apiEndpoint,
    onRowClick,
    uploadButton,
    reloadTable,
    onRefetch,
}) => {
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [isMobile, setIsMobile] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                perPage,
                ...(sortField && { sortField }),
                sortOrder,
            };
            const res = await api.get(apiEndpoint, { params });
            setData(res.data.data);
            setTotalRows(res.data.total);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (onRefetch) onRefetch(fetchData);
    }, [onRefetch]);

    useEffect(() => {
        fetchData();
    }, [page, perPage, sortField, sortOrder, reloadTable]);

    // Detect mobile
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getCellValue = (col, row) => {
        if (typeof col.cell === 'function') {
            return col.cell(row);
        }
        if (typeof col.selector === 'function') {
            return col.selector(row);
        }
        if (typeof col.selector === 'string') {
            return row[col.selector];
        }
        return '';
    };

    return (
        <Container fluid="xxl" className="dynamic-table-container">
            <Card className='border-0'>
                <Card.Body>
                    <Row className="align-items-center mb-3">
                        <Col className="d-flex justify-content-between flex-wrap">
                            <Card.Title className="dynamic-table-title">{title}</Card.Title>
                            {uploadButton && <div className="ms-3">{uploadButton}</div>}
                        </Col>
                    </Row>

                    {isMobile ? (
                        <div className="stacked-table">
                            {data.map((row, rowIndex) => (
                                <Card className="mb-3 stacked-row" key={rowIndex}>
                                    <Card.Body>
                                        {columns.map((col, colIndex) => (
                                            <div key={colIndex} className="stacked-cell">
                                                <div className="fw-bold stacked-label">{col.name}</div>
                                                <div className="stacked-value">{getCellValue(col, row)}</div>
                                            </div>
                                        ))}
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={data}
                            progressPending={loading}
                            customStyles={makeCustomStyles()}
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
                            onRowClicked={onRowClick}
                            sortServer
                            highlightOnHover
                            pointerOnHover
                            responsive
                        />
                    )}

                </Card.Body>
            </Card>
        </Container>
    );
};

export default DynamicTable;
