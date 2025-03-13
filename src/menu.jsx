import React from "react";
import { Layout, Menu } from "antd";
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";

const { Header } = Layout;

const MenuBar = () => {
    const location = useLocation();
    const menuItems = [
        { key: "/home", label: <Link to="/home">Home</Link> },
        { key: "/users", label: <Link to="/users">Users</Link> }
    ];

  return (
    <Header style={{ display: 'flex' }}>
        <div className="logo" style={{ color: "white", fontSize: 20, fontWeight: "bold", marginRight: "20px" }}>
        MyApp
        </div>
        <Menu 
            theme="dark" 
            style={{ flexGrow: 1 }} 
            mode="horizontal" 
            selectedKeys={[location.pathname]}
            items={menuItems} />
    </Header>
  );
};

export default MenuBar;
