/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ikrpgActorSheet extends ActorSheet {
  
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
    return data;
  }

  activateListeners(html)
  {
    html.find(".inline-edit").change(this._onSkillEdit.bind(this));
    html.find(".item-delete").click(this._onItemDelete.bind(this));
    html.find(".main-stat").change(this._onMainStatEdit.bind(this));
    html.find(".vital-check").change(this._onDamageEdit.bind(this));

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

  _onMainStatEdit(event)
  {
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
        this.actor.update({data: {line1:{ current:{ value: (l1value-this.actor.data.data.line1.damage.value) }}}});
        this.actor.update({data: {line2:{ current:{ value: (l2value-this.actor.data.data.line2.damage.value) }}}});
        break;
      case("data.stats.agl.value"):
        let l3value = Math.round(statValue/2);
        let l4value = statValue-l3value;
        this.actor.update({data: {line3:{ max:{ value: l3value}}}});
        this.actor.update({data: {line4:{ max:{ value: l4value}}}});
        this.actor.update({data: {line3:{ current:{ value: (l3value-this.actor.data.data.line3.damage.value) }}}});
        this.actor.update({data: {line4:{ current:{ value: (l4value-this.actor.data.data.line4.damage.value) }}}});
        break;
      case("data.stats.int.value"):
        let l5value = Math.round(statValue/2);
        let l6value = statValue-l5value;
        this.actor.update({data: {line5:{ max:{ value: l5value}}}});
        this.actor.update({data: {line6:{ max:{ value: l6value}}}});
        this.actor.update({data: {line5:{ current:{ value: (l5value-this.actor.data.data.line5.damage.value) }}}});
        this.actor.update({data: {line6:{ current:{ value: (l6value-this.actor.data.data.line6.damage.value) }}}});
        break;
    }
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
}
