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
   * Prepare Model type specific data
   * @param data
   *
   * @return {undefined}
   */
  _prepareModelData(data) {
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
  }
  else if (data.details.detachment_type.value == "Auxiliary Support"){
    size = [
              [1,0,1], [1,0,1], [1,0,1], [1,0,1], [1,0,1], [1,0,1], [1,0,1], [1,0,1], [1,0,1]
            ]
    data.details.number_units.max=1;
  }
  else if (data.details.detachment_type.value == "Battalion"){
    size = [
              [2,0,3], [3,0,6], [0,0,23], [0,0,6], [0,0,3], [0,0,0], [0,0,2], [0,0,3], [0,0,0]
            ]
    data.details.number_units.max=this.sumUnits(size);
  }
  else if (data.details.detachment_type.value == "Brigade"){
    size = [
              [3,0,5], [6,0,12], [0,0,37], [3,0,8], [3,0,5], [0,0,0], [3,0,5], [0,0,2], [0,0,0]
            ]
    data.details.number_units.max=this.sumUnits(size);
  }
  else if (data.details.detachment_type.value == "Fortification Network"){
    size = [
              [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [1,0,3], [0,0,0], [0,0,0], [0,0,0]
            ]
    data.details.number_units.max=this.sumUnits(size);
  }
  else if (data.details.detachment_type.value == "Outrider"){
    size = [
              [1,0,2], [0,0,3], [0,0,17], [0,0,2], [3,0,6], [0,0,0], [0,0,2], [0,0,2], [0,0,0]
            ]
    data.details.number_units.max=this.sumUnits(size);
  }
  else if (data.details.detachment_type.value == "Patrol"){
    size = [
              [1,0,2], [1,0,3], [0,0,13], [0,0,2], [0,0,2], [0,0,0], [0,0,2], [0,0,2], [0,0,0]
            ]
    data.details.number_units.max=this.sumUnits(size);
  }
  else if (data.details.detachment_type.value == "Spearhead"){
    size = [
              [1,0,2], [0,0,3], [0,0,17], [0,0,2], [3,0,6], [0,0,0], [0,0,2], [0,0,2], [0,0,0]
            ]
    data.details.number_units.max=this.sumUnits(size);
  }
  else if (data.details.detachment_type.value == "Super-Heavy"){
    size = [
              [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [3,0,5]
            ]
    data.details.number_units.max=this.sumUnits(size);
  }
  else if (data.details.detachment_type.value == "Super-Heavy Auxiliary"){
    size = [
              [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [1,0,1]
            ]
    data.details.number_units.max=this.sumUnits(size);
  }
  else if (data.details.detachment_type.value == "Supreme Command"){
    size = [
              [3,0,5], [0,0,0], [0,0,7], [0,0,1], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,1]
            ]
    data.details.number_units.max=this.sumUnits(size);
  }
  else if (data.details.detachment_type.value == "Vanguard"){
    size = [
              [1,0,2], [0,0,3], [0,0,17], [3,0,6], [0,0,2], [0,0,0], [0,0,2], [0,0,2], [0,0,0]
            ]
    data.details.number_units.max=size.join().split(",").reduce(function(a,b){return +a + +b})
  }
  else {
    size = [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]]
    data.details.number_units.max=0;
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