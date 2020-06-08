import { ActorSheetFlags } from './actor-flags.js';
import { ArchmagePrepopulate } from '../setup/utility-classes.js';

/**
 * Extend the basic ActorSheet with some very simple modifications
 */
export class ActorUnitSheet extends ActorSheet {

  /**
   * Extend and override the default options used by the 5e Actor Sheet
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: super.defaultOptions.classes.concat(['archmage', 'actor-sheet']),
      template: 'systems/w40k/templates/actor-unit-sheet.html',
      width: 800,
      height: 960,
      tabs: [
        { navSelector: ".tabs-primary", contentSelector: ".tabs-primary-content", initial: "powers" },
        { navSelector: ".tabs-sidebar", contentSelector: ".tabs-sidebar-content", initial: "abilities" }
      ]
    });
  }

  /* -------------------------------------------- */

  // get actorType() {
  //   return this.actor.data.type;
  // }

  /* -------------------------------------------- */

  /**
   * Add some extra data when rendering the sheet to reduce the amount of logic
   * required within the template.
   *
   * @return {Object} sheetData
   */
  getData() {
    const sheetData = super.getData();

    sheetData.viableModels = this._prepareViableModels(sheetData);
    sheetData.listModels = this._prepareListModels(sheetData);

    // Return data to the sheet
    return sheetData;
  }

  /**
   * Prepare list of model available for the Unit.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return viable_models
   */
  _prepareViableModels(sheetData) {
    var viable_models=[]
    for (var actor of game.actors._source){
      if(actor.type == "model" && actor.data.keywords.faction_main == sheetData.data.keywords.faction_main){
        var model = {
          "_id": actor._id, 
          "name": actor.name
        }
        viable_models.push(model)
      }
    }
    return viable_models;
  }

  /**
   * Prepare list of Models added to the Unit.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return list_models
   */
  _prepareListModels(sheetData) {
    var list_models=[];
    var this_unit = game.actors.get(sheetData.actor._id);
    var keys = Object.keys(this_unit.data.data.details.models.ids);
    var point_cost = sheetData.actor.data.details.base_points;
    for (var key of keys){
      var model = game.actors.get(this_unit.data.data.details.models.ids[key]);
      if (model != null) {
        point_cost+= model.data.data.details.total_points * this_unit.data.data.details.models.numbers[key].value
      }
      list_models.push(model);
    }
    sheetData.actor.data.details.total_points = point_cost;
    return list_models;
  }

  /* -------------------------------------------- */

  /**
   * Activate event listeners using the prepared sheet HTML
   * @param {HTML} html The prepared HTML object ready to be rendered into
   * the DOM.
   *
   * @return {undefined}
   */
  activateListeners(html) {
    super.activateListeners(html);
    let that = this;

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) {
      return;
    }
    // Weapon Attacks
    html.find('.btn.draw-unit').click(ev => {
      var models_dom = ev.currentTarget.previousElementSibling.children;

      for (var i=1; i<models_dom.length; i++) {
        var model_id = models_dom[i].id;
        var model = game.actors.get(model_id);

        var x_offset_counter = 0;
        var y_offset_counter = 0;
        for (var j=0; j<models_dom[i].children[1].value; j++) {
          var inches_size = model.data.data.details.base_size*0.03937007874;

          var x_offset = game.scenes.active.data.grid * x_offset_counter * inches_size;
          var y_offset = game.scenes.active.data.grid * y_offset_counter * inches_size;
          if (y_offset_counter == 4) {
            y_offset_counter=0;
            x_offset_counter++;
          } else {
            y_offset_counter++;
          }

          Token.create({
            name: model.name,
            x: game.scenes.active.data.lastClick[0]+x_offset,
            y: game.scenes.active.data.lastClick[1]+y_offset,
            displayName: "30",
            img: model.img,
            width: inches_size,
            height: inches_size,
            scale: 1,
            elevation: 0,
            lockRotation: false,
            rotation: 0,
            vision: true,
            hidden: false,
            actorId: model._id,
            actorLink: false,
            actorData: model.data,
            disposition: 1,
            displayBars: "50",
            bar1: {attribute: "profile.w"}
          });
        }
      }
    });

