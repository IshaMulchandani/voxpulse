import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './AdminReportView.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale } from 'chart.js';
import { Bar, Pie, Doughnut, PolarArea } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale);

// Using Chart.js for all visualizations

const AdminReportView = () => {
    const { reportId } = useParams();
    const navigate = useNavigate();

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Report and poll data
    const [report, setReport] = useState(null);
    const [poll, setPoll] = useState(null);
    const [votesRecords, setVotesRecords] = useState([]); // [{uid, optionIndex, gender, age, profession, annualIncome}]
    
    // Filter states
    const [filters, setFilters] = useState({
        gender: '',
        age: '',
        profession: '',
        income: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // Fetch report from admin collection
                const reportRef = doc(db, 'reports', reportId);
                const reportSnap = await getDoc(reportRef);
                if (!reportSnap.exists()) {
                    setError('Report not found');
                    setLoading(false);
                    return;
                }
                const reportData = reportSnap.data();
                setReport({ id: reportSnap.id, ...reportData });

                if (reportData.type === 'poll' && reportData.pollId) {
                    // Fetch poll
                    const pollRef = doc(db, 'polls', reportData.pollId);
                    const pollSnap = await getDoc(pollRef);
                    if (pollSnap.exists()) {
                        const pollData = pollSnap.data();
                        setPoll({ id: pollSnap.id, ...pollData });

                        // Use votesWithDetails from the poll document
                        if (pollData.votesWithDetails && Array.isArray(pollData.votesWithDetails)) {
                            setVotesRecords(pollData.votesWithDetails);
                        }
                    }
                }
            } catch (e) {
                setError('Failed to load report data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [reportId]);

    // Filter options (derived from profile schema)
    const filterOptions = {
        gender: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
        age: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
        profession: [],
        income: ['Under ₹25L', '₹25L-₹40L', '₹40L-₹60L', '₹60L-₹80L', '₹80L-₹1.2Cr', 'Over ₹1.2Cr']
    };

    const getAgeGroup = (age) => {
        const n = Number(age);
        if (!n && n !== 0) return '';
        if (n < 18) return '';
        if (n <= 24) return '18-24';
        if (n <= 34) return '25-34';
        if (n <= 44) return '35-44';
        if (n <= 54) return '45-54';
        if (n <= 64) return '55-64';
        return '65+';
    };

    const normalizeGender = (g) => {
        const v = String(g || '').trim().toLowerCase();
        if (!v) return '';
        if (v.startsWith('m')) return 'Male';
        if (v.startsWith('f')) return 'Female';
        if (v.includes('non')) return 'Non-binary';
        if (v.includes('prefer')) return 'Prefer not to say';
        return g; // keep original if unrecognized
    };
    const normalizeIncome = (inc) => String(inc || '').trim();
    const normalizeProfession = (p) => String(p || '').trim();

    const matchesFilters = useCallback((profile) => {
        if (!profile) return false;
        if (filters.gender && normalizeGender(profile.gender) !== filters.gender) return false;
        if (filters.age) {
            const group = getAgeGroup(profile.age);
            if (group !== filters.age) return false;
        }
        if (filters.profession && normalizeProfession(profile.profession) !== filters.profession) return false;
        if (filters.income && normalizeIncome(profile.annualIncome) !== filters.income) return false;
        return true;
    }, [filters]);

    // Build unified voter rows from votesWithDetails in the poll document
    const voterRows = useMemo(() => {
        if (!poll) return [];
        if (votesRecords && votesRecords.length > 0) {
            return votesRecords.map(vote => ({
                uid: vote.userId,
                optionIndex: vote.optionIndex,
                gender: vote.userDetails?.gender,
                age: vote.userDetails?.age,
                profession: vote.userDetails?.profession,
                annualIncome: vote.userDetails?.annualIncome,
            }));
        }
        return [];
    }, [poll, votesRecords]);

    const filteredCounts = useMemo(() => {
        if (!poll) return {};
        const options = poll.options || [];
        const counts = {};
        options.forEach((option, index) => {
            counts[option] = 0;
        });
        
        const hasAnyFilter = Object.values(filters).some(Boolean);
        if (!hasAnyFilter) {
            // Use poll.votes if available, otherwise count from voterRows
            if (poll.votes && Array.isArray(poll.votes)) {
                options.forEach((option, index) => {
                    counts[option] = Number(poll.votes[index] || 0);
                });
            } else {
                voterRows.forEach(row => {
                    if (row.optionIndex >= 0 && row.optionIndex < options.length) {
                        const option = options[row.optionIndex];
                        counts[option] = (counts[option] || 0) + 1;
                    }
                });
            }
            return counts;
        }
        
        // Apply filters and count
        voterRows.forEach(row => {
            if (matchesFilters(row)) {
                const optionIndex = Number(row.optionIndex);
                if (optionIndex >= 0 && optionIndex < options.length) {
                    const option = options[optionIndex];
                    counts[option] = (counts[option] || 0) + 1;
                }
            }
        });
        return counts;
    }, [poll, voterRows, matchesFilters, filters]);



    // Distribution restricted to current filters
    const distributionByFiltered = useMemo(() => {
        const result = { gender: {}, age: {}, profession: {}, income: {} };
        if (!poll) return result;
        voterRows.forEach(row => {
            if (!matchesFilters(row)) return;
            const g = normalizeGender(row.gender);
            const a = getAgeGroup(row.age);
            const pr = normalizeProfession(row.profession);
            const inc = normalizeIncome(row.annualIncome);
            if (g) result.gender[g] = (result.gender[g] || 0) + 1;
            if (a) result.age[a] = (result.age[a] || 0) + 1;
            if (pr) result.profession[pr] = (result.profession[pr] || 0) + 1;
            if (inc) result.income[inc] = (result.income[inc] || 0) + 1;
        });
        return result;
    }, [poll, voterRows, matchesFilters]);

    // Chart configurations from live data
    const chartData = useMemo(() => {
        if (!poll || !filteredCounts || !distributionByFiltered) return {};

        const optionLabels = Object.keys(filteredCounts);
        const counts = optionLabels.map(option => filteredCounts[option] || 0);

        const genderLabels = Object.keys(distributionByFiltered.gender || {});
        const genderValues = Object.values(distributionByFiltered.gender || {});

        const ageLabels = Object.keys(distributionByFiltered.age || {});
        const ageValues = Object.values(distributionByFiltered.age || {});

        const professionLabels = Object.keys(distributionByFiltered.profession || {});
        const professionValues = Object.values(distributionByFiltered.profession || {});

        const incomeLabels = Object.keys(distributionByFiltered.income || {});
        const incomeValues = Object.values(distributionByFiltered.income || {});

        return {
            chart1: {
                title: 'Votes by Option',
                type: 'bar',
                data: {
                    labels: optionLabels,
                    datasets: [{
                        label: 'Votes',
                        data: counts,
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Votes by Option'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            },
            chart2: {
                title: 'Gender Distribution',
                type: 'pie',
                data: {
                    labels: genderLabels,
                    datasets: [{
                        data: genderValues,
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Gender Distribution'
                        }
                    }
                }
            },
            chart3: {
                title: 'Age Distribution',
                type: 'doughnut',
                data: {
                    labels: ageLabels,
                    datasets: [{
                        data: ageValues,
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Age Distribution'
                        }
                    }
                }
            },
            chart4: {
                title: 'Profession Distribution',
                type: 'polarArea',
                data: {
                    labels: professionLabels,
                    datasets: [{
                        data: professionValues,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(153, 102, 255, 0.7)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Profession Distribution'
                        }
                    }
                }
            },
            chart5: {
                title: 'Income Distribution',
                type: 'bar',
                data: {
                    labels: incomeLabels,
                    datasets: [{
                        label: 'Voters',
                        data: incomeValues,
                        backgroundColor: 'rgba(75, 192, 192, 0.7)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Income Distribution'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            }
        };
    }, [poll, filteredCounts, distributionByFiltered]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleBack = () => {
        navigate('/admin-reports');
    };



    return (
        <div className="admin-report-view">
            <div className="report-header">
                <button className="back-button" onClick={handleBack}>
                    ← Back to Reports
                </button>
            </div>

            <div className="report-content">
                <div className="report-info">
                    {loading ? (
                        <h1 className="report-title">Loading report...</h1>
                    ) : error ? (
                        <>
                            <h1 className="report-title">Unable to load report</h1>
                            <p className="report-description">{error}</p>
                        </>
                    ) : (
                        <>
                            <h1 className="report-title">{report?.title}</h1>
                            <p className="report-description">{report?.description}</p>
                        </>
                    )}
                </div>

                {report?.type === 'poll' && (
                <div className="report-filters">
                    <h3>Filter Data</h3>
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label htmlFor="gender">Gender:</label>
                            <select
                                id="gender"
                                value={filters.gender}
                                onChange={(e) => handleFilterChange('gender', e.target.value)}
                            >
                                <option value="">All Genders</option>
                                {filterOptions.gender.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="age">Age:</label>
                            <select
                                id="age"
                                value={filters.age}
                                onChange={(e) => handleFilterChange('age', e.target.value)}
                            >
                                <option value="">All Ages</option>
                                {filterOptions.age.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="profession">Profession:</label>
                            <input
                                id="profession"
                                type="text"
                                value={filters.profession}
                                onChange={(e) => handleFilterChange('profession', e.target.value)}
                                placeholder="e.g., Technology"
                            />
                        </div>

                        <div className="filter-group">
                            <label htmlFor="income">Income:</label>
                            <select
                                id="income"
                                value={filters.income}
                                onChange={(e) => handleFilterChange('income', e.target.value)}
                            >
                                <option value="">All Income Levels</option>
                                {filterOptions.income.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                )}

                <div className="charts-grid">
                    <div className="chart-container">
                        <h3>Votes by Option</h3>
                        {chartData.chart1 ? (
                            <Bar data={chartData.chart1.data} options={chartData.chart1.options} />
                        ) : (
                            <div className="no-data">No data available</div>
                        )}
                    </div>

                    <div className="chart-container">
                        <h3>Gender Distribution</h3>
                        {chartData.chart2 ? (
                            <Pie data={chartData.chart2.data} options={chartData.chart2.options} />
                        ) : (
                            <div className="no-data">No data available</div>
                        )}
                    </div>

                    <div className="chart-container">
                        <h3>Age Distribution</h3>
                        {chartData.chart3 ? (
                            <Doughnut data={chartData.chart3.data} options={chartData.chart3.options} />
                        ) : (
                            <div className="no-data">No data available</div>
                        )}
                    </div>

                    <div className="chart-container">
                        <h3>Profession Distribution</h3>
                        {chartData.chart4 ? (
                            <PolarArea data={chartData.chart4.data} options={chartData.chart4.options} />
                        ) : (
                            <div className="no-data">No data available</div>
                        )}
                    </div>

                    <div className="chart-container">
                        <h3>Income Distribution</h3>
                        {chartData.chart5 ? (
                            <Bar data={chartData.chart5.data} options={chartData.chart5.options} />
                        ) : (
                            <div className="no-data">No data available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReportView;
