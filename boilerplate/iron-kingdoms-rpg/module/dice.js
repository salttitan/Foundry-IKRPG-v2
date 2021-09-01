export function meleeAttack({
    actorData = null,
    actionValue = null,
    boosted = false
    } = {}) {
    let baseDice = "2d6";
    let rollFormula = '2d6 + @actionValue';

    if (boosted) {
        rollFormula +=" + 1d6";
    }

    let rollData = {
        actionValue: actionValue
    };

    let messageData = {
        speaker: ChatMessage.getSpeaker()
    };

    new Roll(rollFormula, rollData).roll().toMessage(messageData);
}