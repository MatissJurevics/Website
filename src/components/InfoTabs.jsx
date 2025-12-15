import React, { useState } from 'react';
import WhereAmI from './WhereAmI';
import GithubHistory from './GithubHistory';

const InfoTabs = () => {
    const [activeTab, setActiveTab] = useState('location');

    return (
        <div style={{ background: '#0a0a0a' }}>
            {/* Tab Navigation */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '40px',
                paddingTop: '60px',
                borderBottom: '1px solid #222'
            }}>
                <button
                    onClick={() => setActiveTab('location')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'location' ? '2px solid #ff4d00' : '2px solid transparent',
                        color: activeTab === 'location' ? '#fff' : '#666',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Where Am I?
                </button>
                <button
                    onClick={() => setActiveTab('github')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'github' ? '2px solid #ff4d00' : '2px solid transparent',
                        color: activeTab === 'github' ? '#fff' : '#666',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Github History
                </button>
            </div>

            {/* Content Area */}
            <div>
                {activeTab === 'location' && <WhereAmI />}
                {activeTab === 'github' && <GithubHistory />}
            </div>
        </div>
    );
};

export default InfoTabs;
