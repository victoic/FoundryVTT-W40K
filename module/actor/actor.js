import { ArchmageUtility } from '../setup/utility-classes.js';
import { DiceArchmage } from './dice.js';

/**
 * Extend the base Actor class to implement additional logic specialized for D&D5e.
 */
export class ActorArchmage extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  prepareData() {
    super.prepareData();

    // Get the Actor's data object
    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Prepare Character data
    if (actorData.type === 'character') {
      this._prepareCharacterData(data);
    }
    else if (actorData.type === 'npc') {
      this._prepareNPCData(data);
    } 
    else if (actorData.type === 'detachment') {
      this._prepareDetachmentData(data)
    }
    else if (actorData.type === 'model') {
      this._prepareModelData(data)
    }
    else if (actorData.type === 'unit') {
      this._prepareUnitData(data)
    }
    // Return the prepared Actor data
    return actorData;
  }

  /* -------------------------------------------- */

  /**
   * Prepare Character type specific data
   * @param data
   *
   * @return {undefined}
   */
  _prepareCharacterData(data) {

    // Level, experience, and proficiency
    data.attributes.level.value = parseInt(data.attributes.level.value);
  }

  /* -------------------------------------------- */

  /**
   * Prepare NPC type specific data
   * @param data
   *
   * @return {undefined}
   */
  _prepareNPCData(data) {
  }

  /**
   * Prepare Detachment type specific data
   * @param data
   *
   * @return {undefined}
   */
  _prepareDetachmentData(data) {
    this.detachmentTypeChange(data)
  }

  /**
   * Prepare Unit type specific data
   * @param data
   *
   * @return {undefined}
   */
  _prepareUnitData(data) {
    this.sumPoints(data);
    this.prepareUnitType(data);
    this.addNewModelToList(data);
    this.validateModelList(data);
    if (data.keywords.faction_optional.name != "" && data.keywords.faction_optional.name != undefined) {
      data.keywords.faction_optional.has_optional = true;
    }
  }

  /**
   * Prepare Model type specific data
   * @param data
   *
   * @return {undefined}
   */
  _prepareModelData(data) {
  }

  /**
   * Add new_model as entry in models if not existent
   * @param data
   *
   * @return {undefined}
   */
   validateModelList(data) {
    for (var i=1; i<data.details.models.ids.length; i++) {
      if (data.details.models.numbers[i].value < data.details.models.numbers[i].min) {
        data.details.models.numbers[i].value = data.details.models.numbers[i].min;
      } else if (data.details.models.numbers[i].value > data.details.models.numbers[i].max) {
        data.details.models.numbers[i].value = data.details.models.numbers[i].max;
      }
    }
   }

  /**
   * Add new_model as entry in models if not existent
   * @param data
   *
   * @return {undefined}
   */
  addNewModelToList(data) {
    if (typeof(data.details.models) != "object") {
      data.details.models = [];
    }
    if (data.details.new_model.model_id == "") {
      return
    }
    for (var i=1; i<data.details.models.ids.length; i++) {
      if (data.details.models.ids[i] == data.details.new_model.model_id) {
        data.details.new_model.model_id = "";
        return;
      }
    }
    var new_model = {
      "min":1,
      "value":1,
      "max":1
    }
    var ids = data.details.models.ids;
    var numbers = data.details.models.numbers;

    ids.push(data.details.new_model.model_id);
    numbers.push(new_model);
    
    data.details.models.ids = ids;
    data.details.models.numbers = numbers;
    data.details.new_model.model_id = "";
  }

    /**
   * Sum all points in a unit, from models, weapons, wargear and others
   * @param size
   *
   * @return {undefined}
   */
   sumPoints(data) {
    data.details.total_points = data.details.base_points;
  }

  /**
   * Sum all the maximum numbers of units in a detachment
   * @param size
   *
   * @return sum
   */
  sumUnits(size) {
    size=size.join().split(",");
    var sum=0;
    for (var i = 2; i < size.length; i=i+3) {
      sum+=Number(size[i])
    }
    return sum;
  }

  /**
   * Resets the Detachment data based on the new Detachment type
   * @param data
   *
   * @return {undefined}
   */
  detachmentTypeChange(data){
    var size = []
    /*HQ, Troops, Dedicated Transport, Elites, Fast Attack, Fortification, Flyers, Heavy Support, Lord of War */
    if (data.details.detachment_type.value == "Air Wing"){
      size = [
              [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [3,0,5], [0,0,0], [0,0,0]
            ]
      data.details.number_units.max=this.sumUnits(size);
      data.details.command_points.value = 1;
    }
    else if (data.details.detachment_type.value == "Auxiliary Support"){
      size = [
                [1,0,1], [1,0,1], [1,0,1], [1,0,1], [1,0,1], [1,0,1], [1,0,1], [1,0,1], [1,0,1]
              ]
      data.details.number_units.max=1;
      data.details.command_points.value = -1;
    }
    else if (data.details.detachment_type.value == "Battalion"){
      size = [
                [2,0,3], [3,0,6], [0,0,23], [0,0,6], [0,0,3], [0,0,0], [0,0,2], [0,0,3], [0,0,0]
              ]
      data.details.number_units.max=this.sumUnits(size);
      data.details.command_points.value = 3;
    }
    else if (data.details.detachment_type.value == "Brigade"){
      size = [
                [3,0,5], [6,0,12], [0,0,37], [3,0,8], [3,0,5], [0,0,0], [3,0,5], [0,0,2], [0,0,0]
              ]
      data.details.number_units.max=this.sumUnits(size);
      data.details.command_points.value = 9;
    }
    else if (data.details.detachment_type.value == "Fortification Network"){
      size = [
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [1,0,3], [0,0,0], [0,0,0], [0,0,0]
              ]
      data.details.number_units.max=this.sumUnits(size);
      data.details.command_points.value = 0;
    }
    else if (data.details.detachment_type.value == "Outrider"){
      size = [
                [1,0,2], [0,0,3], [0,0,17], [0,0,2], [3,0,6], [0,0,0], [0,0,2], [0,0,2], [0,0,0]
              ]
      data.details.number_units.max=this.sumUnits(size);
      data.details.command_points.value = 1;
    }
    else if (data.details.detachment_type.value == "Patrol"){
      size = [
                [1,0,2], [1,0,3], [0,0,13], [0,0,2], [0,0,2], [0,0,0], [0,0,2], [0,0,2], [0,0,0]
              ]
      data.details.number_units.max=this.sumUnits(size);
      data.details.command_points.value = 0;
    }
    else if (data.details.detachment_type.value == "Spearhead"){
      size = [
                [1,0,2], [0,0,3], [0,0,17], [0,0,2], [3,0,6], [0,0,0], [0,0,2], [0,0,2], [0,0,0]
              ]
      data.details.number_units.max=this.sumUnits(size);
      data.details.command_points.value = 1;
    }
    else if (data.details.detachment_type.value == "Super-Heavy"){
      size = [
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [3,0,5]
              ]
      data.details.number_units.max=this.sumUnits(size);
      data.details.command_points.value = 3;
    }
    else if (data.details.detachment_type.value == "Super-Heavy Auxiliary"){
      size = [
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [1,0,1]
              ]
      data.details.number_units.max=this.sumUnits(size);
      data.details.command_points.value = 0;
    }
    else if (data.details.detachment_type.value == "Supreme Command"){
      size = [
                [3,0,5], [0,0,0], [0,0,7], [0,0,1], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,1]
              ]
      data.details.number_units.max=this.sumUnits(size);
      data.details.command_points.value = 1;
    }
    else if (data.details.detachment_type.value == "Vanguard"){
      size = [
                [1,0,2], [0,0,3], [0,0,17], [3,0,6], [0,0,2], [0,0,0], [0,0,2], [0,0,2], [0,0,0]
              ]
      data.details.number_units.max=this.sumUnits(size);
      data.details.command_points.value = 1;
    }
    else {
      size = [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]]
      data.details.number_units.max=0;
      data.details.command_points.value = 0;
    }
    
    var i=0;
    for (var unit in data.units) {
      data.units[unit].size.min = size[i][0];
      data.units[unit].size.value = size[i][1];
      data.units[unit].size.max = size[i][2];
      i++;
      if (i >= size.length) {
        break;
      }
    }
  }

  /**
   * Sets unit type icon and name based on selected label
   * @param data
   *
   * @return {undefined}
   */
  prepareUnitType(data) {
    var types = [
      ["","",""],
      ["hq_units", "HQ", "fa-skull fa-inverse"],
      ["troops_units", "Troops", "fa-chevron-right fa-inverse"],
      ["dedicated_transport_units", "Dedicated Transport", "fa-arrow-up fa-inverse"],
      ["elites_units", "Elites", "fa-plus fa-inverse"],
      ["fast_attack_units", "Fast Attack", "fa-bolt fa-inverse"],
      ["fortification_units", "Fortification", "fa-chess-rook fa-inverse"],
      ["flyers_units", "Flyers", "fa-feather-alt fa-inverse"],
      ["heavy_support_units", "Heavy Support", "fa-fire fa-inverse"],
      ["lord_of_war_units", "Lord of War", "fa-fist-raised fa-inverse"],
    ];

    for (var i=0; i<types.length; i++) {
      if (data.details.type.label == types[i][0]) {
        data.details.type.name = types[i][1];
        data.details.type.icon = types[i][2];
        break;
      }
    }

  }
  /* -------------------------------------------- */

  /**
   * Roll a generic ability test or saving throw.
   * Prompt the user for input on which variety of roll they want to do.
   * @param abilityId {String}    The ability id (e.g. "str")
   *
   * @return {undefined}
   */
  rollAbility(abilityId) {
    this.rollAbilityTest(abilityId);
  }

  /* -------------------------------------------- */

  /**
   * Roll an Ability Test
   * Prompt the user for input regarding Advantage/Disadvantage and any
   * Situational Bonus
   * @param abilityId {String}    The ability ID (e.g. "str")
   *
   * @return {undefined}
   */
  rollAbilityTest(abilityId) {
    let abl = this.data.data.abilities[abilityId];
    let parts = ['@mod', '@background'];
    let flavor = `${abl.label} Ability Test`;

    // Call the roll helper utility
    DiceArchmage.d20Roll({
      event: event,
      parts: parts,
      data: {
        mod: abl.mod + this.data.data.attributes.level.value,
        background: 0
      },
      backgrounds: this.data.data.backgrounds,
      title: flavor,
      alias: this.actor,
    });
  }
}