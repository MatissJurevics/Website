import React, { useEffect, useState } from 'react';

const GithubHistory = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('https://api.github.com/users/MatissJurevics/events/public?per_page=5');
                if (!response.ok) {
                    throw new Error('Failed to fetch GitHub history');
                }
                const data = await response.json();
                setEvents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const getEventMessage = (event) => {
        switch (event.type) {
            case 'PushEvent':
                return `Pushed to ${event.repo.name.replace('MatissJurevics/', '')}`;
            case 'CreateEvent':
                return `Created ${event.payload.ref_type} in ${event.repo.name.replace('MatissJurevics/', '')}`;
            case 'WatchEvent':
                return `Starred ${event.repo.name.replace('MatissJurevics/', '')}`;
            case 'PullRequestEvent':
                return `${event.payload.action} PR in ${event.repo.name.replace('MatissJurevics/', '')}`;
            default:
                return `${event.type} on ${event.repo.name.replace('MatissJurevics/', '')}`;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
    };

    if (loading) {
        return (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontFamily: 'monospace' }}>
                LOADING HISTORY...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4d00', fontFamily: 'monospace' }}>
                ERROR LOAD GITHUB DATA
            </div>
        );
    }

    return (
        <section style={{
            height: '600px',
            background: '#0a0a0a',
            color: '#e4e4e4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            position: 'relative'
        }}>
            <div style={{
                maxWidth: '600px', // Narrower container for list
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'center'
            }}>
                <h2 className="uppercase" style={{ fontSize: '3rem', marginBottom: '40px', lineHeight: 1, textAlign: 'center' }}>
                    Github <br /> History
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {events.map(event => (
                        <div key={event.id} style={{
                            borderLeft: '2px solid #333',
                            paddingLeft: '20px',
                            transition: 'border-color 0.3s ease',
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ff4d00'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333'}
                        >
                            <p className="mono" style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>
                                {formatDate(event.created_at)}
                            </p>
                            <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    {getEventMessage(event)}
                                </p>
                            </a>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <a href="https://github.com/MatissJurevics" target="_blank" rel="noopener noreferrer" className="mono" style={{ color: '#ff4d00', textDecoration: 'none', fontSize: '0.9rem' }}>
                        VIEW FULL PROFILE &rarr;
                    </a>
                </div>
            </div>
        </section>
    );
};

export default GithubHistory;
