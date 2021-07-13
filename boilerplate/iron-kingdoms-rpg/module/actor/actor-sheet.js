/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ikrpgActorSheet extends ActorSheet {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 1024,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats" }]
    });
  }
  
  get template() {
    const path = "systems/iron-kingdoms-rpg/templates/actor";
    return `${path}/${this.actor.data.type}-sheet.html`;
  }

  getData() 
  {
    const data = super.getData();
    console.log(data);
    data.skill_list=[];

    let previousSpec = '';
    for (const skill of data.items) {
      data.skill_list.push(skill);
    }
    this._prepareItemsAlpha(data);
    return data;
  }

  activateListeners(html)
  {
    html.find(".inline-edit").change(this._onSkillEdit.bind(this));
    html.find(".item-delete").click(this._onItemDelete.bind(this));
    html.find(".damage-stat").change(this.calculateDamageCapacity.bind(this));
    html.find(".arm-stat").change(this.calculateArm.bind(this));
    html.find(".initiative-stat").change(this.calculateInitiative.bind(this));
    html.find(".commandRange-stat").change(this.calculateCommandRange.bind(this));
    html.find(".willpower-stat").change(this.calculateWillpower.bind(this));
    html.find(".def-stat").change(this.calculateDef.bind(this));
    html.find(".vital-check").change(this._onDamageEdit.bind(this));
    html.find(".xp-stat").change(this.calculateLevel.bind(this));
    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      console.log(ev);
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    super.activateListeners(html);
  }
  _onItemDelete(event)
  {
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest(".item").dataset.itemId;

    console.log("deletando");
    console.log(itemId);

    return this.actor.deleteOwnedItem(itemId);
  }

  _onSkillEdit(event)
  {
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest(".item").dataset.itemId;
    let item =this.actor.getOwnedItem(itemId);
    let field = element.dataset.field;
    return item.update({[field]: element.value});
  }

  calculateDamageCapacity(event){
    let element = event.currentTarget;
    let statName = element.name;
    let statValue = element.value;
    switch(statName)
    {
      case("data.stats.phy.value"):
        let l1value = Math.round(statValue/2);
        let l2value = statValue-l1value;
        this.actor.update({data: {line1:{ max:{ value: l1value}}}});
        this.actor.update({data: {line2:{ max:{ value: l2value}}}});
        this.actor.update({data: {line1:{ current:{ value: (parseInt(l1value)-parseInt(this.actor.data.data.line1.damage.value?this.actor.data.data.line1.damage.value:0)) }}}});
        this.actor.update({data: {line2:{ current:{ value: (parseInt(l2value)-parseInt(this.actor.data.data.line2.damage.value?this.actor.data.data.line2.damage.value:0)) }}}});
        break;
      case("data.stats.agl.value"):
        let l3value = Math.round(statValue/2);
        let l4value = statValue-l3value;
        this.actor.update({data: {line3:{ max:{ value: l3value}}}});
        this.actor.update({data: {line4:{ max:{ value: l4value}}}});
        this.actor.update({data: {line3:{ current:{ value: (parseInt(l3value)-parseInt(this.actor.data.data.line3.damage.value?this.actor.data.data.line3.damage.value:0)) }}}});
        this.actor.update({data: {line4:{ current:{ value: (parseInt(l4value)-parseInt(this.actor.data.data.line4.damage.value?this.actor.data.data.line4.damage.value:0)) }}}});
        break;
      case("data.stats.int.value"):
        let l5value = Math.round(statValue/2);
        let l6value = statValue-l5value;
        this.actor.update({data: {line5:{ max:{ value: l5value}}}});
        this.actor.update({data: {line6:{ max:{ value: l6value}}}});
        this.actor.update({data: {line5:{ current:{ value: (parseInt(l5value)-parseInt(this.actor.data.data.line5.damage.value?this.actor.data.data.line5.damage.value:0)) }}}});
        this.actor.update({data: {line6:{ current:{ value: (parseInt(l6value)-parseInt(this.actor.data.data.line6.damage.value?this.actor.data.data.line6.damage.value:0)) }}}});
        break;
    }
  }

  calculateDef(event)
  {
    
    let statName = event.currentTarget.name;
    let statValue = event.currentTarget.value;

    let spd = this.actor.data.data.stats.spd.value?this.actor.data.data.stats.spd.value:0;
    let per = this.actor.data.data.stats.per.value?this.actor.data.data.stats.per.value:0;
    let agl = this.actor.data.data.stats.agl.value?this.actor.data.data.stats.agl.value:0;
    let racialMod = this.actor.data.data.defModifiers.racialModifier.value?this.actor.data.data.defModifiers.racialModifier.value:0;
    let equipmentMod = this.actor.data.data.defModifiers.equipmentModifiers.value?this.actor.data.data.defModifiers.equipmentModifiers.value:0;

    switch(statName)
    {
      case("data.stats.agl.value"):
        agl=statValue?statValue:0;
        break;
      case("data.stats.per.value"):
        per=statValue?statValue:0;
        break;
      case("data.stats.spd.value"):
        per=statValue?statValue:0;
        break;
    }

    let total = parseInt(spd)+parseInt(per)+parseInt(agl)+parseInt(racialMod)+parseInt(equipmentMod);

    this.actor.update({data:{def:{value:total}}});
  }

  calculateArm(event)
  {
    
    let statName = event.currentTarget.name;
    let statValue = event.currentTarget.value;

    let phy = this.actor.data.data.stats.phy.value?this.actor.data.data.stats.phy.value:0;
    let shieldMod = this.actor.data.data.armModifiers.shieldModifier.value?this.actor.data.data.armModifiers.shieldModifier.value:0;
    let armorMod = this.actor.data.data.armModifiers.armorModifier.value?this.actor.data.data.armModifiers.armorModifier.value:0;
    let otherMod = this.actor.data.data.armModifiers.otherModifier.value?this.actor.data.data.armModifiers.otherModifier.value:0;

    switch(statName)
    {
      case("data.stats.phy.value"):
        phy=statValue?statValue:0;
        break;
      case("data.armModifiers.otherModifier.value"):
        otherMod=statValue?statValue:0;
        break;
    }

    let total = parseInt(phy)+parseInt(shieldMod)+parseInt(armorMod)+parseInt(otherMod);

    this.actor.update({data:{arm:{value:total}}});
  }

  calculateInitiative(event)
  {
    
    let statName = event.currentTarget.name;
    let statValue = event.currentTarget.value;

    let spd = this.actor.data.data.stats.spd.value?this.actor.data.data.stats.spd.value:0;
    let prw = this.actor.data.data.stats.prw.value?this.actor.data.data.stats.prw.value:0;
    let per = this.actor.data.data.stats.per.value?this.actor.data.data.stats.per.value:0;
    let equipMod = this.actor.data.data.initiativeModifiers.equipamentModifier.value?this.actor.data.data.initiativeModifiers.equipamentModifier.value:0;
    let additionalMod = this.actor.data.data.initiativeModifiers.additionalModifier.value?this.actor.data.data.initiativeModifiers.additionalModifier.value:0;

    switch(statName)
    {
      case("data.stats.spd.value"):
        phy=statValue?statValue:0;
        break;
      case("data.stats.prw.value"):
        phy=statValue?statValue:0;
        break;
      case("data.stats.per.value"):
        phy=statValue?statValue:0;
        break;
      case("data.initiativeModifiers.additionalModifier.value"):
        additionalMod=statValue?statValue:0;
        break;
    }

    let total = parseInt(spd)+parseInt(prw)+parseInt(per)+parseInt(equipMod)+parseInt(additionalMod);

    this.actor.update({data:{initiative:{value:total}}});
  }

  calculateCommandRange(event)
  {
    
    let statName = event.currentTarget.name;
    let statValue = event.currentTarget.value;

    let int = this.actor.data.data.stats.int.value?this.actor.data.data.stats.int.value:0;
    let skill = this.actor.data.data.commandRangeModifier.commandSkill.value?this.actor.data.data.commandRangeModifier.commandSkill.value:0;
    let ability = this.actor.data.data.commandRangeModifier.abilityModifier.value?this.actor.data.data.commandRangeModifier.abilityModifier.value:0;

    switch(statName)
    {
      case("data.stats.int.value"):
        int=statValue?statValue:0;
        break;
      case("data.commandRangeModifier.commandSkill.value"):
        skill=statValue?statValue:0;
        break;
      case("data.commandRangeModifier.abilityModifier.value"):
        ability=statValue?statValue:0;
        break;
    }

    let total = parseInt(int)+parseInt(skill)+parseInt(ability);

    this.actor.update({data:{commandRange:{value:total}}});
  }

  calculateWillpower(event)
  {
    
    let statName = event.currentTarget.name;
    let statValue = event.currentTarget.value;

    let phy = this.actor.data.data.stats.phy.value?this.actor.data.data.stats.phy.value:0;
    let int = this.actor.data.data.stats.int.value?this.actor.data.data.stats.int.value:0;
    
    switch(statName)
    {
      case("data.stats.phy.value"):
        phy=statValue?statValue:0;
        break;
      case("data.stats.int.value"):
        otherMod=statValue?statValue:0;
        break;
    }

    let total = parseInt(phy)+parseInt(int);

    this.actor.update({data:{willPower:{value:total}}});
  }

  _onDamageEdit(event)
  {
    event.preventDefault();
    var l1damage = document.querySelectorAll(".line1:checked").length;
    var l2damage = document.querySelectorAll(".line2:checked").length;
    var l3damage = document.querySelectorAll(".line3:checked").length;
    var l4damage = document.querySelectorAll(".line4:checked").length;
    var l5damage = document.querySelectorAll(".line5:checked").length;
    var l6damage = document.querySelectorAll(".line6:checked").length;

    this.actor.update({data: {line1:{ current:{ value: (this.actor.data.data.line1.max.value-l1damage) }}}});
    this.actor.update({data: {line2:{ current:{ value: (this.actor.data.data.line2.max.value-l2damage) }}}});
    this.actor.update({data: {line3:{ current:{ value: (this.actor.data.data.line3.max.value-l3damage) }}}});
    this.actor.update({data: {line4:{ current:{ value: (this.actor.data.data.line4.max.value-l4damage) }}}});
    this.actor.update({data: {line5:{ current:{ value: (this.actor.data.data.line5.max.value-l5damage) }}}});
    this.actor.update({data: {line6:{ current:{ value: (this.actor.data.data.line6.max.value-l6damage) }}}});

    this.actor.update({data: {line1:{ damage:{ value: l1damage }}}});
    this.actor.update({data: {line2:{ damage:{ value: l2damage }}}});
    this.actor.update({data: {line3:{ damage:{ value: l3damage }}}});
    this.actor.update({data: {line4:{ damage:{ value: l4damage }}}});
    this.actor.update({data: {line5:{ damage:{ value: l5damage }}}});
    this.actor.update({data: {line6:{ damage:{ value: l6damage }}}});
  }

  calculateLevel(event){
    let statName = event.currentTarget.name;
    let statValue = event.currentTarget.value;

    if(statValue>=50)
    {
      if(statValue>=100)
      {
        this.actor.update({data:{header: { level: {value:"EPIC"}}}});
      }
      else
      {
        this.actor.update({data:{header: { level: {value:"VETERAN"}}}});
      }
    }
    else
    {
      this.actor.update({data:{header: { level: {value:"HERO"}}}});
    }
  }

  _prepareItemsAlpha(sheetData) {
    const actorData = sheetData.actor;
    const items = [];
    for (let i of sheetData.items) {
      items.push(i);
    };

    actorData.items = items;
  }
}
