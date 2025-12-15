import React, { useEffect, useState } from 'react';

const GitHistory = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // 1. Fetch GitHub Events
                const githubPromise = fetch('https://api.github.com/users/MatissJurevics/events/public?per_page=5')
                    .then(async res => {
                        if (!res.ok) throw new Error('GitHub Fetch Failed');
                        const data = await res.json();
                        return data.map(evt => ({
                            source: 'github',
                            id: evt.id,
                            type: evt.type,
                            date: new Date(evt.created_at),
                            repo: evt.repo.name.replace('MatissJurevics/', ''),
                            url: `https://github.com/${evt.repo.name}`,
                            raw: evt
                        }));
                    })
                    .catch(err => {
                        console.warn('GitHub history error:', err);
                        return [];
                    });

                // 2. Fetch Gitea Commits (Manual Aggregation)
                // Since 'events' endpoint is missing, we fetch repos -> recent commits
                const giteaPromise = async () => {
                    try {
                        const reposRes = await fetch('/api/gitea/api/v1/users/Matiss/repos');
                        if (!reposRes.ok) throw new Error('Gitea Repos Fetch Failed');
                        const repos = await reposRes.json();

                        // Fetch commits for each repo (limit 3 per repo to save requests/bandwidth)
                        const commitPromises = repos.map(async repo => {
                            try {
                                const commitsRes = await fetch(`/api/gitea/api/v1/repos/Matiss/${repo.name}/commits?limit=3`);
                                if (!commitsRes.ok) return [];
                                const commits = await commitsRes.json();
                                return commits.map(c => ({
                                    source: 'gitea',
                                    id: c.sha,
                                    type: 'PushEvent', // Simulate PushEvent
                                    date: new Date(c.commit.author.date),
                                    repo: repo.name,
                                    url: c.html_url,
                                    message: c.commit.message,
                                    raw: c
                                }));
                            } catch (e) {
                                return [];
                            }
                        });

                        const commitsArrays = await Promise.all(commitPromises);
                        return commitsArrays.flat();
                    } catch (err) {
                        console.warn('Gitea history error:', err);
                        return [];
                    }
                };

                const [githubEvents, giteaEvents] = await Promise.all([githubPromise, giteaPromise()]);
                const allEvents = [...githubEvents, ...giteaEvents];

                // Sort by Date Descending
                allEvents.sort((a, b) => b.date - a.date);

                // Slice top 10
                setEvents(allEvents.slice(0, 10));

            } catch (err) {
                console.error("History fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const getEventMessage = (event) => {
        if (event.source === 'gitea') {
            // Clean message (first line)
            const msg = event.message.split('\n')[0];
            return `Cm: ${msg}`;
        }

        // GitHub Logic
        const e = event.raw;
        switch (e.type) {
            case 'PushEvent':
                return `Pushed to ${event.repo}`;
            case 'CreateEvent':
                return `Created ${e.payload.ref_type} in ${event.repo}`;
            case 'WatchEvent':
                return `Starred ${event.repo}`;
            case 'PullRequestEvent':
                return `${e.payload.action} PR in ${event.repo}`;
            default:
                return `${e.type} on ${event.repo}`;
        }
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
    };

    const getSourceIcon = (source) => {
        if (source === 'github') return <span style={{ width: '8px', height: '8px', background: '#2da44e', display: 'inline-block', marginRight: '8px', borderRadius: '50%' }}></span>
        if (source === 'gitea') return <span style={{ width: '8px', height: '8px', background: '#ff4d00', display: 'inline-block', marginRight: '8px', borderRadius: '50%' }}></span>
        return null;
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
                ERROR LOAD HISTORY
            </div>
        );
    }

    return (
        <section style={{
            width: '100%',
            height: '100%',
            color: '#e4e4e4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            position: 'relative'
        }}>
            <div style={{
                maxWidth: '600px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'center'
            }}>
                <h2 className="uppercase" style={{ fontSize: '3rem', marginBottom: '40px', lineHeight: 1, textAlign: 'center' }}>
                    Git <br /> History
                </h2>

                <div className="hide-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
                    {events.map(event => (
                        <div key={event.id} style={{
                            borderLeft: `2px solid ${event.source === 'gitea' ? '#ff4d00' : '#333'}`,
                            paddingLeft: '20px',
                            transition: 'border-color 0.3s ease',
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = event.source === 'gitea' ? '#ff6600' : '#2da44e'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = event.source === 'gitea' ? '#ff4d00' : '#333'}
                        >
                            <p className="mono" style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>
                                {getSourceIcon(event.source)}
                                {formatDate(event.date)}
                            </p>
                            <a href={event.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', lineHeight: '1.4' }}>
                                    {getEventMessage(event)}
                                </p>
                            </a>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <a href="https://git.mati.ss/Matiss" target="_blank" rel="noopener noreferrer" className="mono" style={{ color: '#ff4d00', textDecoration: 'none', fontSize: '0.9rem' }}>
                        VIEW FULL PROFILE &rarr;
                    </a>
                </div>
            </div>
        </section>
    );
};

export default GitHistory;
