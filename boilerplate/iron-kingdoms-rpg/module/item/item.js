/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class ikrpgItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */

  chatTemplate = {
    "rangedWeapon": "systems/iron-kingdoms-rpg/templates/item/partials/ranged-weapon-header-block.hbs",
    "meleeWeapon": "systems/iron-kingdoms-rpg/templates/item/chatPanels/melee-weapon-chat-panel.hbs",
    "spell":"systems/iron-kingdoms-rpg/templates/item/partials/spell-header-block.hbs"
  };

  async roll() {
    let chatData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker()
    };

    let cardData = {
      ...this.data,
      owner: this.actor.id,
      ownerData: this.actor.data
    };

    chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);

    chatData.roll = true;

    return ChatMessage.create(chatData);
  }
  prepareData() {
    super.prepareData();

    // Get the Item's data
    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    const data = itemData.data;

  }
}
