import React from 'react';
import Globe from '../canvas/Globe';

const WhereAmI = () => {
    return (
        <section style={{
            height: '600px',
            background: '#0a0a0a', // Dark Background
            color: '#e4e4e4', // Light Text
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            position: 'relative'
        }}>
            <div style={{
                maxWidth: '1400px',
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '100%',
                flexWrap: 'wrap'
            }}>
                {/* Text Content */}
                <div style={{ flex: '1', minWidth: '300px', paddingRight: '40px' }}>
                    <h2 className="uppercase" style={{ fontSize: '3rem', marginBottom: '20px', lineHeight: 1 }}>
                        Where <br /> Am I?
                    </h2>
                    <div style={{ borderLeft: '2px solid #ff4d00', paddingLeft: '20px' }}>
                        <p className="mono" style={{ fontSize: '1rem', color: '#888', marginBottom: '5px' }}>
                            CURRENT LOCATION
                        </p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            Dublin, Ireland
                        </p>
                        <p style={{ marginTop: '20px', color: '#ccc', maxWidth: '400px' }}>
                            Based in the heart of Dublin. Working globally with clients to build digital products that matter.
                        </p>
                        <p className="mono" style={{ marginTop: '10px', fontSize: '0.8rem', color: '#666' }}>
                            53.3498° N, 6.2603° W
                        </p>
                    </div>
                </div>

                {/* Globe Visual */}
                <div style={{
                    flex: '1',
                    minWidth: '300px',
                    height: '100%',
                    minHeight: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Globe />
                </div>
            </div>
        </section>
    );
};

export default WhereAmI;
