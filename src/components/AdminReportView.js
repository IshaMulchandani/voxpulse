import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
} from 'chart.js';
import { Bar, Line, Doughnut, Pie, PolarArea } from 'react-chartjs-2';
import './AdminReportView.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale
);

const AdminReportView = () => {
    const { reportId } = useParams();
    const navigate = useNavigate();
    
    // Filter states
    const [filters, setFilters] = useState({
        gender: '',
        age: '',
        profession: '',
        income: ''
    });

    // Sample report data
    const [reportData] = useState({
        1: {
            title: "AI Development Regulations Poll Analysis",
            description: "This comprehensive report analyzes public opinion on AI development regulations, examining voting patterns across different demographics, geographic regions, and professional backgrounds. The data reveals insights into how different groups perceive the need for stricter AI oversight and regulatory frameworks.",
            type: "poll"
        },
        2: {
            title: "Monthly User Activity Report",
            description: "A detailed analysis of user engagement metrics including login frequency, feature usage, session duration, and platform interaction patterns. This report helps understand user behavior trends and platform performance indicators for administrative decision-making.",
            type: "system"
        },
        3: {
            title: "Climate Action Poll Results",
            description: "Analysis of public sentiment regarding climate action priorities, examining preferences between individual versus corporate responsibility. The report breaks down responses by demographic factors and provides insights into environmental awareness and action preferences.",
            type: "poll"
        },
        4: {
            title: "Platform Usage Analytics",
            description: "Comprehensive analytics covering platform performance metrics, user journey analysis, feature adoption rates, and system utilization patterns. This technical report provides insights for platform optimization and resource allocation decisions.",
            type: "system"
        },
        5: {
            title: "Remote Work Trends Analysis",
            description: "Detailed examination of remote work preferences and trends based on poll responses. The analysis covers work-from-home adoption, productivity perceptions, and future workplace preferences across different professional sectors and demographic groups.",
            type: "poll"
        }
    });

    const currentReport = reportData[reportId] || reportData[1];

    // Filter options
    const filterOptions = {
        gender: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
        age: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
        profession: ['Technology', 'Healthcare', 'Education', 'Finance', 'Retail', 'Manufacturing', 'Government', 'Other'],
        income: ['Under $30k', '$30k-$50k', '$50k-$75k', '$75k-$100k', '$100k-$150k', 'Over $150k']
    };

    // Generate dynamic data based on filters
    const generateChartData = (baseData, chartType) => {
        const filterMultiplier = Object.values(filters).filter(f => f !== '').length * 0.1 + 1;
        const randomVariation = () => Math.random() * 0.3 + 0.85; // 0.85 to 1.15 multiplier
        
        return baseData.map(value => Math.round(value * filterMultiplier * randomVariation()));
    };

    // Chart configurations
    const getChartData = () => {
        if (currentReport.type === 'poll') {
            return {
                chart1: {
                    title: "Response Distribution by Opinion",
                    description: "Shows the distribution of responses across different opinion categories for the main poll question.",
                    type: "bar",
                    data: {
                        labels: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
                        datasets: [{
                            label: 'Number of Responses',
                            data: generateChartData([45, 78, 32, 56, 23]),
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.8)',
                                'rgba(54, 162, 235, 0.8)',
                                'rgba(255, 206, 86, 0.8)',
                                'rgba(255, 99, 132, 0.8)',
                                'rgba(153, 102, 255, 0.8)'
                            ],
                            borderColor: [
                                'rgba(75, 192, 192, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(255, 99, 132, 1)',
                                'rgba(153, 102, 255, 1)'
                            ],
                            borderWidth: 1
                        }]
                    }
                },
                chart2: {
                    title: "Response Trends Over Time",
                    description: "Tracks how responses have changed over the polling period, showing daily response volumes.",
                    type: "line",
                    data: {
                        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                        datasets: [{
                            label: 'Daily Responses',
                            data: generateChartData([12, 19, 25, 22, 28, 24, 18]),
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            tension: 0.4
                        }]
                    }
                },
                chart3: {
                    title: "Demographic Breakdown",
                    description: "Shows the demographic composition of poll respondents across different age groups.",
                    type: "doughnut",
                    data: {
                        labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
                        datasets: [{
                            data: generateChartData([15, 28, 25, 18, 10, 4]),
                            backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                                '#4BC0C0',
                                '#9966FF',
                                '#FF9F40'
                            ]
                        }]
                    }
                },
                chart4: {
                    title: "Geographic Response Distribution",
                    description: "Displays response rates across different geographic regions and locations.",
                    type: "pie",
                    data: {
                        labels: ['North', 'South', 'East', 'West', 'Central'],
                        datasets: [{
                            data: generateChartData([22, 18, 25, 20, 15]),
                            backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                                '#4BC0C0',
                                '#9966FF'
                            ]
                        }]
                    }
                },
                chart5: {
                    title: "Response Quality Metrics",
                    description: "Analyzes response quality factors including completion rate, engagement level, and response time.",
                    type: "polar",
                    data: {
                        labels: ['Completion Rate', 'Engagement Score', 'Response Time', 'Quality Rating', 'Relevance Score'],
                        datasets: [{
                            data: generateChartData([85, 72, 68, 78, 82]),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.5)',
                                'rgba(54, 162, 235, 0.5)',
                                'rgba(255, 205, 86, 0.5)',
                                'rgba(75, 192, 192, 0.5)',
                                'rgba(153, 102, 255, 0.5)'
                            ]
                        }]
                    }
                }
            };
        } else {
            // System report charts
            return {
                chart1: {
                    title: "User Activity Metrics",
                    description: "Shows daily active users, session counts, and engagement metrics across the platform.",
                    type: "bar",
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                            label: 'Active Users',
                            data: generateChartData([120, 135, 142, 138, 155, 98, 87]),
                            backgroundColor: 'rgba(54, 162, 235, 0.8)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    }
                },
                chart2: {
                    title: "System Performance Trends",
                    description: "Tracks system performance metrics including response time, uptime, and error rates over time.",
                    type: "line",
                    data: {
                        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                        datasets: [
                            {
                                label: 'Response Time (ms)',
                                data: generateChartData([245, 238, 252, 241]),
                                borderColor: 'rgb(255, 99, 132)',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                yAxisID: 'y'
                            },
                            {
                                label: 'Uptime %',
                                data: generateChartData([99.2, 99.5, 99.1, 99.7]),
                                borderColor: 'rgb(75, 192, 192)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                yAxisID: 'y1'
                            }
                        ]
                    }
                },
                chart3: {
                    title: "Feature Usage Distribution",
                    description: "Shows how different platform features are being utilized by users.",
                    type: "doughnut",
                    data: {
                        labels: ['Polls', 'Comments', 'Reports', 'Dashboard', 'Profile'],
                        datasets: [{
                            data: generateChartData([35, 25, 15, 18, 7]),
                            backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                                '#4BC0C0',
                                '#9966FF'
                            ]
                        }]
                    }
                },
                chart4: {
                    title: "User Registration Sources",
                    description: "Tracks where new users are coming from and registration channel effectiveness.",
                    type: "pie",
                    data: {
                        labels: ['Direct', 'Social Media', 'Search', 'Referral', 'Email'],
                        datasets: [{
                            data: generateChartData([28, 22, 18, 16, 16]),
                            backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                                '#4BC0C0',
                                '#9966FF'
                            ]
                        }]
                    }
                },
                chart5: {
                    title: "System Resource Usage",
                    description: "Monitors system resource utilization including CPU, memory, storage, and bandwidth usage.",
                    type: "polar",
                    data: {
                        labels: ['CPU Usage', 'Memory', 'Storage', 'Bandwidth', 'Database'],
                        datasets: [{
                            data: generateChartData([65, 72, 45, 58, 68]),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.5)',
                                'rgba(54, 162, 235, 0.5)',
                                'rgba(255, 205, 86, 0.5)',
                                'rgba(75, 192, 192, 0.5)',
                                'rgba(153, 102, 255, 0.5)'
                            ]
                        }]
                    }
                }
            };
        }
    };

    const chartData = getChartData();

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleBack = () => {
        navigate('/admin-reports');
    };

    const renderChart = (chartConfig) => {
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: chartConfig.title
                }
            }
        };

        switch (chartConfig.type) {
            case 'bar':
                return <Bar data={chartConfig.data} options={options} />;
            case 'line':
                return <Line data={chartConfig.data} options={options} />;
            case 'doughnut':
                return <Doughnut data={chartConfig.data} options={options} />;
            case 'pie':
                return <Pie data={chartConfig.data} options={options} />;
            case 'polar':
                return <PolarArea data={chartConfig.data} options={options} />;
            default:
                return <Bar data={chartConfig.data} options={options} />;
        }
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
                    <h1 className="report-title">{currentReport.title}</h1>
                    <p className="report-description">{currentReport.description}</p>
                </div>

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
                            <select
                                id="profession"
                                value={filters.profession}
                                onChange={(e) => handleFilterChange('profession', e.target.value)}
                            >
                                <option value="">All Professions</option>
                                {filterOptions.profession.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
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

                <div className="charts-container">
                    {Object.entries(chartData).map(([key, chartConfig]) => (
                        <div key={key} className="chart-section">
                            <div className="chart-header">
                                <h3 className="chart-title">{chartConfig.title}</h3>
                                <p className="chart-description">{chartConfig.description}</p>
                            </div>
                            <div className="chart-wrapper">
                                {renderChart(chartConfig)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminReportView;
