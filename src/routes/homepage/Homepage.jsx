import './homepage.css'
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


const Homepage = () => {


    return (
        <div className='homepage'>
        <Link to = '/dashboard'>Dashboard</Link>
        </div>
    );
};


Homepage.propTypes = {

};


export default Homepage;
