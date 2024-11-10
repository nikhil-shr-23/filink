import React, { useRef } from 'react';
import Card from './Card';
import TrackerCard from './TrackerCard';
// ... other imports

function CardContainer({ cards, onDelete, onEdit }) {
  console.log('Cards in CardContainer:', cards); // Add this line

  const containerRef = useRef(null);

  const renderCard = (card) => {
    console.log('Rendering card:', card); // Add this line
    const props = { data: card, reference: containerRef, onDelete, onEdit };
    
    switch(card.taskType) {
      case 'tracker':
        return <TrackerCard key={card.id} {...props} />;
      default:
        return <Card key={card.id} {...props} />;
    }
  };

  return (
    <div ref={containerRef} className="flex flex-wrap gap-4 p-4">
      {cards.map(card => renderCard(card))}
    </div>
  );
}

export default CardContainer;
