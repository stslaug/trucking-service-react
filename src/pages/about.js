import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App'; 
import "./css/about.css";
import "./css/general.css";


const About = () => {
    return (
    <div>
        <header>
            <h1>Meet Our Development Team</h1>
            <p>Passionate developers creating amazing projects together!</p>
        </header>

        <section class="team-section">
            <div class="team-container">

                <div class="team-member">
                    <h2 class="team-name">Kevin Blinn</h2>
                    <p class="team-role">Developer</p>
                    <p class="team-bio">Kevin is a software developer with expertise in web development, passionate about
                        creating engaging user experiences and enhancing projects through innovative ideas.</p>
                </div>

        
                <div class="team-member">
                    <h2 class="team-name">Chase Dunlap</h2>
                    <p class="team-role">Developer</p>
                    <p class="team-bio">Chase is a software developer with an emphasis in networking. My goal is to provide
                        the best application possible, and to focus on concrete and open collaboration and communication.</p>
                </div>

        
                <div class="team-member">
                    <h2 class="team-name">Sean "Tyler" Slaughter</h2>
                    <p class="team-role">Developer</p>
                    <p class="team-bio">I am a software engineer at Clemson. I enjoy creating software, with my experience has been heavily focuses on back-end development working
                        with multi-service communication utilizing REST and SOAP. My goal is to learn more about AWS and cloud services, and how to leverage this toolstack to my future careers.
                    </p>
                </div>

                <div class="team-member">
                    <h2 class="team-name">Grayson Whitaker</h2>
                    <p class="team-role">Developer</p>
                    <p class="team-bio">I am a software developer at Clemson University. My goal as a developer is to create meaningful apps that are both creative and innovative. I have a strong passion for technology,
                        and a desire to learn and grow as a developer. I am excited to work with my team to create amazing projects.
                    </p>
                </div>

            </div>
        </section>
    </div>

    );
};

export default About;