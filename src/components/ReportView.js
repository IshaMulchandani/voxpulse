import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import './ReportView.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    BoxPlotController,
    BoxAndWiskers
} from 'chart.js';
import { Line, Bar, Pie, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend
);

const ReportView = () => {
    const navigate = useNavigate();
    const { reportType } = useParams();

    // Sample data for different chart types
    const lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Activity',
            data: [65, 59, 80, 81, 56, 55],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const pieChartData = {
        labels: ['Politics', 'Entertainment', 'Sports', 'Technology', 'Social Issues'],
        datasets: [{
            data: [30, 20, 15, 25, 10],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)'
            ]
        }]
    };

    const barChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Responses',
            data: [12, 19, 3, 5, 2, 3, 9],
            backgroundColor: 'rgba(54, 162, 235, 0.5)'
        }]
    };

    const radarChartData = {
        labels: ['Engagement', 'Accuracy', 'Consistency', 'Impact', 'Frequency'],
        datasets: [{
            label: 'Your Activity',
            data: [85, 70, 90, 65, 75],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            pointBackgroundColor: 'rgba(75, 192, 192, 1)'
        }]
    };

    const getReportContent = () => {
        switch(reportType) {
            case 'vote-analysis':
                return {
                    title: 'Vote Analysis Report',
                    visualizations: [
                        {
                            title: 'Monthly Voting Distribution',
                            description: 'This histogram shows your voting frequency across different times of the day.',
                            component: <Bar 
                                data={barChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: { display: false }
                                    }
                                }}
                            />
                        },
                        {
                            title: 'Category-wise Participation',
                            description: 'This pie chart breaks down your vote distribution across different poll categories.',
                            component: <Pie 
                                data={pieChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: { display: false }
                                    }
                                }}
                            />
                        },
                        {
                            title: 'Engagement Trends',
                            description: 'This line graph shows your participation trends over time.',
                            component: <Line 
                                data={lineChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: { display: false }
                                    }
                                }}
                            />
                        }
                    ]
                };
            case 'comment-analysis':
                return {
                    title: 'Comment Analysis',
                    visualizations: [
                        {
                            title: 'Comment Sentiment Distribution',
                            description: 'This bar chart shows the distribution of sentiment in your comments.',
                            component: <Bar 
                                data={{
                                    labels: ['Very Negative', 'Negative', 'Neutral', 'Positive', 'Very Positive'],
                                    datasets: [{
                                        label: 'Comment Sentiment',
                                        data: [5, 15, 40, 30, 10],
                                        backgroundColor: 'rgba(153, 102, 255, 0.5)'
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: { display: false }
                                    }
                                }}
                            />
                        },
                        {
                            title: 'Top Discussion Topics',
                            description: 'This pie chart shows the distribution of topics in your comments.',
                            component: <Pie 
                                data={{
                                    labels: ['Policy', 'Culture', 'Technology', 'Sports', 'Environment'],
                                    datasets: [{
                                        data: [25, 20, 20, 15, 20],
                                        backgroundColor: [
                                            'rgba(255, 99, 132, 0.8)',
                                            'rgba(54, 162, 235, 0.8)',
                                            'rgba(255, 206, 86, 0.8)',
                                            'rgba(75, 192, 192, 0.8)',
                                            'rgba(153, 102, 255, 0.8)'
                                        ]
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: { display: false }
                                    }
                                }}
                            />
                        },
                        {
                            title: 'Response Rate Analysis',
                            description: 'This line graph shows how often your comments receive responses.',
                            component: <Line 
                                data={{
                                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                                    datasets: [{
                                        label: 'Response Rate',
                                        data: [75, 82, 68, 90],
                                        fill: false,
                                        borderColor: 'rgb(75, 192, 192)',
                                        tension: 0.1
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: { display: false }
                                    }
                                }}
                            />
                        }
                    ]
                };
            case 'activity-report':
                return {
                    title: 'Activity Report',
                    visualizations: [
                        {
                            title: 'Impact Score Trend',
                            description: 'This line graph shows how your contributions have influenced poll outcomes.',
                            component: <Line 
                                data={{
                                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                    datasets: [{
                                        label: 'Impact Score',
                                        data: [65, 75, 70, 85, 80, 90],
                                        fill: false,
                                        borderColor: 'rgb(75, 192, 192)',
                                        tension: 0.1
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: { display: false }
                                    }
                                }}
                            />
                        },
                        {
                            title: 'Contribution Distribution',
                            description: 'This bar chart shows the breakdown of your different types of contributions.',
                            component: <Bar 
                                data={{
                                    labels: ['Votes', 'Comments', 'Shares', 'Reports', 'Awards'],
                                    datasets: [{
                                        label: 'Contributions',
                                        data: [300, 150, 100, 50, 75],
                                        backgroundColor: 'rgba(54, 162, 235, 0.5)'
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: { display: false }
                                    }
                                }}
                            />
                        },
                        {
                            title: 'Community Alignment',
                            description: 'This radar chart shows how your voting patterns align with the community.',
                            component: <Radar 
                                data={radarChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: { display: false }
                                    }
                                }}
                            />
                        }
                    ]
                };
            default:
                return {
                    title: 'Report Not Found',
                    visualizations: []
                };
        }
    };

    const report = getReportContent();

    return (
        <div>
            <Navbar />
            <div className="report-view-container">
                <div className="report-header">
                    <div className="back-arrow" onClick={() => navigate('/reports')}>
                        ←
                    </div>
                    <h1 className="report-title">{report.title}</h1>
                </div>
                <div className="visualization-grid">
                    {report.visualizations.map((viz, index) => (
                        <div key={index} className="visualization-card">
                            <div className="visualization-header">
                                <h2 className="visualization-title">{viz.title}</h2>
                                <p className="visualization-description">{viz.description}</p>
                            </div>
                            <div className="chart-container">
                                {viz.component}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportView;
