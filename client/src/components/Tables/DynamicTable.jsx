import { useEffect, useMemo, useState } from 'react';
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import api from '../../services/api';
import './DynamicTable.css';
import makeCustomStyles from './DynamicTable.styles';
import { useWindowWidth } from '../../hooks/useWindowWidth';

const BREAKPOINTS = { sm: 576, md: 768, lg: 992, xl: 1200 };

function getThresholdPx(col) {
  if (typeof col.hideBelow === 'number') return col.hideBelow; 
  if (typeof col.hideAtOrBelow === 'string') return BREAKPOINTS[col.hideAtOrBelow]; 
  return null;
}

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

  const width = useWindowWidth();
  const isMobile = width < BREAKPOINTS.md;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefetch]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, sortField, sortOrder, reloadTable]);

  const computedColumns = useMemo(() => {
    return columns.map((col) => {
      const threshold = getThresholdPx(col);
      const shouldHide = threshold != null && width <= threshold;
      return { ...col, omit: !isMobile && shouldHide };
    });
  }, [columns, width, isMobile]);

  const getCellValue = (col, row) => {
    if (typeof col.cell === 'function') return col.cell(row);
    if (typeof col.selector === 'function') return col.selector(row);
    if (typeof col.selector === 'string') return row[col.selector];
    return '';
  };

  return (
    <Container fluid="xxl" className="dynamic-table-container">
      <Card className="shadow-sm border-0">
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
              columns={computedColumns}
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
                const fieldFromSelector =
                  typeof col.selector === 'string' ? col.selector : null;
                setSortField(col.sortField || fieldFromSelector || null);
                setSortOrder(dir);
              }}
              onRowClicked={onRowClick}
              sortServer
              highlightOnHover
              pointerOnHover
              responsive
              dense
            />
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DynamicTable;
