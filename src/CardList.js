import React from "react";
import Card from "./Card";

export default function CardList({ cards, handleSelect, className, isEgo }) {
  return cards.map((card) => {
    return (
      <Card
        card={card}
        handleSelect={() => handleSelect(card.slug)}
        className={className}
        isEgo={isEgo}
      />
    );
  });
}
