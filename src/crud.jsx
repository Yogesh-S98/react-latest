import React, { useEffect, useRef, useState } from "react";
import Table from "./agGrid";
import { Button, Modal, Spin, Form, Row, Col, Input } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
// import { Col, Form } from "react-bootstrap";
import { createUser, deleteUser, getList, updateUser } from "./service";
import { useLoading } from "./loader";
import { useNotification } from "./notification";


function Crud() {
    const userObj = {
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        isAdmin: false
    };
    const [form] = Form.useForm();
    const [isEdited, setIsEdited] = useState(false);
    const { showNotification } = useNotification();
    const [modal, contextHolder] = Modal.useModal();
    const [data, setData] = useState([]);
    const [userModel, setUserModel] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [userForm, setUserForm] = useState(userObj);
    // const [errors, setErrors] = useState(userObj);
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
        form.setFieldsValue();
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

    const handleEdit = async (row) => {
        console.log('row', row);
        setUserModel(true);
        setIsEdited(false);
        setTitle('Update User');
        // await form.setFieldsValue(userObj);
        await form.setFieldsValue(userObj);
        await form.setFieldsValue(row);
        console.log('ddd', form.getFieldsValue(true));
        // setErrors(userObj);
    };
    
    const handleDelete = async (row) => {
        console.log('row', row);
        confirm(row);
    };

    const addUser = () => {
        setTitle('Create User');
        setIsEdited(true);
        form.resetFields();
        // setErrors(userObj);
        // setUserForm(userObj);
        setUserModel(true);
    }

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setUserForm({ ...userForm, [name]: value });
    //     setErrors({ ...errors, [name]: '' });
    // }

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const values = await form.validateFields();
            console.log('valid', values);
            console.log('dddd', form.getFieldsValue(true))
            setLoading(true);
            if (form.getFieldsValue(true).id) {
                updateUser(form.getFieldsValue(true)).then((res) => {
                    console.log('dd', res);
                    if (res) {
                        // successNotification(res?.data?.data?.message);
                        showNotification("success", '', res.data?.message);
                        setUserModel(false);
                        setLoading(false);
                        // setErrors(userObj);
                        loadList();
                    }
                })
            } else {
                createUser(form.getFieldsValue(true)).then((res) => {
                    console.log('ddfda', res);
                    if (res) {
                        showNotification("success", '', res.data?.message);
                        setUserModel(false);
                        setLoading(false);
                        // setErrors(userObj);
                        loadList();
                    } else {
                        setLoading(false);
                    }
                })
            }
        } catch (error) {
            console.log('error', error);
        }
    }
    const actionFromTable = async (val) => {
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
                okText={form.getFieldsValue(true).id ? 'Update' : 'Create'}
                onCancel={() => setUserModel(false)}
                centered
                footer={null}
                >
                <div>
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={userObj}
                        onValuesChange={() => setIsEdited(true)}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="First Name"
                                    name="firstName"
                                    rules={[{
                                        required: true,
                                        message: 'First name is required'
                                    }]}>
                                    <Input></Input>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item
                                    label="Last Name"
                                    name="lastName"
                                    rules={[{
                                        required: true,
                                        message: 'Last name is required'
                                    }]}>
                                    <Input></Input>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[{
                                        required: true,
                                        message: 'Email is required'
                                    }]}>
                                    <Input></Input>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item
                                    label="Phone number"
                                    name="phoneNumber"
                                    rules={[{
                                        required: true,
                                        message: 'Phone number is required'
                                    }]}>
                                    <Input></Input>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="d-flex justify-content-end">
                    <Button color="danger" variant="solid" style={{ marginRight: '10px' }} onClick={() => setUserModel(false)}>Cancel</Button>
                    <Button color="primary" disabled={!isEdited} loading={loading} variant="solid" onClick={submitForm} type="submit">
                        {form.getFieldsValue(true).id ? 'Update' : 'Submit'}
                    </Button>
                </div>
            </Modal>
            {contextHolder}
        </div>
    )
}

export default Crud;