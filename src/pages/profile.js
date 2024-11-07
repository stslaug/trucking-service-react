import React, { useContext, useState } from 'react';
import "./css/profile.css";
import edit from "./css/images/edit.png"

const Profile = () => {

    return (
        <div>
            <div className='welcome-text'>
                Welcome, First
            </div>
            <section className='bio-box'>
                <section className='bio-box-text'>

                    <img className='bio-box-pencil' src={edit} alt='Amazon Image' width='20'></img>
                    USER TYPE:
                    <span style={{float: 'right'}}>Driver</span>
                    <div className='line-break'></div>

                    <img className='bio-box-pencil' src={edit} alt='Amazon Image' width='20'></img>
                    POINT TOTAL:
                    <span style={{float: 'right'}}>0</span>
                    <div className='line-break'></div>

                    <img className='bio-box-pencil' src={edit} alt='Amazon Image' width='20'></img>
                    USERNAME:
                    <span style={{float: 'right'}}>dunlap7</span>
                    <div className='line-break'></div>

                    <img className='bio-box-pencil' src={edit} alt='Amazon Image' width='20'></img>
                    MAIN ADDRESS:
                    <span style={{float: 'right'}}>555 Default Lane, Clemson, SC 29678</span>
                    <div className='line-break'></div>

                    <img className='bio-box-pencil' src={edit} alt='Amazon Image' width='20'></img>
                    SHIPPING ADDRESS:
                    <span style={{float: 'right'}}>555 Default Lane, Clemson, SC 29678</span>
                    <div className='line-break'></div>

                </section>
            </section>
        </div>

    );
};

export default Profile;