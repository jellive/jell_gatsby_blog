import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span className="footer-text">
          &copy; {currentYear} <span className="footer-accent">jell.</span>
        </span>
        <span className="footer-sep">&mdash;</span>
        <span className="footer-text">built with next.js</span>
      </div>
    </footer>
  )
}

export default Footer
