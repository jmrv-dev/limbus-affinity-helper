import React from "react";
import affinity_images from "./data/AffinityImages.json";

export default function Card({ card, handleSelect, className, isEgo }) {
  function affinityTotal(affinities) {
    const affinity_image_total = [];
    Object.entries(affinities).map(([affinity, count]) => {
      let affinity_image = affinity_images[affinity];
      for (let i = 0; i < count; i++) {
        affinity_image_total.push(
          <img src={affinity_image} title={affinity}></img>
        );
      }
    });
    return <>{affinity_image_total}</>;
  }
  function characterSpecialty(speciality) {
    const specialities = [];
    for (const i in speciality) {
      specialities.push(<>{speciality[i]} </>);
    }
    return <>{specialities}</>;
  }
  return !isEgo ? (
    <button
      onClick={handleSelect}
      className={`card row-flexbox ${className || ""}`}
    >
      <img src={card.images.small.src}></img>
      <div className="character-info">
        {card.name}
        <br></br>
        {affinityTotal(card.affinities)}
        <br></br>
        {characterSpecialty(card.speciality)}
      </div>
    </button>
  ) : (
    <button
      onClick={handleSelect}
      className={`card row-flexbox ${className || ""}`}
    >
      <img src={card.images.small.src}></img>
      <div className="character-info">
        {card.character} ({card.rarity})<br></br>
        {card.name}
        <br></br>
        {affinityTotal(card.affinities)}
      </div>
    </button>
  );
}
