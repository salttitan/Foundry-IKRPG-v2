/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ikrpgActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;

    // Make modifications to data here. For example:

    // Setup magic
    const selectedTradition = data.magic.tradition.label;
    const tradition = data.magic.tradition;
    const traditions = data.magic.traditions;

    if(tradition.resource) {
      tradition.resource.label = traditions[selectedTradition].resource.label;
      if (tradition.label === "focuser") {
        tradition.resource.max = data.stats.arc.value;
      } else if (tradition.label === "will_weaver") {
        tradition.resource.max = (data.stats.arc.value * 2);
      } else if (tradition.label === "none") {
        tradition.resource.max = 0;
      }
    }
  }

}