import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Require.css';

const Require = ({ jobid }) => {
    const [requirements, setRequirements] = useState({});
    const [title, setTitle] = useState("Loading...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/jobs`)
            .then((res) => {
                const selectedJob = res.data.find(job => job.jobId === jobid);
                if (selectedJob) {
                    setTitle(selectedJob.title || "Unknown Job");
                    setRequirements(selectedJob.requirements || {});
                } else {
                    setTitle("Unknown Job");
                    setRequirements({});
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching job details", err);
                setTitle("Error Loading Job");
                setLoading(false);
            });
    }, [jobid]);

    return (
        <section className="require-bar">
            {/* Header */}
            <header className="require-header">
                <h2 className="tit-req">
                    Job Title: <span className="job-title">{title}</span>
                </h2>
            </header>

            {/* Loading State */}
            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                    <p>Loading requirements...</p>
                </div>
            ) : (
                <>
                    <h3 className="requirements-heading">Job Requirements</h3>

                    {/* Requirements List */}
                    {Object.keys(requirements).length > 0 ? (
                        <ul className="require-list">
                            {Object.entries(requirements).map(([key, value], index) => (
                                <li key={index} className="require-item">
                                    <span className="require-key">{key.replace(/_/g, " ")}:</span>
                                    <span className="require-value">{value}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-requirements">No specific requirements listed for this job.</p>
                    )}
                </>
            )}
        </section>
    );
};

export default Require;
