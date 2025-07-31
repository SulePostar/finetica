import { Container, Row, Col } from 'react-bootstrap';
import { AppHeader, AppSidebar } from '../components/index';
import KIFExampleTable from '../components/Tables/KIFExampleTable';

const DefaultLayout = () => {
  return (
    <Container fluid className="min-vh-100 bg-light dark:bg-dark">
      <Row className="flex-nowrap">
        <Col xs="auto" className="p-0">
          <AppSidebar />
        </Col>
        <Col className="d-flex flex-column p-0">
          <AppHeader />
          <Container as="main" className="p-3 flex-grow-1">
            <KIFExampleTable />
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default DefaultLayout;