    // Recoveries.
    html.find('.recovery-roll.rollable').click(ev => {
      let actorData = this.actor.data.data;
      let totalRecoveries = actorData.attributes.recoveries.value;
      let recovery = $(ev.currentTarget).data();
      let formula = recovery.roll;

      // Handle average results.
      if (this.actor.getFlag('archmage', 'averageRecoveries')) {
        formula = actorData.attributes.level.value * (Number(actorData.attributes.recoveries.dice.replace('d', '')) / 2) + actorData.abilities.con.mod;
      }
      // Perform the roll.
      let roll = new Roll(Number(totalRecoveries) > 0 ? `${formula}` : `floor((${formula})/2)`);
      roll.roll();
      // Send to chat and reduce the number of recoveries.
      roll.toMessage({ flavor: `<div class="archmage chat-card"><header class="card-header"><h3 class="ability-usage">Recovery Roll${Number(totalRecoveries) < 1 ? ' (Half)' : ''}</h3></header></div>` });
      this.actor.update({
        'data.attributes.recoveries.value': Math.max(this.actor.data.data.attributes.recoveries.value - 1, 0),
        'data.attributes.hp.value': Math.min(this.actor.data.data.attributes.hp.max, this.actor.data.data.attributes.hp.value + roll.total)
      });
    });

    html.find('.icon__item.rollable').click(ev => {
      let actorData = this.actor.data.data;
      let item = $(ev.currentTarget).parents('.icon');
      let iconIndex = item.data('icon');

      if (actorData.icons[iconIndex]) {
        let icon = actorData.icons[iconIndex];
        let roll = new Roll(`${icon.bonus.value}d6cs>=5`);
        roll.roll().toMessage({
          flavor: `<div class="archmage chat-card"><header class="card-header"><h3 class="ability-usage ability-usage--recharge">Icon Roll</h3></header><div class="card-content"><div class="card-row"><div class="card-prop"><strong>${icon.name.value}:</strong> +${icon.bonus.value} ${icon.relationship.value}</div></div></div></div>`
        });
      }
    });

    html.find('.item-quantity.rollable').click(ev => {
      event.preventDefault();
      const li = event.currentTarget.closest(".item");
      const item = this.actor.getOwnedItem(li.dataset.itemId);
      let quantity = item.data.data.quantity;
      quantity.value = Number(quantity.value) + 1;
      let that = this;
      item.update({ "data.quantity": quantity }).then(item => {
        html.find('input[name="data.attributes.hp.max"]').trigger('change');
        that.render();
      });
    });

    html.find('.item-quantity.rollable').contextmenu(ev => {
      event.preventDefault();
      const li = event.currentTarget.closest(".item");
      const item = this.actor.getOwnedItem(li.dataset.itemId);
      let quantity = item.data.data.quantity;
      quantity.value = Number(quantity.value) - 1;
      quantity.value = quantity.value < 0 ? 0 : quantity.value;
      let that = this;
      item.update({ "data.quantity": quantity }).then(item => {
        html.find('input[name="data.attributes.hp.max"]').trigger('change');
        that.render();
      });
    });

    /* -------------------------------------------- */
    /*  Rollable Items                              */
    /* -------------------------------------------- */

    // html.find('.item .rollable').click(ev => {
    //   let itemId = Number($(ev.currentTarget).parents('.item').attr('data-item-id'));
    //   let Item = CONFIG.Item.entityClass;
    //   let item = new Item(this.actor.items.find(i => i.id === itemId), this.actor);
    //   item.roll();
    // });

    // Item summaries
    html.find('.item .item-name h4').click(event => this._onItemSummary(event));

    // Item Rolling
    html.find('.item .item-image').click(event => this._onItemRoll(event));
    html.find('.item--action h4').click(event => this._onItemRoll(event));
    html.find('.item--trait h4').click(event => this._onItemRoll(event));
    html.find('.item--nastier-special h4').click(event => this._onItemRoll(event));

    /* -------------------------------------------- */
    /*  Inventory
    /* -------------------------------------------- */

    // Create New Item
    html.find('.item-create').click(ev => {
      let header = event.currentTarget;
      let type = ev.currentTarget.getAttribute('data-item-type');
      let img = CONFIG.ARCHMAGE.defaultTokens[type] ? CONFIG.ARCHMAGE.defaultTokens[type] : CONFIG.DEFAULT_TOKEN;
      this.actor.createOwnedItem({
        name: 'New ' + type.capitalize(),
        type: type,
        img: img,
        data: duplicate(header.dataset)
      });
    });

