import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const ActivityHeatmap = () => {
    const svgRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [hoveredData, setHoveredData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            // Initialize default empty data
            let githubData = { contributions: [] };
            let giteaData = [];

            try {
                // 1. Fetch GitHub Data (Safe Fetch)
                try {
                    const githubRes = await fetch('https://github-contributions-api.jogruber.de/v4/MatissJurevics');
                    if (githubRes.ok) {
                        githubData = await githubRes.json();
                    } else {
                        console.warn("GitHub API fetch failed:", githubRes.status);
                    }
                } catch (e) {
                    console.warn("GitHub API error:", e);
                }

                // 2. Fetch Gitea Data (Safe Fetch)
                try {
                    const giteaRes = await fetch('/api/gitea/api/v1/users/Matiss/heatmap');
                    if (giteaRes.ok) {
                        giteaData = await giteaRes.json();
                    } else {
                        console.warn("Gitea API fetch failed:", giteaRes.status);
                    }
                } catch (e) {
                    console.warn("Gitea API error:", e);
                }

                // 3. Process & Merge
                const processData = () => {
                    const merged = new Map();
                    const today = new Date();
                    const oneYearAgo = new Date();
                    oneYearAgo.setDate(today.getDate() - 365);

                    const toKey = (date) => date.toISOString().split('T')[0];

                    // Initialize map with empty days
                    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
                        merged.set(toKey(d), { date: new Date(d), github: 0, gitea: 0 });
                    }

                    // Fill GitHub
                    if (githubData && githubData.contributions) {
                        githubData.contributions.forEach(day => {
                            if (merged.has(day.date)) {
                                const curr = merged.get(day.date);
                                curr.github = day.count;
                                merged.set(day.date, curr);
                            }
                        });
                    }

                    // Fill Gitea
                    if (Array.isArray(giteaData)) {
                        giteaData.forEach(item => {
                            const d = new Date(item.timestamp * 1000);
                            const key = toKey(d);
                            if (merged.has(key)) {
                                const curr = merged.get(key);
                                curr.gitea = item.contributions;
                                merged.set(key, curr);
                            }
                        });
                    }

                    return Array.from(merged.values());
                };

                const processed = processData();
                setData(processed);
            } catch (err) {
                console.error("Critical error in ActivityHeatmap:", err);
                // setError(err.message); // Suppress global error to show partial data
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (loading || !data.length || !svgRef.current) return;

        // D3 Drawing Logic
        const width = 1000;
        const height = 600;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg.append("g")
            .attr("transform", `translate(220, 100)`); // Moved up to prevent cutoff

        // Isometric projection
        // x grid runs diagonally right-down, y grid runs diagonally left-down
        const tileWidth = 12;
        const tileHeight = 7; // flattened appearance

        // We need to organize data into weeks (x) and days of week (y)
        // Similar to GitHub's contribution graph but 3D
        // y: 0 (Sunday) - 6 (Saturday)
        // x: Week index 0 - 52

        const mappedData = data.map((d, i) => {
            const dayOfWeek = d.date.getDay(); // 0-6
            // Determine week index relative to start
            const weekIndex = Math.floor(i / 7);
            return {
                ...d,
                gridX: weekIndex,
                gridY: dayOfWeek
            };
        });

        // Projection functions
        // Iso 30 deg: x' = (col - row) * w, y' = (col + row) * h/2
        const project = (col, row) => {
            return {
                x: (col - row) * tileWidth,
                y: (col + row) * tileHeight
            };
        };

        // Color scales
        const maxVal = d3.max(mappedData, d => d.github + d.gitea) || 5;
        const heightScale = d3.scaleLinear().domain([0, maxVal]).range([0, 50]);

        // Colors
        const githubColor = "#2da44e"; // GitHub Green
        const giteaColor = "#609926"; // Gitea Green (slightly different, maybe orangey for contrast?)
        // Let's use user's theme color for Gitea to contrast? User said "git tea", maybe stick to green varieties or separate?
        // User asked for "stacked", so distinct colors helpful.
        // Let's use Theme Orange (#ff4d00) for Gitea to match site, and GitHub Green for GitHub.
        const colorGithub = "#2da44e";
        const colorGitea = "#ff4d00";

        // Draw standard floor tiles first (for context)
        // Only needed if we want a "grid" look. Let's skip empty tiles for performance/cleanliness or draw dark base.

        // Sort by gridY then gridX to render back-to-front correctly for painter's algorithm
        // Render order: smallest y+x (back) to largest y+x (front)
        // Actually for isometric: 
        // We want to draw cols (weeks) from left to right?
        // Let's sort by sum of coords for simple stacking.
        mappedData.sort((a, b) => (a.gridX + a.gridY) - (b.gridX + b.gridY));

        mappedData.forEach(d => {
            if (d.github === 0 && d.gitea === 0) {
                // Draw faint base tile
                const pos = project(d.gridX, d.gridY);
                // Draw a simple diamond path
                const path = `M${pos.x} ${pos.y} 
                               L${pos.x + tileWidth} ${pos.y + tileHeight} 
                               L${pos.x} ${pos.y + 2 * tileHeight} 
                               L${pos.x - tileWidth} ${pos.y + tileHeight} Z`;

                g.append("path")
                    .attr("d", path)
                    .attr("fill", "#222") // Dark tile
                    .attr("stroke", "none");
                return;
            }

            const pos = project(d.gridX, d.gridY);
            const totalHeight = heightScale(d.github + d.gitea);
            const giteaH = heightScale(d.gitea);
            const githubH = heightScale(d.github);

            // Draw Gitea Bar (Bottom)
            if (d.gitea > 0) {
                drawBar(g, pos.x, pos.y, tileWidth, tileHeight, giteaH, colorGitea, `Gitea: ${d.gitea} on ${d.date.toDateString()}`, d);
            }

            // Draw GitHub Bar (Top)
            // Adjust y position up by gitea height
            if (d.github > 0) {
                drawBar(g, pos.x, pos.y - giteaH, tileWidth, tileHeight, githubH, colorGithub, `GitHub: ${d.github} on ${d.date.toDateString()}`, d);
            }
        });

        // Function to draw isometric prism
        function drawBar(container, x, y, w, h, z, color, tooltipText, dataItem) {
            // Top Face
            const pathTop = `M${x} ${y - z} 
                              L${x + w} ${y + h - z} 
                              L${x} ${y + 2 * h - z} 
                              L${x - w} ${y + h - z} Z`;

            // Right Face
            const pathRight = `M${x + w} ${y + h - z} 
                                L${x + w} ${y + h} 
                                L${x} ${y + 2 * h} 
                                L${x} ${y + 2 * h - z} Z`;

            // Left Face
            const pathLeft = `M${x - w} ${y + h - z} 
                               L${x - w} ${y + h} 
                               L${x} ${y + 2 * h} 
                               L${x} ${y + 2 * h - z} Z`;

            const group = container.append("g");

            // Shading
            const c = d3.color(color);
            const cRight = c.darker(0.7);
            const cLeft = c.darker(0.4);

            group.append("path").attr("d", pathRight).attr("fill", cRight);
            group.append("path").attr("d", pathLeft).attr("fill", cLeft);
            group.append("path").attr("d", pathTop).attr("fill", c);

            // Simple tooltip title
            group.append("title").text(tooltipText);

            // Hover effect
            group.on("mouseenter", function (event) {
                d3.select(this).selectAll("path").attr("opacity", 0.8);
                // Calculate position relative to container
                const [mx, my] = d3.pointer(event, svg.node());
                setHoveredData({
                    x: mx,
                    y: my,
                    date: d3.select(this).datum().date,
                    github: d3.select(this).datum().github,
                    gitea: d3.select(this).datum().gitea
                });
            }).on("mouseleave", function () {
                d3.select(this).selectAll("path").attr("opacity", 1);
                setHoveredData(null);
            });

            // Attach data to group for access in handler
            group.datum(dataItem);
        }

    }, [data, loading]);

    if (loading) {
        return (
            <div style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#666' }}>
                ANALYZING COMMITS...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#ff4d00', flexDirection: 'column' }}>
                <div>DATA FLUX ERROR</div>
                <div style={{ fontSize: '0.8rem', marginTop: '10px', color: '#888' }}>{error}</div>
            </div>
        );
    }

    return (
        <section style={{
            width: '100%',
            height: '100%',
            color: '#e4e4e4',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            overflow: 'visible', // Allow tooltip to render outside if needed
            position: 'relative' // Anchor for absolute tooltip
        }}>
            <h2 className="uppercase" style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#888' }}>
                Contribution Topography
            </h2>
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem', marginBottom: '20px', fontFamily: 'monospace' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '10px', height: '10px', background: '#2da44e' }}></span> GitHub
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '10px', height: '10px', background: '#ff4d00' }}></span> Gitea
                </div>
            </div>

            <svg
                ref={svgRef}
                viewBox="0 0 1000 600"
                preserveAspectRatio="xMidYMid meet"
                style={{ width: '100%', height: 'auto', overflow: 'visible' }}
            />

            {hoveredData && (
                <div style={{
                    position: 'absolute',
                    left: hoveredData.x + 10, // Closer offset
                    top: hoveredData.y - 30,
                    background: 'rgba(0,0,0,0.9)',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    padding: '10px',
                    pointerEvents: 'none',
                    zIndex: 10,
                    fontSize: '0.8rem',
                    fontFamily: 'monospace',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#fff' }}>
                        {hoveredData.date ? hoveredData.date.toDateString() : 'Date'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ color: '#2da44e' }}>GitHub: {hoveredData.github || 0}</div>
                        <div style={{ color: '#ff4d00' }}>Gitea: {hoveredData.gitea || 0}</div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ActivityHeatmap;
