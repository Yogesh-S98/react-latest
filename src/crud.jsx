import React, { useEffect, useRef, useState } from "react";
import Table from "./agGrid";
import { Button, Modal, Spin } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Col, Form } from "react-bootstrap";
import { createUser, deleteUser, getList, updateUser } from "./service";
import { useLoading } from "./loader";
import { useNotification } from "./notification";

const userObj = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    isAdmin: false
};

function Crud() {
    const { showNotification } = useNotification();
    const [modal, contextHolder] = Modal.useModal();
    const [data, setData] = useState([]);
    const [userModel, setUserModel] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userForm, setUserForm] = useState(userObj);
    const [errors, setErrors] = useState(userObj);
    const [title, setTitle] = useState('');
    const { showLoading, hideLoading }= useLoading();
    const [pagination] = useState({
        current: 1,
        pageSize: 7,
        total: 0,
    });
    const [metaData, setMetaData] = useState({});

    const confirm = (row) => {
        modal.confirm({
            title: 'Are you sure delete this user?',
            icon: <DeleteOutlined style={{ color: 'red' }}/>,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            centered: true,
            okButtonProps: { loading: loading },
            onOk() {
                setLoading(true);
                deleteUser(row.id).then((res) => {
                    if (res) {
                        setLoading(false);
                        loadList();
                    }
                })
            },
            onCancel() {
                return true;
            }
        });
    };
    // const fetch = useRef(false);
    // useEffect(() => {
    //     // if (fetch.current) return;
    //     // fetch.current = true;
    //     loadList();
    // }, []);

    // const loadList() {
    //     getList().then((res) => {
    //         if (res) {
    //             setData(res.data?.data?.response);
    //         }
    //     })
    // }

    const loadList = async () => {
        showLoading();
        try {
            const page = {
                pageIndex: pagination.current - 1,
                pageSize: pagination.pageSize
            }
            // console.log('aaa', page);
            const res = await getList(page);
            if (res) {
                setData(res.data?.data?.response);
                const setPage = {
                    current: res.data?.data?.metaData.pageNumber + 1,
                    pageSize: res.data?.data?.metaData.pageSize,
                    total: res.data?.data?.metaData.totalRecords,
                };
                console.log('meta', setPage);
                setMetaData(setPage);
                hideLoading();
            }
        } catch (error) {
            hideLoading();
            console.error('Error fetching data:', error);
        }
    };
    // Use useEffect to call loadList when the component mounts
    useEffect(() => {
        loadList();
    }, []);
    
    
    const columns = [
        { title: "First Name", dataIndex: "firstName", key: 'firstName' },
        { title: "Last Name", dataIndex: 'lastName', key: 'lastName' },
        { title: "Email", dataIndex: "email", key: 'email' },
        { title: 'Phone Number', dataIndex: "phoneNumber", key: 'phoneNumber' },
        {
            title: "Actions",
            key: 'action',
            render: (row) => (
              <div className="text-left">
                <Button
                    variant="solid"
                    color="primary"
                    shape="circle"
                    onClick={() => handleEdit(row)}
                >
                  <EditOutlined />
                </Button>
                <Button
                    variant="solid"
                    color="danger"
                    shape="circle"
                    style={{ marginLeft: '10px' }}
                    onClick={() => handleDelete(row)}>
                  <DeleteOutlined />
                </Button>
              </div>
            )
          }
    ];

    const handleEdit = (row) => {
        setUserModel(true);
        setTitle('Update User');
        setUserForm(row);
        setErrors(userObj);
        console.log('dsfa', row);
    };
    
    const handleDelete = async (row) => {
        console.log('row', row);
        confirm(row);
    };

    const addUser = () => {
        setTitle('Create User');
        setErrors(userObj);
        setUserForm(userObj);
        setUserModel(true);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserForm({ ...userForm, [name]: value });
        setErrors({ ...errors, [name]: '' });
    }

    const submitForm = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!userForm.firstName) {
            newErrors.firstName = 'First name is required';
        }
        if (!userForm.lastName) {
            newErrors.lastName = 'Last name is required';
        }
        if (!userForm.phoneNumber) {
            newErrors.phoneNumber = "Phone number is required";
        }
        if (!userForm.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else if (userForm) {
            setLoading(true);
            if (userForm.id) {
                updateUser(userForm).then((res) => {
                    console.log('dd', res);
                    if (res) {
                        // successNotification(res?.data?.data?.message);
                        showNotification("success", '', res.data?.message);
                        setUserModel(false);
                        setLoading(false);
                        setErrors(userObj);
                        loadList();
                    }
                })
            } else {
                createUser(userForm).then((res) => {
                    console.log('ddfda', res);
                    if (res) {
                        showNotification("success", '', res.data?.message);
                        setUserModel(false);
                        setLoading(false);
                        setErrors(userObj);
                        loadList();
                    }
                })
                // .catch((error) => {
                //     showNotification("error", '', error?.message);
                // })
            }
        }
    }
    const actionFromTable = async (val) => {
        // setPagination(val);
        pagination.current = val.current;
        pagination.pageSize = val.pageSize;
        loadList();
    }

    return (
        <div className="p-5">
            <>
                <div className="p-2 d-flex justify-content-between">
                    <div>
                        <h3>Users</h3>
                    </div>
                    <Button variant="solid" color="primary" onClick={addUser}>Create User</Button>
                </div>
                <Table
                    pagination={metaData}
                    handleTable={actionFromTable}
                    columns={columns}
                    data={data}>
                </Table>
            </>
            <Modal
                title={title}
                open={userModel}
                onOk={submitForm}
                okText={userForm.id ? 'Update' : 'Create'}
                onCancel={() => setUserModel(false)}
                centered
                confirmLoading={loading}
                >
                <div>
                    <Form>
                        <Form.Group>
                            <div className="d-flex">
                                <Col className="p-2">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        name="firstName"
                                        value={userForm.firstName}
                                        isInvalid={!!errors.firstName}
                                        placeholder="Enter first name"
                                        onChange={(e) => handleChange(e)}
                                    ></Form.Control>
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.firstName}
                                    </Form.Control.Feedback>
                                </Col>
                                <Col className="p-2">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        name="lastName"
                                        value={userForm.lastName}
                                        isInvalid={!!errors.lastName}
                                        placeholder="Enter last name"
                                        onChange={(e) => handleChange(e)}
                                    ></Form.Control>
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.lastName}
                                    </Form.Control.Feedback>
                                </Col>
                            </div>
                            <div className="d-flex">
                                <Col className="p-2">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        name="email"
                                        type="email"
                                        value={userForm.email}
                                        isInvalid={!!errors.email}
                                        placeholder="Enter email"
                                        onChange={(e) => handleChange(e)}
                                    ></Form.Control>
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </Col>
                                <Col className="p-2">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        name="phoneNumber"
                                        type="number"
                                        value={userForm.phoneNumber}
                                        isInvalid={!!errors.phoneNumber}
                                        placeholder="Enter phonenumber"
                                        onChange={(e) => handleChange(e)}
                                    ></Form.Control>
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.phoneNumber}
                                    </Form.Control.Feedback>
                                </Col>
                            </div>
                        </Form.Group>
                    </Form>
                </div>
                {/* <div className="d-flex justify-content-end">
                    <Button color="danger" variant="solid" style={{ marginRight: '10px' }} onClick={() => setUserModel(false)}>Cancel</Button>
                    <Button color="primary" variant="solid" onClick={submitForm} type="submit">Submit</Button>
                </div> */}
            </Modal>
            {contextHolder}
        </div>
    )
}

export default Crud;