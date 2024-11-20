// src/pages/HomeCashback.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap';
import '../assets/style.css';

const HomeCashback: React.FC = () => {
  useEffect(() => {
    console.log('Компонент HomeCashback был смонтирован!');
  }, []);

  return (
    <Container className="home-container">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1>Добро пожаловать в Cashback Service</h1>
          <p>Изучите доступные предложения с кешбэком.</p>
          <Link to="/cashbacks">
            <Button 
              variant="warning" // Uses the warning variant which is yellow by default
              size="lg"
              style={{ marginTop: '20px', backgroundColor: '#ffeb3b', borderColor: '#ffeb3b' }} // Custom yellow color
            >
              Перейти к кешбэкам
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeCashback;


