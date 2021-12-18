import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js";

  const SPEED = 0.05
  const SPIKE_INTERVAL_MIN = 500
  const SPIKE_INTERVAL_MAX = 2000
  const worldElem = document.querySelector("[data-world]")
  
  let nextSpikeTime
  export function setupSpike() {
    nextSpikeTime = SPIKE_INTERVAL_MIN
    document.querySelectorAll("[data-spike]").forEach(spike => {
      spike.remove()
    })
  }
  
  export function updateSpike(delta, speedScale) {
    document.querySelectorAll("[data-spike]").forEach(spike => {
      incrementCustomProperty(spike, "--left", delta * speedScale * SPEED * -1)
      if (getCustomProperty(spike, "--left") <= -100) {
        spike.remove()
      }
    })
  
    if (nextSpikeTime <= 0) {
      createSpike()
      nextSpikeTime =
        randomNumberBetween(SPIKE_INTERVAL_MIN, SPIKE_INTERVAL_MAX) / speedScale
    }
    nextSpikeTime -= delta
  }
  
  export function getSpikeRects() {
    return [...document.querySelectorAll("[data-spike]")].map(spike => {
      return spike.getBoundingClientRect()
    })
  }
  
  function createSpike() {
    //warper
    const spike = document.createElement("img")
    spike.src="img/spike.png";
    spike.dataset.spike = true;
    spike.classList.add("spike")
    setCustomProperty(spike, "--left", 100);
    worldElem.append(spike)
  }

  function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }