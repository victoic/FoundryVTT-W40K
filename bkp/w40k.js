import { W40K } from './setup/config.js';

import { ActorW40K } from './actor/actor.js';
import { DetachmentActorSheet } from './actor/detachment-sheet.js';
import { UnitActorSheet } from './actor/unit-sheet.js';
import { ModelActorSheet } from './actor/model-sheet.js';

import { DiceW40K } from './actor/dice.js';

import { ItemW40K } from './item/item.js';
import { ItemW40KSheet } from './item/item-sheet.js';

Hooks.once('init', async function() {

  CONFIG.debug.hooks = true;

  String.prototype.safeCSSId = function() {
    return encodeURIComponent(
      this.toLowerCase()
    ).replace(/%[0-9A-F]{2}/gi, '-');
  }

  game.archmage = {
      ActorW40K,
      DetachmentActorSheet,
      DiceW40K,
      ItemW40K,
      ItemW40KSheet
    };

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("archmage", ItemW40KSheet, { makeDefault: true });

  CONFIG.W40K = W40K;
  CONFIG.Actor.entityClass = ActorW40K;
  CONFIG.Item.entityClass = ItemW40K; //TODO
  CONFIG.Item.sheetClass = ItemW40KSheet; //TODO

  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('detachment', DetachmentActorSheet, {
    types: ["detachment"],
    makeDefault: true
  });
}