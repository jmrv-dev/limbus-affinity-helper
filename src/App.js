import React, { useState, useRef, useEffect } from "react";
import CardList from "./CardList";
import AffinityTable from "./AffinityTable";
import "./App.css";
import characters from "./data/characterData.json";
import egos from "./data/egoData.json";
import affinityImages from "./data/AffinityImages.json";

function App() {
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [selectedEgos, setSelectedEgos] = useState([]);
  const [filteredCharacterObjs, setFilteredCharacterObjs] = useState(() => {
    return characters;
  });
  const [filteredEgoObjs, setFilteredEgoObjs] = useState(() => {
    return egos;
  });
  const [filteredAffinities, setFilteredAffinities] = useState([]);
  const selectedCharacterObjs = selectedCharacters.map((characterName) =>
    characters.find((card) => characterName === card.slug)
  );
  const selectedEgoObjs = selectedEgos.map((egoName) =>
    egos.find((ego) => egoName === ego.slug)
  );
  const [viewEgo, setViewEgo] = useState(false);

  function calculateAffinity(selectedCharacterObjs) {
    let affinityTotals = {
      Wrath: 0,
      Lust: 0,
      Sloth: 0,
      Gluttony: 0,
      Gloom: 0,
      Pride: 0,
      Envy: 0,
    };
    selectedCharacterObjs.map((card) => {
      for (const affinity in card.affinities) {
        affinityTotals[affinity] += parseInt(card.affinities[affinity]);
      }
    });
    return affinityTotals;
  }

  function generateAffinityFilters(isEgo) {
    const affinityFilterFormat = [];
    Object.entries(affinityImages).map(([affinity, img]) => {
      affinityFilterFormat.push(
        <>
          <button
            className={
              filteredAffinities.includes(affinity)
                ? "button-selected"
                : "button"
            }
            onClick={() => handleFilterAffinity(affinity, isEgo)}
          >
            <img src={img}></img>
          </button>
        </>
      );
    });
    return affinityFilterFormat;
  }

  function handleSelectCard(name) {
    let newSelectedCharacters = [...selectedCharacters];
    if (newSelectedCharacters.includes(name))
      newSelectedCharacters = newSelectedCharacters.filter(
        (val) => val !== name
      );
    else if (selectedCharacters.length < 5) {
      newSelectedCharacters = [...selectedCharacters, name];
    }
    setSelectedCharacters(newSelectedCharacters);
  }
  function handleSelectEgo(name) {
    let newSelectedEgos = [...selectedEgos];
    if (newSelectedEgos.includes(name))
      newSelectedEgos = newSelectedEgos.filter((val) => val !== name);
    else newSelectedEgos = [...selectedEgos, name];
    setSelectedEgos(newSelectedEgos);
  }

  function handleClearTeam() {
    let newSelectedCharacters = [];
    setSelectedCharacters(newSelectedCharacters);
    setSelectedEgos(newSelectedCharacters);
  }

  function handleFilterAffinity(affinity, isEgo) {
    let newFilteredCardObjs = !isEgo ? characters : egos;
    const newFilteredAffinities = filteredAffinities.includes(affinity)
      ? filteredAffinities.filter((item) => item !== affinity)
      : [...filteredAffinities, affinity];
    if (newFilteredAffinities.length !== 0) {
      newFilteredAffinities.forEach((affinity) => {
        newFilteredCardObjs = newFilteredCardObjs.filter((identity) => {
          return affinity in identity.affinities;
        });
      });
    }
    setFilteredAffinities(newFilteredAffinities);
    !isEgo
      ? setFilteredCharacterObjs(newFilteredCardObjs)
      : setFilteredEgoObjs(newFilteredCardObjs);
  }

  function handleView() {
    let newView = viewEgo ? false : true;
    clearFilters();
    setViewEgo(newView);
  }

  function clearFilters() {
    setFilteredAffinities([]);
    setFilteredCharacterObjs(characters);
    setFilteredEgoObjs(egos);
  }

  const affinityTotals = calculateAffinity(selectedCharacterObjs);
  const costTotals = calculateAffinity(selectedEgoObjs);
  return (
    <>
      <div className="selected-panel row-flexbox">
        <div className="panel-box selected-characters column-flexbox">
          Selected Characters
          <CardList
            cards={selectedCharacterObjs}
            handleSelect={handleSelectCard}
            className={"selected-character"}
          />
        </div>
        <div className="panel-box selected-egos column-flexbox">
          Selected EGOs
          <CardList
            cards={selectedEgoObjs}
            handleSelect={handleSelectEgo}
            className={"selected-ego"}
            isEgo={true}
          />
        </div>
        <div className="panel-box affinity-report">
          Affinity Report
          <br></br>
          <AffinityTable
            affinityTotals={affinityTotals}
            costTotals={costTotals}
          />
        </div>
      </div>
      <button className="button" onClick={handleClearTeam}>
        Clear
      </button>
      <br></br>
      <hr></hr>
      {!viewEgo ? (
        <>
          <button className="button" onClick={handleView}>
            View EGOs
          </button>
          <div>Available Characters</div>
          <div>{generateAffinityFilters(false)}</div>
          <div className="panel-box available-panel">
            {/* TODO: Can be optimized as a set  */}
            <CardList
              cards={filteredCharacterObjs.filter(
                (identity) =>
                  !selectedCharacters.includes(identity.slug) &&
                  selectedCharacterObjs.every(
                    (selectedIdentity) =>
                      selectedIdentity.baseCharacter !== identity.baseCharacter
                  )
              )}
              handleSelect={handleSelectCard}
              className={"available-character"}
            />
            <CardList
              cards={filteredCharacterObjs.filter(
                (identity) =>
                  !selectedCharacters.includes(identity.slug) &&
                  !selectedCharacterObjs.every(
                    (selectedIdentity) =>
                      selectedIdentity.baseCharacter !== identity.baseCharacter
                  )
              )}
              className={"unavailable-character"}
            />
          </div>
        </>
      ) : (
        <>
          <button className="button" onClick={handleView}>
            View Identities
          </button>
          <div>Available EGOs</div>
          <div>{generateAffinityFilters(true)}</div>
          <div className="panel-box available-panel">
            {/* TODO: Can be optimized as a set  */}
            <CardList
              cards={filteredEgoObjs.filter(
                (ego) =>
                  !selectedEgos.includes(ego.slug) &&
                  selectedCharacterObjs.some(
                    (selectedIdentity) =>
                      selectedIdentity.baseCharacter === ego.character
                  )
              )}
              handleSelect={handleSelectEgo}
              className={"available-ego"}
              isEgo={true}
            />
            <CardList
              cards={filteredEgoObjs.filter(
                (ego) =>
                  !selectedEgos.includes(ego.slug) &&
                  !selectedCharacterObjs.some(
                    (selectedIdentity) =>
                      selectedIdentity.baseCharacter === ego.character
                  )
              )}
              handleSelect={handleSelectEgo}
              className={"unavailable-ego"}
              isEgo={true}
            />
          </div>
        </>
      )}
    </>
  );
}

export default App;
