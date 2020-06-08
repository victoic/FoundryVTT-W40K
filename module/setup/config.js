export const ARCHMAGE = {};
export const W40K = {};

W40K.weaponTypes = {
  "assault": "Assault",
  "heavy":"Heavy",
  "rapid_fire":"Rapid Fire",
  "grenade":"Grenade",
  "pistol":"Pistol",
  "":"",
}

W40K.unitTypes = {
  "":"",
  "hq_units":"HQ",
  "troops_units":"Troops",
  "dedicated_transport_units":"Dedicated Transport",
  "elites_units":"Elites",
  "fast_attack_units":"Fast Attack",
  "fortification_units":"Fortification",
  "flyers_units":"Flyers",
  "heavy_support_units":"Heavy Support",
  "lord_of_war_units":"Lord of War"
}


W40K.factions = {
  "":"",
  "Aeldari - Craftwords":"Aeldari - Craftwords",
  "Aeldari - Drukhari":"Aeldari - Drukhari",
  "Aeldari - FW Corsairs":"Aeldari - FW Corsairs",
  "Aeldari - Harlequins":"Aeldari - Harlequins",

  "Chaos - Chaos Knights":"Chaos - Chaos Knights",
  "Chaos - Chaos Space Marines":"Chaos - Chaos Space Marines",
  "Chaos - Daemons":"Chaos - Daemons",
  "Chaos - Death Guard":"Chaos - Death Guard",
  "Chaos - Gallerpox Infected":"Chaos - Gallerpox Infected",
  "Chaos - Renegades & Heretics":"Chaos - Renegades & Heretics",
  "Chaos - Servants of the Abyss":"Chaos - Servants of the Abyss",
  "Chaos - Thousands Sons":"Chaos - Thousands Sons",
  "Chaos - Titanicus Traitoris":"Chaos - Titanicus Traitoris",

  "Fallen":"Fallen",

  "Imperium - Adepta Sororitas":"Imperium - Adepta Sororitas",
  "Imperium - Adeptus Astra Telephatica":"Imperium - Adeptus Astra Telephatica",
  "Imperium - Adeptus Custodes":"Imperium - Adeptus Custodes",
  "Imperium - Adeptus Mechanicus":"Imperium - Adeptus Mechanicus",
  "Imperium - Adeptus Titanicus":"Imperium - Adeptus Titanicus",
  "Imperium - Astra Militarum":"Imperium - Astra Militarum",
  "Imperium - Blackstone Fortress":"Imperium - ",
  "Imperium - Blood Angels":"Imperium - Blood Angels",
  "Imperium - Dark Angels":"Imperium - Dark Angels",
  "Imperium - Death Korps of Krieg":"Imperium - Death Korps of Krieg",
  "Imperium - Deathwatch":"Imperium - Deathwatch",
  "Imperium - Elucidian Starstriders":"Imperium - Elucidian Starstriders",
  "Imperium - Elysian Drop Troops":"Imperium - Elysian Drop Troops",
  "Imperium - Grey Knights":"Imperium - Grey Knights",
  "Imperium - Imperial Knights":"Imperium - Imperial Knights",
  "Imperium - Inquisition":"Imperium - Inquisition",
  "Imperium - Legion of the Damned":"Imperium - Legion of the Damned",
  "Imperium - Oficio Assassinorum":"Imperium - Oficio Assassinorum",
  "Imperium - Sisters of Silence":"Imperium - Sisters of Silence",
  "Imperium - Space Marines":"Imperium - Space Marines",
  "Imperium - Space Wolves":"Imperium - Space Wolves",

  "Necrons":"Necrons",

  "Orks":"Orks",

  "T'au Empire":"T'au Empire",

  "Tyranids":"Tyranids",
  "Tyranids - Genestealer Cults":"Tyranids - Genestealer Cults",

  "Unaligned - Monsters and Gribblies":"Unaligned - Monsters and Gribblies"
}

// Power Settings
ARCHMAGE.powerSources = {
  'class': 'Class',
  'race': 'Race',
  'item': 'Item',
  'other': 'Other'
};

ARCHMAGE.powerTypes = {
  'power': 'Power',
  'feature': 'Feature',
  'talent': 'Talent',
  'maneuver': 'Maneuver',
  'spell': 'Spell',
  'other': 'Other'
};

ARCHMAGE.powerUsages = {
  'at-will': 'At Will',
  'once-per-battle': 'Once Per Battle',
  'recharge': 'Recharge',
  'daily': 'Daily',
  'other': 'Other'
};

ARCHMAGE.actionTypes = {
  'standard': 'Standard',
  'move': 'Move',
  'quick': 'Quick',
  'free': 'Free',
  'interrupt': 'Interrupt'
};

ARCHMAGE.defaultTokens = {
  'character': 'icons/svg/mystery-man.svg',
  'npc': 'icons/svg/eye.svg',
  'item': 'icons/svg/d20.svg',
  'power': 'icons/svg/d20.svg',
  'trait': 'icons/svg/regen.svg',
  'action': 'icons/svg/target.svg',
  'nastierSpecial': 'icons/svg/poison.svg',
  'tool': 'icons/svg/anchor.svg',
  'loot': 'icons/svg/daze.svg',
  'equipment': 'icons/svg/combat.svg'
};
