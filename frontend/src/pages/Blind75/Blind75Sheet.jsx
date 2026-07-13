import React, { useState } from 'react';
import { blind75 } from './blind.js';
import './Blind75Sheet.css';

export default function Blind75Sheet() {
  const [openTopic, setOpenTopic] = useState(null);

  // Data Grouping
  const groupedData = blind75.chunks[0].problems.reduce((acc, curr) => {
    if (!acc[curr.topic]) acc[curr.topic] = [];
    acc[curr.topic].push(curr);
    return acc;
  }, {});

  return (
    <div className="accordion-container">
      {Object.entries(groupedData).map(([topic, problems]) => (
        <div key={topic} className="accordion-item">
          
          <div className="accordion-header" onClick={() => setOpenTopic(openTopic === topic ? null : topic)}>
            <span>{topic}</span>
            <span>{openTopic === topic ? '▲' : '▼'}</span>
          </div>

          {}
          <div className={`accordion-content ${openTopic === topic ? 'active' : ''}`}>
            {problems.map((prob) => (
              <div key={prob.id} className="table-row">
                <span>{prob.name}</span>
                <a href={prob.link}>Open</a>
              </div>
            ))}
          </div>
          
        </div>
      ))}
    </div>
  );
}