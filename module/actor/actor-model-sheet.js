import { ActorSheetFlags } from './actor-flags.js';
import { ArchmagePrepopulate } from '../setup/utility-classes.js';

/**
 * Extend the basic ActorSheet with some very simple modifications
 */
export class ActorModelSheet extends ActorSheet {

  /**
   * Extend and override the default options used by the 5e Actor Sheet
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: super.defaultOptions.classes.concat(['archmage', 'actor-sheet']),
      template: 'systems/w40k/templates/actor-model-sheet.html',
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

    this._prepareCharacterItems(sheetData);

    // Return data to the sheet
    return sheetData;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;

    // Powers
    const powers = [];
    const equipment = [];

    // // Classes
    // const classes = [];

    // // Iterate through items, allocating to containers
    // let totalWeight = 0;
    for (let i of sheetData.items) {
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;
      // Feats
      if (i.type === 'power') {
        // Add labels.
        i.data.powerSource.label = CONFIG.ARCHMAGE.powerSources[i.data.powerSource.value];
        i.data.powerType.label = CONFIG.ARCHMAGE.powerTypes[i.data.powerType.value];
        i.data.powerUsage.label = CONFIG.ARCHMAGE.powerUsages[i.data.powerUsage.value];
        if (i.data.action) {
          i.data.actionTypes.label = CONFIG.ARCHMAGE.actionTypes[i.data.action.value];
        }
        powers.push(i);
      }

      if (i.type === 'tool' || i.type === 'loot' || i.type === 'equipment') {
        equipment.push(i);
      }
    }

    // Assign and return
    actorData.powers = powers;
    actorData.equipment = equipment;
  }

  /* -------------------------------------------- */

  getContext(){
    return this;
  }

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