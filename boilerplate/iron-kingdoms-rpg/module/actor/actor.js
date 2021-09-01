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

    //Calculate derived stats
    const stats = data.stats;
    data.def = {
      value: 0
    };
    data.arm = {
      value: 0
    };
    data.initiative = {
      value: 0
    };
    data.def.value = parseInt(stats.spd.value) + parseInt(stats.agl.value) + parseInt(stats.per.value) + parseInt(data.defModifiers.racialModifier.value) + parseInt(data.defModifiers.equipmentModifiers.value);
    data.arm.value = parseInt(stats.phy.value) + parseInt(data.armModifiers.shieldModifier.value) + parseInt(data.armModifiers.armorModifier.value) + parseInt(data.armModifiers.otherModifier.value);
    data.initiative.value = parseInt(stats.spd.value) + parseInt(stats.prw.value) + parseInt(stats.per.value) + parseInt(data.initiativeModifiers.equipamentModifier.value) + parseInt(data.initiativeModifiers.additionalModifier.value);

    data.line1.max = {value: 0};
    data.line2.max = {value: 0};
    data.line3.max = {value: 0};
    data.line4.max = {value: 0};
    data.line5.max = {value: 0};
    data.line6.max = {value: 0};

  
    //Calculate max health
    let l2value = Math.round(stats.phy.value/2);
    let l1value = stats.phy.value-l2value;
    data.line1.max.value = l1value;
    data.line2.max.value = l2value;

    let l4value = Math.round(stats.agl.value/2);
    let l3value = stats.agl.value-l4value;
    data.line3.max.value = l3value;
    data.line4.max.value = l4value;

    let l6value = Math.round(stats.int.value/2);
    let l5value = stats.int.value-l6value;
    data.line5.max.value = l5value;
    data.line6.max.value = l6value;
  }

}