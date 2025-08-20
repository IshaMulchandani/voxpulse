import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import './ReportView.css';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const ReportView = () => {
    const { reportId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [poll, setPoll] = useState(null);
    const [votesData, setVotesData] = useState([]);
    const [filters, setFilters] = useState({
        gender: '',
        age: '',
        location: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // Fetch the poll data
                const pollSnapshot = await getDoc(doc(db, 'polls', reportId));
                if (!pollSnapshot.exists()) {
                    setError('Poll not found');
                    setLoading(false);
                    return;
                }

                const pollData = { id: pollSnapshot.id, ...pollSnapshot.data() };
                setPoll(pollData);

                // Fetch votes from votes subcollection
                const votesCollectionRef = collection(db, 'polls', reportId, 'votes');
                const votesSnapshot = await getDocs(votesCollectionRef);
                const votes = votesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp?.toDate() || new Date()
                }));
                setVotesData(votes);
                
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [reportId]);

    const filteredVotes = useMemo(() => {
        return votesData.filter(vote => {
            if (filters.gender && vote.gender !== filters.gender) return false;
            if (filters.age && vote.ageGroup !== filters.age) return false;
            if (filters.location && vote.location !== filters.location) return false;
            return true;
        });
    }, [votesData, filters]);

    const chartData = useMemo(() => {
        if (!poll || !filteredVotes.length) return null;

        // Count votes per option
        const voteCounts = {};
        poll.options.forEach(option => {
            voteCounts[option] = 0;
        });

        filteredVotes.forEach(vote => {
            if (vote.option && poll.options.includes(vote.option)) {
                voteCounts[vote.option]++;
            }
        });

        // Demographics data
        const genderData = {};
        const ageData = {};
        const locationData = {};

        filteredVotes.forEach(vote => {
            if (vote.gender) {
                genderData[vote.gender] = (genderData[vote.gender] || 0) + 1;
            }
            if (vote.ageGroup) {
                ageData[vote.ageGroup] = (ageData[vote.ageGroup] || 0) + 1;
            }
            if (vote.location) {
                locationData[vote.location] = (locationData[vote.location] || 0) + 1;
            }
        });

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        };

        return {
            options: {
                labels: Object.keys(voteCounts),
                datasets: [{
                    data: Object.values(voteCounts),
                    backgroundColor: ['#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384', '#9966FF'],
                    barThickness: 40,
                    borderRadius: 4
                }],
                options: chartOptions
            },
            demographics: {
                gender: {
                    labels: Object.keys(genderData),
                    datasets: [{
                        data: Object.values(genderData),
                        backgroundColor: ['#4BC0C0', '#36A2EB', '#FF6384'],
                        barThickness: 40,
                        borderRadius: 4
                    }],
                    options: chartOptions
                },
                age: {
                    labels: Object.keys(ageData),
                    datasets: [{
                        data: Object.values(ageData),
                        backgroundColor: '#4BC0C0',
                        barThickness: 40,
                        borderRadius: 4
                    }],
                    options: chartOptions
                },
                location: {
                    labels: Object.keys(locationData),
                    datasets: [{
                        data: Object.values(locationData),
                        backgroundColor: ['#4BC0C0', '#36A2EB', '#FF6384'],
                        barThickness: 40,
                        borderRadius: 4
                    }],
                    options: chartOptions
                }
            }
        };
    }, [poll, filteredVotes]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!poll) return <div className="error">No poll data found</div>;

    return (
        <div className="report-view-container">
            <AdminNavbar />
            <div className="report-content">
                <h1>{poll.title}</h1>
                <p>{poll.description}</p>

                <div className="filters-section">
                    <h3>Filters</h3>
                    <div className="filters-grid">
                        <select
                            value={filters.gender}
                            onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                        >
                            <option value="">All Genders</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>

                        <select
                            value={filters.age}
                            onChange={(e) => setFilters(prev => ({ ...prev, age: e.target.value }))}
                        >
                            <option value="">All Ages</option>
                            <option value="18-24">18-24</option>
                            <option value="25-34">25-34</option>
                            <option value="35-44">35-44</option>
                            <option value="45-54">45-54</option>
                            <option value="55+">55+</option>
                        </select>

                        <select
                            value={filters.location}
                            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                        >
                            <option value="">All Locations</option>
                            <option value="Urban">Urban</option>
                            <option value="Suburban">Suburban</option>
                            <option value="Rural">Rural</option>
                        </select>
                    </div>
                </div>

                {chartData && (
                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>Vote Distribution</h3>
                            <div className="chart-wrapper">
                                <Bar data={chartData.options} options={chartData.options.options} />
                            </div>
                        </div>

                        <div className="chart-card">
                            <h3>Gender Distribution</h3>
                            <div className="chart-wrapper">
                                <Bar data={chartData.demographics.gender} options={chartData.demographics.gender.options} />
                            </div>
                        </div>

                        <div className="chart-card">
                            <h3>Age Distribution</h3>
                            <div className="chart-wrapper">
                                <Bar data={chartData.demographics.age} options={chartData.demographics.age.options} />
                            </div>
                        </div>

                        <div className="chart-card">
                            <h3>Location Distribution</h3>
                            <div className="chart-wrapper">
                                <Bar data={chartData.demographics.location} options={chartData.demographics.location.options} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportView;
