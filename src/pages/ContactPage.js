import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Formularz wysłany pomyślnie!');
    // submission logic
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Kontakt</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Imię</Form.Label>
          <Form.Control
            type="text"
            placeholder="Imię"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            type="email"
            placeholder="Adres e-mail"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formMessage">
          <Form.Label>Wiadomość</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            placeholder="Twoja wiadomość."
            name="message"
            value={formData.message}
            onChange={handleChange}
          />
        </Form.Group>

        <Button id='submit-button' variant="primary" type="submit" >
          Wyślij!
        </Button>
      </Form>
    </div>
  );
}

export default ContactPage;
