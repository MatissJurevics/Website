import React from 'react';
import GitHistory from './GitHistory';
import ActivityHeatmap from './ActivityHeatmap';

const GitSection = () => {
    return (
        <section style={{
            background: '#0a0a0a',
            color: '#e4e4e4',
            padding: '40px 20px',
            position: 'relative'
        }}>
            <div style={{
                maxWidth: '1400px',
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '40px',
                justifyContent: 'center',
                alignItems: 'flex-start' // Align top
            }}>
                {/* Left: Github History List */}
                <div style={{
                    flex: '1',
                    minWidth: '350px',
                    maxWidth: '500px'
                }}>
                    <GitHistory />
                </div>

                {/* Right: Activity Heatmap 3D */}
                <div style={{
                    flex: '2',
                    minWidth: '500px',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <ActivityHeatmap />
                </div>
            </div>
        </section>
    );
};

export default GitSection;
