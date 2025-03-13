import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Form } from 'react-bootstrap';
import { useState } from 'react';
import { login } from './service';
import { Route, Routes } from 'react-router-dom';
import { Protect, UnProtect } from './Protect';
import Crud from './crud';
import FullScreenLoader from './loaderSpin';
import { LoadingProvider } from './loader';
import { NotificationProvider } from './notification';
import MenuBar from './menu';
import { Layout } from 'antd';

const { Content } = Layout;

function App() {
  return (
    <div className='App'>
      <Layout>
        { localStorage.getItem('token') ?
          <MenuBar></MenuBar> : ''
        }
        <Content>
          <LoadingProvider>
            <NotificationProvider>
              <FullScreenLoader/>
                  <Routes>
                    <Route path='/' element={
                      <UnProtect>
                        <Login></Login>
                      </UnProtect>
                      }>
                    </Route>
                    <Route path='/home' element={
                      <Protect>
                        <NewHome></NewHome>
                      </Protect>
                      }>
                    </Route>
                    <Route path='/users' element={
                      <Protect>
                        <Crud></Crud>
                      </Protect>
                      }>
                    </Route>
                  </Routes>
            </NotificationProvider>
          </LoadingProvider>
        </Content>
      </Layout>
    </div>
  );
}


function NewHome() {
  return (
    <div className='App-header'>
      Welcome to Myapp
    </div>
  )
}

function Login() {
  const formObj = {
    email: '',
    password: ''
  }
  const [formData, setFormData] = useState(formObj);
  const [errors, setErrors] = useState(formObj);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  }
  const submit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const result = await login(formData);
      console.log('result', result.data);
      if (result.data.token) {
        localStorage.setItem('token', result.data.token);
        if (localStorage.getItem('token')) {
          window.location.href = '/home';
        }
      } else {
        setErrors({ email: 'Invalid email or password' });
      }
    }
  }
  return (
    <div className='App-header'>
      <h2>Login</h2>
      <Col lg={5} md={10} sm={10} xs={10}>
        <Form className='form' onSubmit={submit}>
          <Form.Group controlId='email'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='text'
              name='email'
              value={formData.email}
              isInvalid={!!errors.email}
              onChange={(e) => handleChange(e)}
              placeholder='Enter your email' />
              <Form.Control.Feedback type='invalid'>
                {errors.email}
              </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              name='password' 
              value={formData.password} 
              isInvalid={!!errors.password}
              onChange={(e) => handleChange(e)}
              placeholder='Enter your password' />
              <Form.Control.Feedback type='invalid'>
                {errors.password}
              </Form.Control.Feedback>
          </Form.Group>
          <Button className='mt-3' variant='primary' type='submit'>Submit</Button>
        </Form>
      </Col>
    </div>
  );
}

export default App;
