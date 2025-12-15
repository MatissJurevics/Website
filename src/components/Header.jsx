import React from 'react';
import '../styles/variables.css';

const Header = () => {
    const headerStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        mixBlendMode: 'difference', // Cool effect against white/black backgrounds
        color: '#fff',
        textTransform: 'uppercase',
        fontSize: '12px',
        letterSpacing: '0.1em',
        fontWeight: 600
    };

    const navStyle = {
        display: 'flex',
        gap: '30px'
    };

    return (
        <header style={headerStyle}>
            <div className="logo" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                te
            </div>

            <nav style={navStyle}>
                <a href="#products">Products</a>
                <a href="#about">Now</a>
                <a href="#store">Store</a>
            </nav>

            <div className="cart">
                Cart (0)
            </div>
        </header>
    );
};

export default Header;
