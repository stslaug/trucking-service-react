import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./css/general.css";
import "./css/about.css";

const About = () => {
    const [developers, setDevelopers] = useState([]);
    const [version, getVersion] = useState([]);

    // Fetch developer data from Lambda function (API Gateway URL)
    useEffect(() => {
        const fetchData = async () => {
            try { // Get developer data from Database
                const response = await axios.get('https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-AboutPage');
                const developersData = response.data;
                setDevelopers(developersData);
            } catch (error) {
                console.error("Error fetching developer data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <header>
                <h1>Meet Our Development Team</h1>
                <p>Passionate developers creating amazing projects together!</p>
            </header>

            <section className="team-section">
                <div className="team-container">
                    {developers.map((developer) => (
                        <div className="team-member" key={developer.devID}>
                            <h2 className="team-name">{developer.FirstName} {developer.LastName}</h2>
                            <p className="team-role">Developer</p>
                            <p className="team-bio">{developer.Description}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default About;
