// Import Modules
import { ikrpgActor } from "./actor/actor.js";
import { ikrpgActorSheet } from "./actor/actor-sheet.js";
import { ikrpgItem } from "./item/item.js";
import { ikrpgItemSheet } from "./item/item-sheet.js";

async function preloadHandlebarsTemplate()
{
  const templatePaths = 
  [
    "systems/iron-kingdoms-rpg/templates/actor/partials/character-stat-block.hbs",
    "systems/iron-kingdoms-rpg/templates/actor/partials/character-header-block.hbs",
    "systems/iron-kingdoms-rpg/templates/actor/partials/character-vital-spiral-block.hbs",
    "systems/iron-kingdoms-rpg/templates/item/partials/melee-weapon-header-block.hbs",
    "systems/iron-kingdoms-rpg/templates/item/partials/ranged-weapon-header-block.hbs"
  ];

  return loadTemplates(templatePaths);
};

Hooks.once('init', async function() {

  game.iron_kingdoms_rpg = {
    ikrpgActor,
    ikrpgItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.entityClass = ikrpgActor;
  CONFIG.Item.entityClass = ikrpgItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("iron-kingdoms-rpg", ikrpgActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("iron-kingdoms-rpg", ikrpgItemSheet, { makeDefault: true });

  preloadHandlebarsTemplate();

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('times', function (times, opts) {
    var out = "";
    var i;
    var data = {};

    if ( times ) {
        for ( i = 0; i < times; i += 1 ) {
            data.index = i;
            out += opts.fn(this, {
                data: data
            });
        }
    } else {

        out = opts.inverse(this);
    }

    return out;
});

  Handlebars.registerHelper ('ifCond', function(v1, operator, v2){
    switch (operator)
    {
        case '==', '===', 'is':
            return v1==v2;
        case '!=', '!==':
            return v1!=v2;
        case '<':
            return v1<v2;
        case '<=':
          return v1<=v2;
        case '>':
          return v1>v2;
        case '>=':
          return v1>=v2;
        case '&&', 'and':
          if (v1 && v2) return true;
           else return false ;
        case '||', 'or':
          if (v1 || v2) return true;
          else return false ;
        default:
            return false
    }
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });
});