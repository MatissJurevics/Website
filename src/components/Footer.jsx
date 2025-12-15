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
                    <h4 className="uppercase" style={{ marginBottom: '20px', color: '#666' }}>Socials</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <li><a href="https://instagram.com/matiss.j20">Instagram</a></li>
                        <li><a href="https://www.linkedin.com/in/matiss-jurevics-121162240/">LinkedIn</a></li>
                        <li><a href="https://github.com/MatissJurevics">GitHub</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="uppercase" style={{ marginBottom: '20px', color: '#666' }}>Contact</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <li><a href="mailto:im@mati.ss">im@mati.ss</a></li>
                    </ul>
                </div>

                <div style={{ minWidth: '300px' }}>
                    <h4 className="uppercase" style={{ marginBottom: '20px', color: '#ff4d00' }}>Stay Updated</h4>
                    <p style={{ marginBottom: '20px', color: '#888' }}>
                        Occasional updates on new projects and experiments.
                    </p>
                    <form
                        action="https://buttondown.com/api/emails/embed-subscribe/matiss"
                        method="post"
                        target="_blank"
                        style={{ display: 'flex', borderBottom: '1px solid #333' }}
                    >
                        <input
                            className="footer-input"
                            type="email"
                            name="email"
                            placeholder="email address"
                        />
                        <input type="hidden" value="1" name="embed" />
                        <button type="submit" style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ff4d00',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            fontSize: '0.8rem'
                        }}>
                            Subscribe
                        </button>
                    </form>
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
                <div className="uppercase" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Matiss Jurevics</div>
                <div className="mono" style={{ fontSize: '0.8rem' }}>© 2024</div>
            </div>
        </footer>
    );
};

export default Footer;
