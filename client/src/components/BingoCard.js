// src/components/BingoCard.js
import React from 'react';

const BingoCard = ({ bingoCard, onPlayerSelect }) => {
  return (
    <div className="bingo-card">
      {bingoCard.map((item, index) => (
        <div key={index} className={`bingo-cell ${item.filled ? 'filled' : ''}`}>
          <p>{item.definition}</p>
          {item.filled ? (
            <p>{item.player.name}</p>
          ) : (
            <PlayerSelector onSelect={(player) => onPlayerSelect(index, player)} />
          )}
        </div>
      ))}
    </div>
  );
};

export default BingoCard;