    // html.find('.powers .item-create').on('contextmenu', ev => {
    html.find('.item-import').click(ev => {
      var itemType = ev.currentTarget.getAttribute('data-item-type');

      let validClasses = [
        'barbarian',
        'bard',
        'cleric',
        'commander',
        'druid',
        'fighter',
        'paladin',
        'ranger',
        'rogue',
        'sorcerer',
        'wizard'
      ];

      let powerClass = this.actor.data.data.details.class.value.toLowerCase();
      let powerLevel = this.actor.data.data.details.level;

      // Import from toolkit13.com
      if (validClasses.includes(powerClass)) {
        let prepop = new ArchmagePrepopulate();

        prepop.getPowersList(powerClass, powerLevel).then((res) => {
          var options = {
            width: 720,
            height: 640,
            classes: ['archmage-prepopulate']
          };

          for (let i = 0; i < res.powers.length; i++) {
            if (res.powers[i].usage !== null) {
              res.powers[i].usageClass = _getPowerClasses(res.powers[i].usage)[0];
            }
            else {
              res.powers[i].usageClass = 'other';
            }
          }

          var templateData = {
            powers: res.powers,
            class: powerClass,
            itemType: 'power' // @TODO: Make this not hardcoded.
          }

          let template = 'systems/w40k/templates/prepopulate/powers--list.html';
          renderTemplate(template, templateData).then(content => {
            let d = new Dialog({
              title: "Import Power",
              content: content,
              buttons: {
                cancel: {
                  icon: '<i class="fas fa-times"></i>',
                  label: "Cancel",
                  callback: () => null
                },
                submit: {
                  icon: '<i class="fas fa-check"></i>',
                  label: "Submit",
                  callback: dlg => _onImportPower(dlg, this.actor, {})
                }
              }
            }, options);
            d.render(true);
          });
        });
      }
      // Import from compendiums.
      else {
        // let powers = game.items.entities.filter(item => item.type == 'power');
        let compendium = game.packs.filter(p => p.metadata.name == powerClass);
        if (compendium.length > 0) {
          compendium[0].getContent().then(res => {
            var options = {
              width: 720,
              height: 640,
              classes: ['archmage-prepopulate']
            };

            let powers = res.sort((a, b) => {
              function sortTest(a, b) {
                if (a < b) {
                  return -1;
                }
                if (a > b) {
                  return 1;
                }
                return 0;
              }
              let aSort = [
                a.data.data.powerLevel.value,
                a.data.data.powerType.value,
                a.data.name
              ];
              let bSort = [
                b.data.data.powerLevel.value,
                b.data.data.powerType.value,
                b.data.name
              ];
              return sortTest(aSort[0], bSort[0]) || sortTest(aSort[1], bSort[1]) || sortTest(aSort[2], bSort[2]);
            }).map(p => {
              return {
                uuid: p.data._id,
                title: p.data.name,
                usage: p.data.data.powerUsage.value,
                usageClass: p.data.data.powerUsage.value ? _getPowerClasses(p.data.data.powerUsage.value)[0] : 'other',
                powerType: p.data.data.powerType.value,
                level: p.data.data.powerLevel.value,
              };
            });

            var templateData = {
              powers: powers,
              class: powerClass,
              itemType: 'power' // @TODO: Make this not hardcoded.
            }

            let dlgData = {
              powers: res
            };


            let template = 'systems/w40k/templates/prepopulate/powers--list.html';
            renderTemplate(template, templateData).then(content => {
              let d = new Dialog({
                title: "Import Power",
                content: content,
                buttons: {
                  cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Cancel",
                    callback: () => null
                  },
                  submit: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "Submit",
                    callback: dlg => _onImportPower(dlg, this.actor, dlgData)
                  }
                }
              }, options);
              d.render(true);
            });
          });
        }
        else {
          ui.notifications.error(`Class "${powerClass}" is not yet available for import.`);
        }
      }
    });

    function _getPowerClasses(inputString) {
      // Get the appropriate usage.
      let usage = 'other';
      let recharge = 0;
      let usageString = inputString !== null ? inputString.toLowerCase() : '';
      if (usageString.includes('will')) {
        usage = 'at-will';
      }
      else if (usageString.includes('recharge')) {
        usage = 'recharge';
        if (usageString.includes('16')) {
          recharge = 16;
        }
        else if (usageString.includes('11')) {
          recharge = 11;
        }
        else if (usageString.includes('6')) {
          recharge = 6;
        }
      }
      else if (usageString.includes('battle')) {
        usage = 'once-per-battle';
      }
      else if (usageString.includes('daily')) {
        usage = 'daily';
      }

      return [usage, recharge];
    }

    /**
     * Helper function to process relative links.
     *
     * This helper function processes relative links and replaces them as
     * external links to www.toolkit13.com.
     *
     * @param {String} inputString
     * @return {String}
     */
    function _replaceLinks(inputString) {
      var outputString = inputString;
      if (inputString !== undefined && inputString !== null) {
        if (inputString.includes('"/srd')) {
          outputString = inputString.replace(/\/srd/g, 'https://www.toolkit13.com/srd');
        }
      }
      return outputString;
    }

    function _onImportPower(dlg, actor, dlgData) {
      let $selected = $(dlg[0]).find('input[type="checkbox"]:checked');

      if ($selected.length <= 0) {
        return;
      }

      if (!dlgData.powers) {
        let prepop = new ArchmagePrepopulate();
        for (let input of $selected) {
          let $powerInput = $(input);
          var type = $powerInput.data('item-type');
          prepop.getPowerById($powerInput.data('uuid')).then((res) => {
            if (res.powers.length > 0) {
              let power = res.powers[0];
              let attack = {
                label: "Attack",
                type: "String",
                value: power.attack
              };
              // Get the appropriate usage.
              let usageArray = _getPowerClasses(power.usage);
              let usage = usageArray[0];
              let recharge = usageArray[1];
              // Get the appropriate action.
              let action = 'standard';
              let actionString = power.action !== null ? power.action.toLowerCase() : '';
              if (actionString.includes('move')) {
                action = 'move';
              }
              else if (actionString.includes('quick')) {
                action = 'quick';
              }
              else if (actionString.includes('interrupt')) {
                action = 'interrupt';
              }
              else if (actionString.includes('free')) {
                action = 'free';
              }
              actor.createOwnedItem({
                name: power.title,
                data: {
                  'powerUsage.value': usage,
                  'actionType.value': action,
                  'powerLevel.value': power.level,
                  'range.value': power.type,
                  'trigger.value': power.trigger,
                  'target.value': power.target,
                  'attack.value': power.attack,
                  'hit.value': power.hit,
                  'miss.value': power.miss,
                  'missEven.value': power.missEven,
                  'missOdd.value': power.missOdd,
                  'cost.value': power.cost,
                  'castBroadEffect.value': power.castBroadEffect,
                  'castPower.value': power.castPower,
                  'sustainedEffect.value': power.sustainedEffect,
                  'finalVerse.value': power.finalVerse,
                  'effect.value': _replaceLinks(power.effect),
                  'special.value': _replaceLinks(power.special),
                  'spellLevel3.value': power.spellLevel3,
                  'spellLevel5.value': power.spellLevel5,
                  'spellLevel7.value': power.spellLevel7,
                  'spellLevel9.value': power.spellLevel9,
                  'spellChain.value': power.spellChain,
                  'breathWeapon.value': power.breathWeapon,
                  'recharge.value': recharge,
                  'feats.adventurer.description.value': power.featAdventurer,
                  'feats.champion.description.value': power.featChampion,
                  'feats.epic.description.value': power.featEpic,
                },
                type: type
              });
              return;
            }
          });
        }
      }
      else {
        // Get the selected powers.
        let powerIds = [];
        $selected.each((index, element) => {
          powerIds.push(element.dataset.uuid);
        });

        // Retrieve the item entities.
        let powers = dlgData.powers
          // Filter down the power items by id.
          .filter(p => {
            return powerIds.includes(p.data._id)
          })
          // Prepare the items for saving.
          .map(p => {
            return duplicate(p);
          });

        // Create the owned items.
        actor.createOwnedItem(powers);
      }
    }

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      let itemId = $(ev.currentTarget).parents('.item').attr('data-item-id');
      let Item = CONFIG.Item.entityClass;
      // const item = new Item(this.actor.items.find(i => i.id === itemId), {actor: this.actor});
      const item = this.actor.getOwnedItem(itemId);
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      let li = $(ev.currentTarget).parents('.item');
      let itemId = li.attr('data-item-id');
      this.actor.deleteOwnedItem(itemId);
      li.slideUp(200, () => this.render(false));
    });

    /* -------------------------------------------- */
    /*  Miscellaneous
    /* -------------------------------------------- */

    /* Item Dragging */
    // Core handlers from foundry.js
    let dragHandler = ev => this._onDragItemStart(ev);
    // Custom handlers.
    // let dragHandlerArchmage = ev => this._onDragItemStartArchmage(ev);
    // let dragOverHandlerArchmage = ev => this._onDragOverArchmage(ev);
    // let dropHandlerArchmage = ev => this._onDropArchmage(ev);
    html.find('.item').each((i, li) => {
      li.setAttribute('draggable', true);
      li.addEventListener('dragstart', dragHandler, false);
      // li.addEventListener('dragstart', dragHandlerArchmage, false);
      // li.addEventListener('ondragover', dragOverHandlerArchmage, false);
      // li.addEventListener('ondrop', dropHandlerArchmage, false);
    });
  }

  _onDragItemStartArchmage(ev) {
    // @TODO: Remove this if obsolete.
    // Get the source item's array index.
    // let $self = $(ev.target);
    // ev.dataTransfer.dropEffect = 'move';
    // ev.dataTransfer.setData('itemIndex', $self.data('index'));
  }

  _onDragOverArchmage(ev) {
    // @TODO: Add class on hover.
  }

  _onDropArchmage(ev) {
    // @TODO: Remove class on drop.
  }

  /* -------------------------------------------- */

  /**
   * Handle click events for the Traits tab button to configure special Character Flags
   */
  _onConfigureFlags(event) {
    event.preventDefault();
    new ActorSheetFlags(this.actor).render(true);
  }

  /* -------------------------------------------- */

  /**
   * Handle rolling of an item from the Actor sheet, obtaining the Item instance and dispatching to it's roll method
   * @private
   */
  _onItemRoll(event) {
    event.preventDefault();
    let itemId = $(event.currentTarget).parents(".item").attr("data-item-id"),
      item = this.actor.getOwnedItem(itemId);
    item.roll();
  }

  /* -------------------------------------------- */

  /**
   * Handle rolling of an item from the Actor sheet, obtaining the Item instance and dispatching to it's roll method
   * @private
   */
  _onItemSummary(event) {
    event.preventDefault();
    let li = $(event.currentTarget).parents(".item");
    let item = this.actor.getOwnedItem(li.attr("data-item-id"));
    let chatData = item.getChatData({ secrets: this.actor.owner });

    // Toggle summary
    if (li.hasClass('item--power')) {
      if (li.hasClass("expanded")) {
        let summary = li.children(".item-summary");
        summary.slideUp(200, () => summary.remove());
      } else {
        let div = $(`<div class="item-summary"></div>`);
        let descrip = $(`<div class="item-description">${chatData.description.value}</div>`);
        let tags = $(`<div class="item-tags"></div>`);
        let props = $(`<div class="item-properties"></div>`);
        let effects = $(`<div class="item-effects"></div>`);
        chatData.tags.forEach(t => tags.append(`<span class="tag tag--${t.label.safeCSSId()}">${t.value}</span>`));
        if (chatData.range.value !== null) {
          props.append(`<div class="tag tag--property tag--${chatData.range.value.safeCSSId()}"><em>${chatData.range.value}</em></div>`)
        }
        chatData.properties.forEach(p => props.append(`<span class="tag tag--property tag--${p.label.safeCSSId()}"><strong>${p.label}:</strong> ${p.value}</span>`));
        chatData.effects.forEach(e => props.append(`<div class="tag tag--property tag--${e.label.safeCSSId()}"><strong>${e.label}:</strong> ${e.value}</div>`));
        chatData.feats.forEach(f => {
          if (f.isActive) {
            props.append(`<div class="tag tag--feat tag--${f.label.safeCSSId()}"><strong>${f.label}:</strong><div class="description">${f.description}</div></div>`);
          }
        });
        div.append(tags);
        div.append(props);
        div.append(effects);
        div.append(descrip);
        li.append(div.hide());
        div.slideDown(200);
      }
      li.toggleClass("expanded");
    }
  }
}