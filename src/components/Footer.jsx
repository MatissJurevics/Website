import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: '#0a0a0a',
            color: '#e4e4e4',
            padding: '80px 20px',
            fontSize: '0.9rem'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '40px'
            }}>
                <div>
                    <h4 className="uppercase" style={{ marginBottom: '20px', color: '#666' }}>Products</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <li><a href="#">OP-1 Field</a></li>
                        <li><a href="#">TX-6</a></li>
                        <li><a href="#">OP-Z</a></li>
                        <li><a href="#">Pocket Operators</a></li>
                        <li><a href="#">OD-11</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="uppercase" style={{ marginBottom: '20px', color: '#666' }}>Support</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <li><a href="#">Downloads</a></li>
                        <li><a href="#">Guides</a></li>
                        <li><a href="#">Warranty</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="uppercase" style={{ marginBottom: '20px', color: '#666' }}>Company</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Careers</a></li>
                    </ul>
                </div>

                <div style={{ minWidth: '300px' }}>
                    <h4 className="uppercase" style={{ marginBottom: '20px', color: '#ff4d00' }}>Newsletter</h4>
                    <p style={{ marginBottom: '20px', color: '#888' }}>
                        Sign up for the latest news, product releases, and exclusive offers.
                    </p>
                    <div style={{ display: 'flex', borderBottom: '1px solid #333' }}>
                        <input
                            type="email"
                            placeholder="email address"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                padding: '10px 0',
                                flex: 1,
                                outline: 'none'
                            }}
                        />
                        <button style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ff4d00',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            fontSize: '0.8rem'
                        }}>
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            <div style={{
                maxWidth: '1400px',
                margin: '80px auto 0',
                paddingTop: '40px',
                borderTop: '1px solid #222',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#444'
            }}>
                <div className="uppercase" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Teenage Engineering</div>
                <div className="mono" style={{ fontSize: '0.8rem' }}>© 2024</div>
            </div>
        </footer>
    );
};

export default Footer;
