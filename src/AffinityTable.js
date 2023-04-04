import React from "react";
import affinityImages from "./data/AffinityImages.json";

export default function AffinityTable({ affinityTotals, costTotals }) {
  function generateAffinityTable(affinityTotals, costTotals) {
    const affinityTableFormat = [];
    for (const affinity in affinityTotals) {
      const affinityImage = affinityImages[affinity];
      affinityTableFormat.push(
        <>
          <img src={affinityImage} title={affinity}></img> x{" "}
          {affinityTotals[affinity]} / {costTotals[affinity]}
          <br></br>
        </>
      );
    }

    return <>{affinityTableFormat}</>;
  }
  return <>{generateAffinityTable(affinityTotals, costTotals)}</>;
}
