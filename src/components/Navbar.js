import React from 'react'

import './Navbar.css'

export const Navbar = () => {
  return (
    <nav>
        <a href="index.html">Home</a>
        <ul>
            <li class="rightli"><a href="/">Nav Item4</a></li>
            <li class="rightli"><a href="about.html">NavItem3</a></li>
            <li class="rightli"><a href="about.html">NavItem2</a></li>
            <li class="rightli"><a class="active" href="about.html">About</a></li>
        </ul>
    </nav>
  )
}
