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
      {/* Добавляем отступ сверху для всего контейнера */}
      <Row
        className="justify-content-center"
        style={{ height: '100vh', marginTop: '250px', marginLeft: '10px' }} // Добавлено marginTop
      >
        <Col md={8} className="text-center">
          <h1>Добро пожаловать в Cashback Service</h1>
          <p style={{ marginBottom: '20px' }}>Изучите доступные предложения с кешбэком.</p>
          <Link to="/cashbacks">
            <Button
              size="lg"
              style={{
                padding: '12px 20px',
                backgroundColor: '#ffeb3b', // Жёлтый фон
                color: '#000',               // Чёрный текст
                border: '1px solid #ffeb3b', // Граница такого же цвета
                borderRadius: '0 4px 4px 0', // Закругленные углы
                cursor: 'pointer',           // Курсор при наведении
                marginLeft: '-1px',          // Отрицательное отступление слева
                fontSize: '16px',            // Размер шрифта
                height: '50px',              // Высота кнопки
                transition: 'background-color 0.3s ease', // Плавный переход для фона
                marginTop: '15px',           // Отступ сверху от текста
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fbc02d'; // Темнее при наведении
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffeb3b'; // Вернуться к первоначальному цвету
              }}
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
