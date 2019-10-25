/*
Copyright 2019, James J. Hayes

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program; if not, write to the Free Software Foundation, Inc., 59 Temple
Place, Suite 330, Boston, MA 02111-1307 USA.
*/

"use strict";

var HybridD20_VERSION = '0.1.0';

/*
 * This module loads the rules for Hybrid D20.  The HybridD20 module
 * contains methods that load rules for particular parts of the rules;
 * raceRules for character races, magicRules for spells, etc.  These member
 * methods can be called independently in order to use a subset of the
 * HybridD20 rules.  Similarly, the constant fields of HybridD20 (ALIGNMENTS,
 * FEATS, etc.) can be manipulated to modify the choices.
 */
function HybridD20() {

  if(window.SRD35 == null) {
    alert('The HybridD20 module requires use of the SRD35 module');
    return;
  }

  var rules = new ScribeRules('HybridD20', HybridD20_VERSION);
  rules.editorElements = HybridD20.initialEditorElements();
  SRD35.createViewers(rules, SRD35.VIEWERS);
  // Remove some character sheet elements that don't apply
  rules.defineSheetElement('Levels');
  rules.defineSheetElement('ExperienceInfo', 'Level', null, '');
  rules.defineSheetElement('Experience', 'ExperienceInfo/', '<b>Experience/Used/Needed</b>: %V');
  rules.defineSheetElement('Experience Used', 'ExperienceInfo/', '/%V');
  rules.defineSheetElement('Experience Needed', 'ExperienceInfo/', '/%V');
  rules.defineSheetElement('Allocated Exp', 'Level', null, '; ');
  rules.randomizeOneAttribute = HybridD20.randomizeOneAttribute;
  rules.makeValid = SRD35.makeValid;
  rules.ruleNotes = HybridD20.ruleNotes;
  HybridD20.abilityRules(rules);
  HybridD20.raceRules(rules, SRD35.LANGUAGES, SRD35.RACES);
  HybridD20.skillRules(rules, HybridD20.SKILLS);
  HybridD20.featRules(rules, HybridD20.FEATS.concat(HybridD20.POWERS));
  SRD35.descriptionRules(rules, SRD35.ALIGNMENTS, SRD35.DEITIES, SRD35.GENDERS);
  HybridD20.equipmentRules
    (rules, SRD35.ARMORS, SRD35.GOODIES, SRD35.SHIELDS, SRD35.WEAPONS);
  HybridD20.combatRules(rules);
  SRD35.movementRules(rules);
  HybridD20.magicRules(rules, SRD35.SCHOOLS);
  HybridD20.spellDescriptionRules(rules);
  rules.defineChoice('random', HybridD20.RANDOMIZABLE_ATTRIBUTES);
  Scribe.addRuleSet(rules);
  HybridD20.rules = rules;
}

// Arrays of choices
HybridD20.FEATS = [
  'Advance', 'Agile Maneuvers', 'Arcane Armor Training', 'Armor Proficiency',
  'Blind-Fight', 'Bravery', 'Camouflage', 'Canny Defense', 'Cleave',
  'Combat Reflexes', 'Deadly Aim', 'Deadly Precision', 'Death Attack',
  'Defensive Combat Training', 'Defensive Roll', 'Defensive Training',
  'Deflect Arrows', 'Disruptive', 'Dodge', 'Double Slice', 'Evasion',
  'Far Shot', 'Fast Stealth', 'Favored Enemy', 'Favored Terrain',
  'Flurry Of Blows', 'Follow-Through', 'Great Fortitude', 'Hidden Weapons',
  'Improve Grapple', 'Improved Bull Rush', 'Improved Critical',
  'Improved Defensive Fighting', 'Improved Disarm', 'Improved Feint',
  'Improved Great Fortitude', 'Improved Initiative', 'Improved Iron Will',
  'Improved Lightning Reflexes', 'Improved Overrun', 'Improved Shield Bash',
  'Improved Sunder', 'Improved Trip', 'Improved Unarmed Strike',
  'Improvised Weapon Use', 'Insightful Defense', 'Intimidating Prowess',
  'Iron Will', 'Ledge Walker', 'Lightning Reflexes', 'Lunge', 'Manyshot',
  'Mighty Throw', 'Mind Over Body', 'Mobility', 'Mounted Archery',
  'Mounted Combat', 'Nimble Step', 'No Retreat', 'Opportunist', 'Overhand Chop',
  'Penetrating Strike', 'Power Attack', 'Precise Shot', 'Precise Strike',
  'Quiet Death', 'Quivering Palm', 'Rapid Reload', 'Rapid Shot', 'Resiliency',
  'Riposte', 'Rogue Crawl', 'Shield Cover', 'Shield Deflection',
  'Shield Proficiency', 'Sidestep Charge', 'Slow Reactions', 'Snatch Arrows',
  'Sneak Attack', 'Sneak Attack (Bleeding Attack)',
  'Sneak Attack (Crippling Strike)', 'Stunning Fist', 'Successive Fire',
  'Surprise Attacks', 'Swift Tracker', 'Throw Anything', 'Toughness',
  'Trap Sense', 'Two-Weapon Defense', 'Two-Weapon Fighting', 'Uncanny Dodge',
  'Vital Strike', 'Weapon Finesse', 'Weapon Proficiency (Martial)',
  'Weapon Training', 'Whirlwind Attack', 'Wild Empathy',
  // Metamagic Feats
  'Empower Spell', 'Enlarge Spell', 'Extend Spell', 'Heighten Spell',
  'Maximize Spell', 'Quicken Spell', 'Silent Spell', 'Still Spell',
  'Widen Spell'
];
// Note: the order here handles dependencies among attributes when generating
// random characters
HybridD20.RANDOMIZABLE_ATTRIBUTES = [
  'charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom',
  'name', 'race', 'gender', 'alignment', 'deity', 'experience', 'feats',
  'skills', 'languages', 'hitPoints', 'armor', 'shield', 'weapons', 'spells',
  'goodies'
];
// TODO: Are these just more feats with unique costs or separate?
// TODO Domain Powers, Immunity, School Focus, School Specialization
HybridD20.POWERS = [
  'Animal Form', 'Arcane Arrow', 'Arcane Sight', 'Arcane Strike',
  'Arcane Theurgy', 'Armored Skin', 'Augment Summoning', 'Bardic Performance',
  'Blinding Speed', 'Blindsight', 'Bloodline Abilities', 'Call To Mind',
  'Clerical Ordainment', 'Combat Focus', 'Critical Feats (Bleeding)',
  'Critical Feats (Blinding)', 'Critical Feats (Deafening)',
  'Critical Feats (Devastating)', 'Critical Feats (Exhausting)',
  'Critical Feats (Sickening)', 'Critical Feats (Spell)',
  'Critical Feats (Staggering)', 'Critical Feats (Stunning)',
  'Critical Feats (Tiring)', 'Damage Reduction', 'Darkvision',
  'Dazzling Display', 'Deathless', 'Defensive Precognition', 
  'Defensive Prescience', 'Dimension Spring Attack', 'Druidical Initiation',
  'Energy Resistance', 'Eschew Materials', 'Fast Healing', 'Fey Touched',
  'Font Of Power', 'Free Casting', 'Free Manifesting',
  'Greater Arcane Resistance', 'Greater Dispelling Attack',
  'Greater Reaving Dispelling Attack', 'Hand Of The Apprentice',
  'Impromptu Sneak Attack', 'Inertial Armor', 'Ki Mastery', 'Know Direction',
  'Lay On Hands', 'Lesser Arcane Resistance', "Lion's Charge",
  'Low-Light Vision', 'Luck', 'Metamagic Adept', 'Metamagic Mastery',
  'Mind Over Body (Power)', 'Natural Spell', 'Offensive Precognition',
  'Offensive Prescience', 'Opportunistic Strike', 'Perfect Self',
  'Power Over Shadow', 'Pierce The Fog Of War', 'Psionic Awareness',
  'Psychic Warrior', 'Rage', 'Ranged Legerdemain', 'Reaving Dispelling Attack',
  'Regeneration', 'Scent', 'School Defense', 'Selective Channeling',
  'Slippery Mind', 'Smite Evil', 'Sorcery', 'Soulknife', 'Speak With Animals',
  'Spectral Tendril', 'Spell Immunity', 'Spell Mastery', 'Spell Penetration',
  'Spell Repertoire (Bard)', 'Spell Repertoire (Divine)',
  'Spell Repertoire (Druidical)', 'Spell Repertoire (Sorcerer)',
  'Spell Repertoire (Wizard)', 'Spell Resistance', 'Spell Synthesis',
  'Spell Theurgy', 'Spellcasting (Arcane)', 'Spellcasting (Divine)',
  'Spellcasting (Druidical)', 'Spontaneous Casting', 'Surprise Spells',
  'Tenacious Magic', 'Timeless Body', 'Touch Of Death', 'Trackless Step',
  'Trollborn', 'Turn Outsider', 'Turn Elemental', 'Wand Expertise',
  'Wild Shape', 'Wild Surge', 'Wizardry', 'Woodland Stride'
];
HybridD20.SPELLS = {

  'Acid Splash':'Conjuration',
  'Aid':'Abjuration',
  'Alarm':'Abjuration',
  'Alter Self':'Transmutation',
  'Animal Friendship':'Enchantment',
  'Animal Messenger':'Enchantment',
  'Animal Shapes':'Transmutation',
  'Animate Dead':'Necromancy',
  'Animate Objects':'Transmutation',
  'Antilife Shell':'Abjuration',
  'Antimagic Field':'Abjuration',
  'Antipathy/Sympathy':'Enchantment',
  'Arcane Eye':'Divination',
  'Arcane Gate':'Conjuration',
  'Arcane Lock':'Abjuration',
  'Armor Of Agathys':'Abjuration',
  'Arms Of Hadar':'Conjuaration',
  'Astral Projection':'Necromancy',
  'Augury':'Divination',
  'Aura Of Life':'Abjuration',
  'Aura Of Purity':'Abjuration',
  'Aura Of Vitality':'Evocation',
  'Awaken':'Transmutation',

  'Bane':'Enchantment',
  'Banishing Smite':'Abjuration',
  'Banishment':'Abjuration',
  'Barkskin':'Transmutation',
  'Beacon Of Hope':'Abjuration',
  'Beast Sense':'Divination',
  'Bestow Curse':'Necromancy',
  'Bigby\'s Hand':'Evocation',
  'Blade Barrier':'Evocation',
  'Blade Ward':'Abjuration',
  'Bless':'Enchantment',
  'Blight':'Necromancy',
  'Blinding Smite':'Evocation',
  'Blindness/Deafness':'Necromancy',
  'Blink':'Transmutation',
  'Blur':'Illusion',
  'Branding Smite':'Evocation',
  'Burning Hands':'Evocation',

  'Call Lightning':'Evocation',
  'Calm Emotions':'Enchantment',
  'Chain Lightning':'Evocation',
  'Charm Person':'Enchantment',
  'Chill Touch':'Necromancy',
  'Chromatic Orb':'Evocation',
  'Circle Of Death':'Necromancy',
  'Circle Of Power':'Abjuration',
  'Clairvoyance':'Divination',
  'Clone':'Necromancy',
  'Cloud Of Daggers':'Conjuration',
  'Cloudkill':'Conjuration',
  'Color Spray':'Illusion',
  'Command':'Enchantment',
  'Commune':'Divination',
  'Commune With Nature':'Divination',
  'Compelled Duel':'Enchantment',
  'Comprehend Languages':'Divination',
  'Compulsion':'Enchantment',
  'Cone Of Cold':'Evocation',
  'Confusion':'Enchantment',
  'Conjure Animals':'Conjuration',
  'Conjure Barrage':'Conjuration',
  'Conjure Celestial':'Conjuration',
  'Conjure Elemental':'Conjuration',
  'Conjure Fey':'Conjuration',
  'Conjure Minor Elementals':'Conjuration',
  'Conjure Volley':'Conjuration',
  'Conjure Woodland Beings':'Conjuration',
  'Contact Other Plane':'Divination',
  'Contagion':'Necromancy',
  'Continual Flame':'Evocation',
  'Control Water':'Transmutation',
  'Control Weather':'Transmutation',
  'Cordon Of Arrows':'Transmutation',
  'Counterspell':'Abjuration',
  'Create Food And Water':'Conjuration',
  'Create Or Destroy Water':'Transmutation',
  'Create Undead':'Necromancy',
  'Creation':'Illusion',
  'Crown Of Madness':'Enchantment',
  'Crusader\'s Mantle':'Evocation',
  'Cure Wounds':'Evocation',

  'Dancing Lights':'Evocation',
  'Darkness':'Evocation',
  'Darkvision':'Transmutation',
  'Daylight':'Evocation',
  'Death Ward':'Abjuration',
  'Delayed Blast Fireball':'Evocation',
  'Demiplane':'Conjuration',
  'Destructive Wave':'Evocation',
  'Detect Evil And Good':'Divination',
  'Detect Magic':'Divination',
  'Detect Poison And Disease':'Divination',
  'Detect Thoughts':'Divination',
  'Dimension Door':'Conjuration',
  'Disguise Self':'Illusion',
  'Disintegrate':'Transmutation',
  'Dispel Evil And Good':'Abjuration',
  'Dispel Magic':'Abjuration',
  'Dissonant Whispers':'Enchantment',
  'Divination':'Divination',
  'Divine Favor':'Evocation',
  'Divine Word':'Evocation',
  'Dominate Beast':'Enchantment',
  'Dominate Monster':'Enchantment',
  'Dominate Person':'Enchantment',
  'Drawmij\'s Instant Summons':'Conjuration',
  'Dream':'Illusion',
  'Druidcraft':'Transmutation',

  'Earthquake':'Evocation',
  'Eldritch Blast':'Evocation',
  'Elemental Weapon':'Transmutation',
  'Enhance Ability':'Transmutation',
  'Enlarge/Reduce':'Transmutation',
  'Ensnaring Strike':'Conjuration',
  'Entangle':'Conjuration',
  'Enthrall':'Enchantment',
  'Etherealness':'Transmutation',
  'Evard\'s Black Tentacles':'Conjuration',
  'Expeditious Retreat':'Transmutation',
  'Eyebite':'Necromancy',

  'Fabricate':'Transmutation',
  'Faerie Fire':'Evocation',
  'False Life':'Necromancy',
  'Fear':'Illusion',
  'Feather Fall':'Transmutation',
  'Feeblemind':'Enchantment',
  'Feign Death':'Necromancy',
  'Find Familiar':'Conjuration',
  'Find Steed':'Conjuration',
  'Find The Path':'Divination',
  'Find Traps':'Divination',
  'Finger Of Death':'Necromancy',
  'Fire Bolt':'Evocation',
  'Fire Shield':'Evocation',
  'Fire Storm':'Evocation',
  'Fireball':'Evocation',
  'Flame Blade':'Evocation',
  'Flame Strike':'Evocation',
  'Flaming Sphere':'Conjuration',
  'Flesh To Stone':'Transmutation',
  'Fly':'Transmutation',
  'Fog Cloud':'Conjuration',
  'Forbiddance':'Abjuration',
  'Forcecage':'Evocation',
  'Foresight':'Divination',
  'Freedom Of Movement':'Abjuration',
  'Friends':'Enchantment',

  'Gaseous Form':'Transmutation',
  'Gate':'Conjuration',
  'Geas':'Enchantment',
  'Gentle Repose':'Necromancy',
  'Giant Insect':'Transmutation',
  'Glibness':'Transmutation',
  'Globe Of Invulnerability':'Abjuration',
  'Glyph Of Warding':'Abjuration',
  'Good Hope':'Enchantment',
  'Goodberry':'Transmutation',
  'Grasping Vine':'Conjuration',
  'Grease':'Conjuration',
  'Greater Invisibility':'Illusion',
  'Greater Restoration':'Abjuration',
  'Guardian Of Faith':'Conjuration',
  'Guards And Wards':'Abjuration',
  'Guidance':'Divination',
  'Guiding Bolt':'Evocation',
  'Gust Of Wind':'Evocation',

  'Hail Of Thorns':'Conjuration',
  'Hallow':'Evocation',
  'Hallucinatory Terrain':'Illusion',
  'Harm':'Necromancy',
  'Haste':'Transmutation',
  'Heal':'Evocation',
  'Healing Word':'Evocation',
  'Heat Metal':'Transmutation',
  'Hellish Rebuke':'Evocation',
  'Heroes\' Feast':'Conjuration',
  'Heroism':'Enchantment',
  'Hex':'Enchantment',
  'Hold Monster':'Enchantment',
  'Hold Person':'Enchantment',
  'Holy Aura':'Abjuration',
  'Hunger Of Hadar':'Conjuration',
  'Hunter\'s Mark':'Divination',
  'Hypnotic Pattern':'Illusion',

  'Ice Storm':'Evocation',
  'Identify':'Divination',
  'Imprisonment':'Abjuration',
  'Incendiary Cloud':'Conjuration',
  'Inflict Wounds':'Necromancy',
  'Insect Plague':'Conjuration',
  'Invisibility':'Illusion',

  'Jump':'Transmutation',

  'Knock':'Transmutation',

  'Legend Lore':'Divination',
  'Leomund\'s Secret Chest':'Conjuraion',
  'Leomund\'s Tiny Hut':'Evocation',
  'Lesser Restoration':'Abjuration',
  'Levitate':'Transmutation',
  'Light':'Evocation',
  'Lightning Arrow':'Transmutation',
  'Lightning Bolt':'Evocation',
  'Locate Animal Or Plant':'Divination',
  'Locate Creature':'Divination',
  'Locate Object':'Divination',
  'Longstrider':'Transmutation',

  'Mage Armor':'Conjuration',
  'Mage Hand':'Conjuration',
  'Magic Circle':'Abjuration',
  'Magic Jar':'Necromancy',
  'Magic Missile':'Evocation',
  'Magic Mouth':'Illusion',
  'Magic Weapon':'Transmutation',
  'Major Image':'Illusion',
  'Mass Cure Wounds':'Conjuration',
  'Mass Heal':'Conjuration',
  'Mass Healing Word':'Evocation',
  'Mass Suggestion':'Enchantment',
  'Maze':'Conjuration',
  'Meld Into Stone':'Transmutation',
  'Melf\'s Acid Arrow':'Evocation',
  'Mending':'Transmutation',
  'Message':'Transmutation',
  'Meteor Swarm':'Evocation',
  'Mind Blank':'Abjuration',
  'Mind Fog':'Enchantment',
  'Mordenkainen\'s Private Sanctum':'Abjuration',
  'Mordenkainen\'s Sword':'Evocation',
  'Move Earth':'Transmutation',

  'Nondetection':'Abjuration',
  'Nystul\'s Magic Aura':'Illusion',

  'Otiluke\'s Freezing Sphere':'Evocation',
  'Otiluke\'s Resilient Sphere':'Evocation',
  'Otto\'s Irresistable Dance':'Enchantment',

  'Pass Without Trace':'Abjuration',
  'Passwall':'Transmutation',
  'Phantasmal Force':'Illusion',
  'Phantasmal Killer':'Illusion',
  'Phantom Steed':'Illusion',
  'Planar Ally':'Conjuration',
  'Planar Binding':'Abjuration',
  'Plane Shift':'Conjuration',
  'Plant Growth':'Transmutation',
  'Poison Spray':'Conjuration',
  'Polymorph':'Transmutation',
  'Power Word Heal':'Evocation',
  'Power Word Kill':'Enchantment',
  'Power Word Stun':'Enchantment',
  'Prayer Of Healing':'Evocation',
  'Prestidigitation':'Transmutation',
  'Prismatic Spray':'Evocation',
  'Prismatic Wall':'Abjuration',
  'Produce Flame':'Conjuration',
  'Programmed Illusion':'Illusion',
  'Project Image':'Illusion',
  'Protection From Energy':'Abjuration',
  'Protection From Evil And Good':'Abjuration',
  'Protection From Poison':'Abjuration',
  'Purify Food And Drink':'Transmutation',

  'Raise Dead':'Necromancy',
  'Rary\'s Telepathic Bond':'Divination',
  'Ray Of Enfeeblement':'Necromancy',
  'Ray Of Frost':'Evocation',
  'Ray Of Sickness':'Necromancy',
  'Regenerate':'Transmutation',
  'Reincarnate':'Transmutation',
  'Remove Curse':'Abjuration',
  'Resistance':'Abjuration',
  'Resurrection':'Necromancy',
  'Reverse Gravity':'Transmutation',
  'Revivify':'Conjuration',
  'Rope Trick':'Transmutation',

  'Sacred Flame':'Evocation',
  'Sanctuary':'Abjuration',
  'Scorching Ray':'Evocation',
  'Scrying':'Divination',
  'Searing Smite':'Evocation',
  'See Invisibility':'Divination',
  'Seeming':'Illusion',
  'Sending':'Evocation',
  'Sequester':'Transmutation',
  'Shapechange':'Transmutation',
  'Shatter':'Evocation',
  'Shield':'Abjuration',
  'Shield Of Faith':'Abjuration',
  'Shillelagh':'Transmutation',
  'Shocking Grasp':'Evocation',
  'Silence':'Illusion',
  'Silent Image':'Illusion',
  'Simulacrum':'Illusion',
  'Sleep':'Enchantment',
  'Sleet Storm':'Conjuration',
  'Slow':'Transmutation',
  'Spare The Dying':'Necromancy',
  'Speak With Animals':'Divination',
  'Speak With Dead':'Necromancy',
  'Speak With Plants':'Transmutation',
  'Spider Climb':'Transmutation',
  'Spike Growth':'Transmutation',
  'Spike Stones':'Transmutation',
  'Spirit Guardians':'Conjuration',
  'Spiritual Weapon':'Evocation',
  'Staggering Smite':'Evocation',
  'Stinking Cloud':'Conjuration',
  'Stone Shape':'Transmutation',
  'Stoneskin':'Abjuration',
  'Storm Of Vengeance':'Conjuration',
  'Suggestion':'Enchantment',
  'Sunbeam':'Evocation',
  'Sunburst':'Evocation',
  'Swift Quiver':'Transmutation',
  'Symbol':'Abjuration',

  'Tasha\'s Hideous Laughter':'Enchantment',
  'Telekinesis':'Transmutation',
  'Telepathy':'Evocation',
  'Teleport':'Conjuration',
  'Teleportation Circle':'Conjuration',
  'Tenser\'s Floating Disk':'Conjuration',
  'Thaumaturgy':'Transmutation',
  'Thorn Whip':'Transmutation',
  'Thunderous Smite':'Evocation',
  'Thunderwave':'Evocation',
  'Time Stop':'Transmutation',
  'Tongues':'Divination',
  'Transport Via Plants':'Conjuration',
  'Tree Stride':'Conjuration',
  'True Polymorph':'Transmutation',
  'True Resurrection':'Necromancy',
  'True Seeing':'Divination',
  'True Strike':'Divination',
  'Tsunami':'Conjuration',

  'Unseen Servant':'Conjuration',

  'Vampiric Touch':'Necromancy',
  'Vicious Mockery':'Enchantment',

  'Wall Of Force':'Evocation',
  'Wall Of Ice':'Evocation',
  'Wall Of Stone':'Evocation',
  'Wall Of Thorns':'Conjuration',
  'Warding Bond':'Abjuration',
  'Water Breathing':'Transmutation',
  'Water Walk':'Transmutation',
  'Web':'Conjuration',
  'Weird':'Illusion',
  'Wind Walk':'Transmutation',
  'Wind Wall':'Evocation',
  'Wish':'Conjuration',
  'Witch Bolt':'Evocation',
  'Word Of Recall':'Conjuration',
  'Wrathful Smite':'Evocation',

  'Zone Of Truth':'Enchantment'

};
HybridD20.SKILLS = [
  'Acrobatics:dex', 'Appraise:int', 'Athletics:str', 'Bluff:cha',
  'Combat (HTH):str', 'Combat (Fire):dex', 'Concentration:wis',
  'Craft (Alchemy):int', 'Craft (Smith):str', 'Craft (Construction):wis',
  'Craft (Fine Art):dex', 'Diplomacy:cha', 'Disable Device:int', 'Drive:dex',
  'Endurance:con', 'Fly:dex', 'Handle Animal:cha', 'Heal:wis',
  'Knowledge (Lore):int', 'Knowledge (Planes):int', 'Knowledge (War):int',
  'Linguistics:int', 'Perception:wis', 'Perform (Acting):cha',
  'Perform (Dance):cha', 'Perform (Music):cha)', 'Profession (Mining):wis',
  'Profession (Sailing):wis', 'Sleight Of Hand:dex', 'Spellcraft:int',
  'Stealth:dex', 'Streetwise:cha', 'Survival:wis'
];

/* Defines the rules related to character abilities. */
HybridD20.abilityRules = function(rules) {

  rules.defineRule('experienceNeeded',
    'level', '=', 'Math.floor(1000 * (Math.pow(1.1, source + 1) - 1))'
  );
  rules.defineRule('experienceUsed',
    '', '=', '0',
    'allocatedExp.Abilities', '+', null
  );
  rules.defineRule('level',
    'experience', '=', 'Math.floor(Math.log(source / 1000 + 1) / Math.log(1.1))'
  );

  // Ability modifier computation
  for(var ability in {'charisma':'', 'constitution':'', 'dexterity':'',
                      'intelligence':'', 'strength':'', 'wisdom':''}) {
    rules.defineRule(ability, ability + 'Adjust', '+', null);
    rules.defineRule
      (ability + 'Modifier', ability, '=', 'Math.floor((source - 10) / 2)');
    rules.defineNote(ability + ':%V (%1)');
    rules.defineRule(ability + '.1', ability + 'Modifier', '=', null);
    // Experience bump costs 3 * new value for each increment, so
    // cost(new, bumps) = bumps * new * 3 - (bumps * (bumps - 1) * 0.5) * 3
    rules.defineRule('subtractAllocatedExp.' + ability, ability + 'Adjust', '=', 'source * (source - 1) * 1.5');
    rules.defineRule('allocatedAbilityExp.' + ability,
      ability + 'Adjust', '=', '3 * source',
      ability, '*', null,
      'subtractAllocatedExp.' + ability, '+', '-source'
    );
    rules.defineRule
      ('allocatedExp.Abilities', 'allocatedAbilityExp.' + ability, '+=', null);
  }

  // Effects of ability modifiers
  rules.defineRule('combatNotes.constitutionHitPointsAdjustment',
    'constitutionModifier', '=', null,
    'level', '*', null
  );
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'dexterityModifier', '=', null
  );
  rules.defineRule('combatNotes.dexterityAttackAdjustment',
    'dexterityModifier', '=', null
  );
  rules.defineRule('combatNotes.strengthAttackAdjustment',
    'strengthModifier', '=', null
  );
  rules.defineRule('combatNotes.strengthDamageAdjustment',
    'strengthModifier', '=', null
  );

  // Effects of the notes computed above
  rules.defineRule
    ('armorClass', 'combatNotes.dexterityArmorClassAdjustment', '+', null);
  rules.defineRule
    ('hitPoints', 'combatNotes.constitutionHitPointsAdjustment', '+', null);
  rules.defineRule
    ('meleeAttack', 'combatNotes.strengthAttackAdjustment', '+', null);
  rules.defineRule
    ('rangedAttack', 'combatNotes.dexterityAttackAdjustment', '+', null);

};

/* Defines the rules related to combat. */
HybridD20.combatRules = function(rules) {

  rules.defineRule('armorClass',
    '', '=', '10',
    'armor', '+', 'SRD35.armorsArmorClassBonuses[source]',
    'shield', '+', 'source == "None" ? null : ' +
                   'source == "Tower" ? 4 : source.match(/Heavy/) ? 2 : 1'
  );
  rules.defineRule('baseAttack',
    'skills.Combat (HTH)', '=', null,
    'skills.Combat (Fire)', '^=', null
  );
  rules.defineRule('combatManeuverBonus',
    'baseAttack', '=', null,
    'strengthModifier', '+', null
  );
  rules.defineRule('combatManeuverDefense',
    'baseAttack', '=', null,
    'strengthModifier', '+', null,
    'dexterityModifier', '+', null
  );
  rules.defineSheetElement(
    'CombatManeuver', 'CombatStats/',
    '<b>Combat Maneuver Bonus/Defense</b>: %V', '/'
  );
  rules.defineSheetElement('Combat Maneuver Bonus', 'CombatManeuver/', '%V');
  rules.defineSheetElement('Combat Maneuver Defense', 'CombatManeuver/', '%V');
  rules.defineRule('initiative', 'dexterityModifier', '=', null);
  rules.defineRule('meleeAttack', 'skills.Combat (HTH)', '=', null);
  rules.defineRule('rangedAttack', 'skills.Combat (Fire)', '=', null);
  rules.defineRule('save.Fortitude', 'constitutionModifier', '=', null);
  rules.defineRule('save.Reflex', 'dexterityModifier', '=', null);
  rules.defineRule('save.Will', 'wisdomModifier', '=', null);

};

/* Defines the rules related to equipment. */
HybridD20.equipmentRules = function(rules, armors, goodies, shields, weapons) {

  rules.defineRule('armorProficiencyLevel', '', '=', SRD35.PROFICIENCY_NONE);
  rules.defineRule('shieldProficiencyLevel', '', '=', SRD35.PROFICIENCY_NONE);
  rules.defineRule('weaponProficiencyLevel', '', '=', SRD35.PROFICIENCY_LIGHT);
  SRD35.equipmentRules(rules, armors, goodies, shields, weapons);

}

/* Defines the rules related to feats. */
HybridD20.featRules = function(rules, feats) {

  rules.defineRule('experienceUsed', 'allocatedExp.Feats', '+', null);

  for(var i = 0; i < feats.length; i++) {

    var feat = feats[i];
    var matchInfo;
    var notes = null;

    if(feat == 'Advance') {
      notes = [
        'combatNotes.advanceFeature:' +
          "Move through %V' of threatened area without AOO",
        'validationNotes.advanceFeatAbility:Requires Dexterity >= 15',
        'validationNotes.advanceFeatSkills:Requires Dodge >= %1/Mobility >= %2'
      ];
      rules.defineRule
        ('combatNotes.advanceFeature', 'feats.Advance', '=', 'source * 5');
      rules.defineRule
        ('validationNotes.advanceFeatSkills.1', 'feats.Advance', '=', null);
      rules.defineRule
        ('validationNotes.advanceFeatSkills.2', 'feats.Advance', '=', null);
    } else if(feat == 'Agile Maneuvers') {
      notes = [
        'combatNotes.agileManeuversFeature:+%V CMB (dex instead of str)',
        'sanityNotes.agileManeuversFeatAbility:' +
          'Implies Agile Maneuvers rank exceeds Strength Modifier',
        'validationNotes.agileManeuversFeatMax:May not exceed Dex modifier'
      ];
      rules.defineRule('combatNotes.agileManeuversFeature',
        'feats.Agile Maneuvers', '=', null,
        'strengthModifier', '+', '-source'
      );
      rules.defineRule
        ('combatManeuverBonus', 'combatNotes.agileManeuversFeature', '+', null);
      rules.defineRule('sanityNotes.agileManeuversFeatAbility',
        'feats.Agile Maneuvers', '=', null,
        'strengthModifier', '+', '-source - 1',
        '', 'v', '0'
      );
      rules.defineRule('validationNotes.agileManeuversFeatMax',
        'feats.Agile Maneuvers', '=', null,
        'dexterityModifier', '+', '-source',
        '', '^', '0'
      );
    } else if(feat == 'Arcane Armor Training') {
      // TODO
    } else if(feat == 'Armor Proficiency') {
      notes = [
        'validationNotes.armorProficiencyFeatSkills:Requires Combat (HTH) >= %1'
      ];
      rules.defineRule('armorProficiencyLevel',
        'feats.Armor Proficiency', '^', 'source >= 3 ? ' + SRD35.PROFICIENCY_HEAVY + ' : source == 2 ? ' + SRD35.PROFICIENCY_MEDIUM + ' : ' + SRD35.PROFICIENCY_LIGHT
      );
      rules.defineRule('validationNotes.armorProficiencyFeatSkills',
        'feats.Armor Proficiency', '=', 'source > 2 ? source - 2 : null'
      );
      // TODO Armor training, optimization, defense, and mastery
    } else if(feat == 'Blind-Fight') {
      notes = [
        'abilityNotes.blind-FightFeature:+%V movement in poor visibility',
        'combatNotes.blind-FightFeature:' +
          'Reroll concealed miss, no bonus to invisible foe, retain %V Dex ' +
          'bonus to AC vs. invisible foe',
        'validationNotes.blind-FightFeatSkills:Requires Combat (HTH) >= %1/Perception >= %2'
      ];
      rules.defineRule('abilityNotes.blind-FightFeature',
        'feats.Blind-Fight', '=', 'source * 5',
        'speed', 'v', 'source / 2'
      );
      rules.defineRule('combatNotes.blind-FightFeature',
        'feats.Blind-Fight', '=', null,
        'dexterityModifier', 'v', null
      );
      rules.defineRule('validationNotes.blind-FightFeatSkills.1',
        'feats.Blind-Fight', '=', null
      );
      rules.defineRule('validationNotes.blind-FightFeatSkills.2',
        'feats.Blind-Fight', '=', null
      );
    } else if(feat == 'Bravery') {
      notes = [
        'saveNotes.braveryFeature:+%V vs. fear',
        'validationNotes.braveryFeatPrereq:Requires Combat (HTH) skill >= %1||Iron Will feat >= %2'
      ];
      rules.defineRule('saveNotes.braveryFeature', 'feats.Bravery', '=', null);
      rules.defineRule('validationNotes.braveryFeatPrereq.1',
        'feats.Bravery', '=', 'source > 1 ? source * 4 - 2 : 2'
      );
      rules.defineRule('validationNotes.braveryFeatPrereq.2',
        'validationNotes.braveryFeatPrereq.1', '=', null
      );
      rules.defineRule('validationNotes.braveryFeatPrereq.3',
        'feats.Bravery', '=', '0', 
        'skills.Combat (HTH)', '^', null,
        'feats.Iron Will', '^', null
      );
      rules.defineRule('validationNotes.braveryFeatPrereq',
        'validationNotes.braveryFeatPrereq.1', '=', null,
        'validationNotes.braveryFeatPrereq.3', '+', '-source',
        '', '^', '0'
      );
    } else if(feat == 'Camouflage') {
      notes = [
        'featureNotes.camouflageFeature:Hide in any natural terrain',
        'validationNotes.camouflageFeatSkills:Requires Stealth >= 13/Survival >= 13'
      ];
    } else if(feat == 'Canny Defense') {
      // TODO
    } else if(feat == 'Cleave') {
      // TODO
    } else if(feat == 'Combat Reflexes') {
      // TODO
    } else if(feat == 'Deadly Aim') {
      // TODO
    } else if(feat == 'Deadly Precision') {
      // TODO
    } else if(feat == 'Death Attack') {
      // TODO
    } else if(feat == 'Defensive Combat Training') {
      // TODO
    } else if(feat == 'Defensive Roll') {
      // TODO
    } else if(feat == 'Defensive Training') {
      // TODO
    } else if(feat == 'Deflect Arrows') {
      // TODO
    } else if(feat == 'Disruptive') {
      // TODO
    } else if(feat == 'Dodge') {
      // TODO
    } else if(feat == 'Double Slice') {
      // TODO
    } else if(feat == 'Evasion') {
      // TODO
    } else if(feat == 'Far Shot') {
      // TODO
    } else if(feat == 'Fast Stealth') {
      notes = [
        'skillNotes.fastStealthFeature:-%V Stealth at full speed',
        'validationNotes.fastStealthFeatSkills:Requires Stealth >= %1'
      ];
      rules.defineRule('skillNotes.fastStealthFeature',
        'feats.Fast Stealth', '=', '5 - source'
      );
      rules.defineRule('validationNotes.fastStealthFeatSkills.1',
        'feats.Fast Stealth', '=', 'source * 2'
      );
    } else if(feat == 'Favored Enemy') {
      // TODO
    } else if(feat == 'Favored Terrain') {
      notes = [
        'combatNotes.favoredTerrainFeature:+%V Initiative in chosen terrain',
        'skillNotes.favoredTerrainFeature:' +
          '+%V Perception, Survival in chosen terrain',
        'validationNotes.favoredTerrainFeatSkills:Requires Survival >= %1'
      ];
      rules.defineRule('combatNotes.favoredTerrainFeature',
        'feats.Favored Terrain', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('skillNotes.favoredTerrainFeature',
        'feats.Favored Terrain', '=', null
      );
      rules.defineRule('validationNotes.favoredTerrainFeatSkills',
        'feats.Favored Terrain', '=', null
      );
    } else if(feat == 'Flurry Of Blows') {
      // TODO
    } else if(feat == 'Follow-Through') {
      // TODO
    } else if(feat == 'Great Fortitude') {
      notes = [
        'saveNotes.greatFortitudeFeature:+%V Fortitude'
      ];
      rules.defineRule
        ('saveNotes.greatFortitudeFeature', 'feats.Great Fortitude', '=', null);
      rules.defineRule
        ('save.Fortitude', 'saveNotes.greatFortitudeFeature', '+', null);
    } else if(feat == 'Hidden Weapons') {
      // TODO
    } else if(feat == 'Improve Grapple') {
      // TODO
    } else if(feat == 'Improved Bull Rush') {
      // TODO
    } else if(feat == 'Improved Critical') {
      // TODO
    } else if(feat == 'Improved Defensive Fighting') {
      // TODO
    } else if(feat == 'Improved Disarm') {
      // TODO
    } else if(feat == 'Improved Feint') {
      // TODO
    } else if(feat == 'Improved Great Fortitude') {
      notes = [
        'saveNotes.improvedGreatFortitudeFeature:Reroll Fort %V/day',
        'validationNotes.improvedGreatFortitudeFeatFeatures:Requires Great Fortitude >= %1'
      ];
      rules.defineRule('saveNotes.improvedGreatFortitudeFeature',
        'feats.Improved Great Fortitude', '=', 'Math.floor((source + 3) / 4)'
      );
      rules.defineRule('validationNotes.improvedGreatFortitudeFeatFeatures',
        'feats.Improved Great Fortitude', '=', null
      );
    } else if(feat == 'Improved Initiative') {
      notes = [
        'combatNotes.improvedInitiativeFeature:+%V Initiative'
      ];
      rules.defineRule('combatNotes.improvedInitiativeFeature',
        'feats.Improved Initiative', '=', 'Math.floor((source + 1) / 2)'
      );
      rules.defineRule
        ('initiative', 'combatNotes.improvedInitiativeFeature', '+', null);
    } else if(feat == 'Improved Iron Will') {
      notes = [
        'saveNotes.improvedIronWillFeature:Reroll Will %V/day',
        'validationNotes.improvedIronWillFeatFeatures:Requires Iron Will >= %1'
      ];
      rules.defineRule('saveNotes.improvedIronWillFeature',
        'feats.Improved Iron Will', '=', 'Math.floor((source + 3) / 4)'
      );
      rules.defineRule('validationNotes.improvedIronWillFeatFeatures',
        'feats.Improved Iron Will', '=', null
      );
    } else if(feat == 'Improved Lightning Reflexes') {
      notes = [
        'saveNotes.improvedLightningReflexesFeature:Reroll Reflex %V/day',
        'validationNotes.improvedLightningReflexesFeatFeatures:Requires Lightning Reflexes >= %1'
      ];
      rules.defineRule('saveNotes.improvedLightningReflexesFeature',
        'feats.Improved Lightning Reflexes', '=', 'Math.floor((source + 3) / 4)'
      );
      rules.defineRule('validationNotes.improvedLightningReflexesFeatFeatures',
        'feats.Improved Lightning Reflexes', '=', null
      );
    } else if(feat == 'Improved Overrun') {
      // TODO
    } else if(feat == 'Improved Shield Bash') {
      // TODO
    } else if(feat == 'Improved Sunder') {
      // TODO
    } else if(feat == 'Improved Trip') {
      // TODO
    } else if(feat == 'Improved Unarmed Strike') {
      // TODO
    } else if(feat == 'Improvised Weapon Use') {
      // TODO
    } else if(feat == 'Insightful Defense') {
      // TODO
    } else if(feat == 'Intimidating Prowess') {
      notes = [
        'skillNotes.intimidatingProwessFeature:' +
          '+%V Bluff to intimidate or demoralize'
      ];
      rules.defineRule('skillNotes.intimidatingProwessFeature',
        'strengthModifier', '=', null,
        'charismaModifier', '+', '-source'
      );
    } else if(feat == 'Iron Will') {
      notes = [
        'saveNotes.ironWillFeature:+%V Will'
      ];
      rules.defineRule
        ('saveNotes.ironWillFeature', 'feats.Iron Will', '=', null);
      rules.defineRule('save.Will', 'saveNotes.ironWillFeature', '+', null);
    } else if(feat == 'Ledge Walker') {
      notes = [
        "abilityNotes.ledgeWalkerFeature:%V' movement across narrow surfaces",
        'validationNotes.ledgeWalkerFeatSkills:Requires Acrobatics >= %1'
      ];
      rules.defineRule('abilityNotes.ledgeWalkerFeature',
        'speed', '=', 'Math.floor(source / 2)',
        'feats.Ledge Walker', '+', '5 * source'
      );
      rules.defineRule('validationNotes.ledgeWalkerFeatSkills.1',
        'feats.Ledge Walker', '=', 'source * 2'
      );
    } else if(feat == 'Lightning Reflexes') {
      notes = [
        'saveNotes.lightningReflexesFeature:+%V Reflex'
      ];
      rules.defineRule('saveNotes.lightningReflexesFeature',
        'feats.Lightning Reflexes', '=', null
      );
      rules.defineRule
        ('save.Reflex', 'saveNotes.lightningReflexesFeature', '+', null);
    } else if(feat == 'Lunge') {
      // TODO
    } else if(feat == 'Manyshot') {
      // TODO
    } else if(feat == 'Mighty Throw') {
      // TODO
    } else if(feat == 'Mind Over Body') {
      notes = [
        'featureNotes.mindOverBodyFeature:Heal %V ability damage/day',
        'validationNotes.mindOverBodyFeatAbility:Requires Constitution >= 13'
      ];
      rules.defineRule('featureNotes.mindOverBodyFeature',
        'feats.Mind Over Body', '=', '1 + source',
        'constitutionModifier', 'v', null
      );
    } else if(feat == 'Mobility') {
      // TODO
    } else if(feat == 'Mounted Archery') {
      // TODO
    } else if(feat == 'Mounted Combat') {
      // TODO
    } else if(feat == 'Nimble Step') {
      notes = [
        'abilityNotes.nimbleStepFeature:' +
          "Full speed through %V' of difficult terrain",
        'validationNotes.ledgeWalkerFeatAbility:Requires Dexterity >= 13',
        'validationNotes.ledgeWalkerFeatSkills:Requires Acrobatics >= %1'
      ];
      rules.defineRule('abilityNotes.nimbleStepFeature',
        'feats.Nimble Step', '=', '5 * source'
      );
      rules.defineRule('validationNotes.nimbleStepFeatSkills.1',
        'feats.Nimble Step', '=', null
      );
    } else if(feat == 'No Retreat') {
      // TODO
    } else if(feat == 'Opportunist') {
      // TODO
    } else if(feat == 'Overhand Chop') {
      // TODO
    } else if(feat == 'Penetrating Strike') {
      // TODO
    } else if(feat == 'Power Attack') {
      // TODO
    } else if(feat == 'Precise Shot') {
      // TODO
    } else if(feat == 'Precise Strike') {
      // TODO
    } else if(feat == 'Quiet Death') {
      // TODO
    } else if(feat == 'Quivering Palm') {
      // TODO
    } else if(feat == 'Rapid Reload') {
      // TODO
    } else if(feat == 'Rapid Shot') {
      // TODO
    } else if(feat == 'Resiliency') {
      // TODO
    } else if(feat == 'Riposte') {
      // TODO
    } else if(feat == 'Rogue Crawl') {
      notes = [
        "abilityNotes.rogueCrawlFeature:Crawl %V'/rd"
      ];
      rules.defineRule('abilityNotes.rogueCrawlFeature',
        'feats.Rogue Crawl', '=', 'source * 5 + 5'
      );
    } else if(feat == 'Shield Cover') {
      // TODO
    } else if(feat == 'Shield Deflection') {
      // TODO
    } else if(feat == 'Shield Proficiency') {
      // TODO
    } else if(feat == 'Sidestep Charge') {
      // TODO
    } else if(feat == 'Slow Reactions') {
      // TODO
    } else if(feat == 'Snatch Arrows') {
      // TODO
    } else if(feat == 'Sneak Attack') {
      // TODO
    } else if(feat == 'Sneak Attack (Bleeding Attack)') {
      // TODO
    } else if(feat == 'Sneak Attack (Crippling Strike)') {
      // TODO
    } else if(feat == 'Stunning Fist') {
      // TODO
    } else if(feat == 'Successive Fire') {
      // TODO
    } else if(feat == 'Surprise Attacks') {
      // TODO
    } else if(feat == 'Swift Tracker') {
      notes = [
        'skillNotes.swiftTrackerFeature:%V/%1 track at normal/double speed',
        'validationNotes.swiftTrackerFeatSkills:Requires Survival >= %1'
      ];
      rules.defineRule('skillNotes.swiftTrackerFeature',
        'feats.Swift Tracker', '=', 'source - 5'
      );
      rules.defineRule('skillNotes.swiftTrackerFeature.1',
        'feats.Swift Tracker', '=', '(source * 2) - 20'
      );
      rules.defineRule('validationNotes.swiftTrackerFeatSkills',
        'feats.Swift Tracker', '=', null
      );
    } else if(feat == 'Throw Anything') {
      // TODO
    } else if(feat == 'Toughness') {
      notes = [
        'combatNotes.toughnessFeature:+%V HP'
      ];
      rules.defineRule
        ('combatNotes.toughnessFeature', 'feats.Toughness', '=', 'source + 3');
      rules.defineRule('hitPoints', 'combatNotes.toughnessFeature', '+', null);
    } else if(feat == 'Trap Sense') {
      notes = [
        'combatNotes.trapSenseFeature:+%V AC vs. traps',
        'saveNotes.trapSenseFeature:+%V Reflex vs. traps',
        'validationNotes.trapSenseFeatFeatures:Requires Lightning Reflexes >= %1',
        'validationNotes.trapSenseFeatSkills:Requires Perception >= %1'
      ];
      rules.defineRule
        ('combatNotes.trapSenseFeature', 'feats.Trap Sense', '=', null);
      rules.defineRule
        ('saveNotes.trapSenseFeature', 'feats.Trap Sense', '=', null);
      rules.defineRule('validationNotes.trapSenseFeatFeatures.1',
        'feats.Trap Sense', '=', null
      );
      rules.defineRule('validationNotes.trapSenseFeatSkills.1',
        'feats.Trap Sense', '=', null
      );
    } else if(feat == 'Two-Weapon Defense') {
      // TODO
    } else if(feat == 'Two-Weapon Fighting') {
      // TODO
    } else if(feat == 'Uncanny Dodge') {
      // TODO
    } else if(feat == 'Vital Strike') {
      // TODO
    } else if(feat == 'Weapon Finesse') {
      // TODO
    } else if(feat == 'Weapon Proficiency (Martial)') {
      // TODO
    } else if(feat == 'Weapon Training') {
      // TODO
    } else if(feat == 'Whirlwind Attack') {
      // TODO
    } else if(feat == 'Wild Empathy') {
      notes = [
        'skillNotes.wildEmpathyFeature:Diplomacy with animals',
        'validationNotes.wildEmpathyFeatSkills:Requires Handle Animal'
      ];
    // Metamagic Feats
    } else if(feat == 'Empower Spell') {
      // TODO
    } else if(feat == 'Enlarge Spell') {
      // TODO
    } else if(feat == 'Extend Spell') {
      // TODO
    } else if(feat == 'Heighten Spell') {
      // TODO
    } else if(feat == 'Maximize Spell') {
      // TODO
    } else if(feat == 'Quicken Spell') {
      // TODO
    } else if(feat == 'Silent Spell') {
      // TODO
    } else if(feat == 'Still Spell') {
      // TODO
    } else if(feat == 'Widen Spell') {
      // TODO
    // Powers
    } else if(feat == 'Animal Form') {
      // TODO
    } else if(feat == 'Arcane Arrow') {
      // TODO
    } else if(feat == 'Arcane Sight') {
      // TODO
    } else if(feat == 'Arcane Strike') {
      // TODO
    } else if(feat == 'Arcane Theurgy') {
      // TODO
    } else if(feat == 'Armored Skin') {
      // TODO
    } else if(feat == 'Augment Summoning') {
      // TODO
    } else if(feat == 'Bardic Performance') {
      // TODO
    } else if(feat == 'Blinding Speed') {
      // TODO
    } else if(feat == 'Blindsight') {
      // TODO
    } else if(feat == 'Bloodline Abilities') {
      // TODO
    } else if(feat == 'Call To Mind') {
      // TODO
    } else if(feat == 'Clerical Ordainment') {
      // TODO
    } else if(feat == 'Combat Focus') {
      // TODO
    } else if(feat == 'Critical Feats (Bleeding)') {
      // TODO
    } else if(feat == 'Critical Feats (Blinding)') {
      // TODO
    } else if(feat == 'Critical Feats (Deafening)') {
      // TODO
    } else if(feat == 'Critical Feats (Devastating)') {
      // TODO
    } else if(feat == 'Critical Feats (Exhausting)') {
      // TODO
    } else if(feat == 'Critical Feats (Sickening)') {
      // TODO
    } else if(feat == 'Critical Feats (Spell)') {
      // TODO
    } else if(feat == 'Critical Feats (Staggering)') {
      // TODO
    } else if(feat == 'Critical Feats (Stunning)') {
      // TODO
    } else if(feat == 'Critical Feats (Tiring)') {
      // TODO
    } else if(feat == 'Damage Reduction') {
      // TODO
    } else if(feat == 'Darkvision') {
      // TODO
    } else if(feat == 'Dazzling Display') {
      // TODO
    } else if(feat == 'Deathless') {
      // TODO
    } else if(feat == 'Defensive Precognition') {
      // TODO
    } else if(feat == 'Defensive Prescience') {
      // TODO
    } else if(feat == 'Dimension Spring Attack') {
      // TODO
    } else if(feat == 'Druidical Initiation') {
      // TODO
    } else if(feat == 'Energy Resistance') {
      // TODO
    } else if(feat == 'Eschew Materials') {
      // TODO
    } else if(feat == 'Fast Healing') {
      // TODO
    } else if(feat == 'Fey Touched') {
      // TODO
    } else if(feat == 'Font Of Power') {
      // TODO
    } else if(feat == 'Free Casting') {
      // TODO
    } else if(feat == 'Free Manifesting') {
      // TODO
    } else if(feat == 'Greater Arcane Resistance') {
      // TODO
    } else if(feat == 'Greater Dispelling Attack') {
      // TODO
    } else if(feat == 'Greater Reaving Dispelling Attack') {
      // TODO
    } else if(feat == 'Hand Of The Apprentice') {
      // TODO
    } else if(feat == 'Impromptu Sneak Attack') {
      // TODO
    } else if(feat == 'Inertial Armor') {
      // TODO
    } else if(feat == 'Ki Mastery') {
      // TODO
    } else if(feat == 'Know Direction') {
      // TODO
    } else if(feat == 'Lay On Hands') {
      // TODO
    } else if(feat == 'Lesser Arcane Resistance') {
      // TODO
    } else if(feat == "Lion's Charge") {
      // TODO
    } else if(feat == 'Low-Light Vision') {
      // TODO
    } else if(feat == 'Luck') {
      // TODO
    } else if(feat == 'Metamagic Adept') {
      // TODO
    } else if(feat == 'Metamagic Mastery') {
      // TODO
    } else if(feat == 'Mind Over Body (Power)') {
      // TODO
    } else if(feat == 'Natural Spell') {
      // TODO
    } else if(feat == 'Offensive Precognition') {
      // TODO
    } else if(feat == 'Offensive Prescience') {
      // TODO
    } else if(feat == 'Opportunistic Strike') {
      // TODO
    } else if(feat == 'Perfect Self') {
      // TODO
    } else if(feat == 'Power Over Shadow') {
      // TODO
    } else if(feat == 'Pierce The Fog Of War') {
      // TODO
    } else if(feat == 'Psionic Awareness') {
      // TODO
    } else if(feat == 'Psychic Warrior') {
      // TODO
    } else if(feat == 'Rage') {
      // TODO
    } else if(feat == 'Ranged Legerdemain') {
      // TODO
    } else if(feat == 'Reaving Dispelling Attack') {
      // TODO
    } else if(feat == 'Regeneration') {
      // TODO
    } else if(feat == 'Scent') {
      // TODO
    } else if(feat == 'School Defense') {
      // TODO
    } else if(feat == 'Selective Channeling') {
      // TODO
    } else if(feat == 'Slippery Mind') {
      // TODO
    } else if(feat == 'Smite Evil') {
      // TODO
    } else if(feat == 'Sorcery') {
      // TODO
    } else if(feat == 'Soulknife') {
      // TODO
    } else if(feat == 'Speak With Animals') {
      // TODO
    } else if(feat == 'Spectral Tendril') {
      // TODO
    } else if(feat == 'Spell Immunity') {
      // TODO
    } else if(feat == 'Spell Mastery') {
      // TODO
    } else if(feat == 'Spell Penetration') {
      // TODO
    } else if(feat == 'Spell Repertoire (Bard)') {
      // TODO
    } else if(feat == 'Spell Repertoire (Divine)') {
      // TODO
    } else if(feat == 'Spell Repertoire (Druidical)') {
      // TODO
    } else if(feat == 'Spell Repertoire (Sorcerer)') {
      // TODO
    } else if(feat == 'Spell Repertoire (Wizard)') {
      // TODO
    } else if(feat == 'Spell Resistance') {
      // TODO
    } else if(feat == 'Spell Synthesis') {
      // TODO
    } else if(feat == 'Spell Theurgy') {
      // TODO
    } else if(feat == 'Spellcasting (Arcane)') {
      // TODO
    } else if(feat == 'Spellcasting (Divine)') {
      // TODO
    } else if(feat == 'Spellcasting (Druidical)') {
      // TODO
    } else if(feat == 'Spontaneous Casting') {
      // TODO
    } else if(feat == 'Surprise Spells') {
      // TODO
    } else if(feat == 'Tenacious Magic') {
      // TODO
    } else if(feat == 'Timeless Body') {
      // TODO
    } else if(feat == 'Touch Of Death') {
      // TODO
    } else if(feat == 'Trackless Step') {
      // TODO
    } else if(feat == 'Trollborn') {
      // TODO
    } else if(feat == 'Turn Outsider') {
      // TODO
    } else if(feat == 'Turn Elemental') {
      // TODO
    } else if(feat == 'Wand Expertise') {
      // TODO
    } else if(feat == 'Wild Shape') {
      // TODO
    } else if(feat == 'Wild Surge') {
      // TODO
    } else if(feat == 'Wizardry') {
      // TODO
    } else if(feat == 'Woodland Stride') {
      // TODO
    } else
      continue;
    rules.defineChoice('feats', feat);
    rules.defineRule('features.' + feat, 'feats.' + feat, '=', null);
    if(notes != null)
      rules.defineNote(notes);

    rules.defineRule
      ('allocatedExp.Feats', 'feats.' + feat, '=', 'source * (source + 1) + 3');

  }

};

/* Returns the elements in a basic SRD character editor. */
HybridD20.initialEditorElements = function() {
  var abilityChoices = [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
  ];
  var editorElements = [
    ['name', 'Name', 'text', [20]],
    ['race', 'Race', 'select-one', 'races'],
    ['imageUrl', 'Image URL', 'text', [20]],
    ['strength', 'Strength/Adjust', 'select-one', abilityChoices],
    ['strengthAdjust', '', 'text', [3]],
    ['intelligence', 'Intelligence/Adjust', 'select-one', abilityChoices],
    ['intelligenceAdjust', '', 'text', [3]],
    ['wisdom', 'Wisdom/Adjust', 'select-one', abilityChoices],
    ['wisdomAdjust', '', 'text', [3]],
    ['dexterity', 'Dexterity/Adjust', 'select-one', abilityChoices],
    ['dexterityAdjust', '', 'text', [3]],
    ['constitution', 'Constitution/Adjust', 'select-one', abilityChoices],
    ['constitutionAdjust', '', 'text', [3]],
    ['charisma', 'Charisma/Adjust', 'select-one', abilityChoices],
    ['charismaAdjust', '', 'text', [3]],
    ['experience', 'Experience', 'text', [7]],
    ['player', 'Player', 'text', [20]],
    ['alignment', 'Alignment', 'select-one', 'alignments'],
    ['gender', 'Gender', 'select-one', 'genders'],
    ['deity', 'Deity', 'select-one', 'deities'],
    ['origin', 'Origin', 'text', [20]],
    ['feats', 'Feats', 'bag', 'feats'],
    ['skills', 'Skills', 'bag', 'skills'],
    ['languages', 'Languages', 'set', 'languages'],
    ['hitPoints', 'Hit Points', 'text', [4]],
    ['armor', 'Armor', 'select-one', 'armors'],
    ['shield', 'Shield', 'select-one', 'shields'],
    ['weapons', 'Weapons', 'bag', 'weapons'],
    ['spells', 'Spells', 'fset', 'spells'],
    ['goodies', 'Goodies', 'bag', 'goodies'],
    ['notes', 'Notes', 'textarea', [40,10]],
    ['hiddenNotes', 'Hidden Notes', 'textarea', [40,10]]
  ];
  return editorElements;
};

/* Defines the rules related to spells. */
HybridD20.magicRules = function(rules, schools) {

  rules.defineChoice('schools', schools);

  rules.defineRule
    ('armorClass', 'combatNotes.goodiesArmorClassAdjustment', '+', null);
  rules.defineRule('combatNotes.goodiesArmorClassAdjustment',
    'goodies.Ring Of Protection +1', '+=', null,
    'goodies.Ring Of Protection +2', '+=', 'source * 2',
    'goodies.Ring Of Protection +3', '+=', 'source * 3',
    'goodies.Ring Of Protection +4', '+=', 'source * 4'
  );

};


/* Defines the rules related to character races. */
HybridD20.raceRules = function(rules, languages, races) {

  rules.defineChoice('languages', languages);
  rules.defineChoice('races', races);
  rules.defineRule('languageCount', '', '=', '1');
  rules.defineRule('languages.Common', '', '=', '1');
  rules.defineNote
    ('validationNotes.languageAllocation:%1 available vs. %2 allocated');
  rules.defineRule('validationNotes.languageAllocation.1',
    '', '=', '0',
    'languageCount', '=', null
  );
  rules.defineRule('validationNotes.languageAllocation.2',
    '', '=', '0',
    /^languages\./, '+=', null
  );
  rules.defineRule('validationNotes.languageAllocation',
    'validationNotes.languageAllocation.1', '=', '-source',
    'validationNotes.languageAllocation.2', '+=', null
  );

};

HybridD20.randomizeOneAttribute = function(attributes, attribute) {
  var attrs;
  var choices;
  if(attribute == 'experience') {
    var level = attributes['level'] || 1;
    var max = 1000 * (Math.pow(1.1, level + 1) - 1) - 1;
    var min = 1000 * (Math.pow(1.1, level) - 1);
    attributes['experience'] = ScribeUtils.random(min, max);
  } else if(attribute == 'feats') {
    // TODO
  } else if(attribute == 'hitPoints') {
    attrs = this.applyRules(attributes);
    var hitDice = attrs['baseAttack'] || 0;
    var hitPoints = 0;
    for(var i = 1; i <= hitDice; i++) {
      hitPoints += i == 1 ? 10 : ScribeUtils.random(1, 10);
    }
    attributes['hitPoints'] = hitPoints;
  } else if(attribute == 'skills') {
    attrs = this.applyRules(attributes);
    var choices = this.getChoices('skills');
    var xpTotal = attrs['experience'] || 0;
    var xpUsed = attrs['experienceUsed'] || 0;
    var useUpTo = xpUsed + ScribeUtils.random(0, xpTotal - xpUsed) / 2;
    var skill = null;
    while(xpUsed <= useUpTo) {
      skill = !attributes['skills.Combat (HTH)'] ? 'skills.Combat (HTH)' :
              !attributes['skills.Combat (Fire)'] ? 'skills.Combat (Fire)' :
              ('skills.' + ScribeUtils.randomKey(choices));
      if(!attributes[skill])
        attributes[skill] = 0;
      else if(attributes[skill] >= attributes['maxAllowedSkillPoints'])
        continue;
      attributes[skill]++;
      attrs = this.applyRules(attributes);
      xpUsed = attrs['experienceUsed'];
    }
    if(!skill || xpUsed < xpTotal) {
      // empty
    } else if(attributes[skill] == 1) {
      delete attributes[skill];
    } else {
      attributes[skill]--;
    }
  } else {
    SRD35.randomizeOneAttribute(attributes, attribute);
  }
}

/* Defines the rules related to skills. */
HybridD20.skillRules = function(rules, skills) {

  rules.defineRule('experienceUsed', 'allocatedExp.Skills', '+', null);
  rules.defineRule('maxAllowedSkillPoints', 'level', '=', null);

  var abilityNames = {
    'cha':'charisma', 'con':'constitution', 'dex':'dexterity',
    'int':'intelligence', 'str':'strength', 'wis':'wisdom'
  };

  rules.defineChoice('skills', skills);

  for(var i = 0; i < skills.length; i++) {
    var pieces = skills[i].split(':');
    var skill = pieces[0];
    var ability = pieces[1];
    rules.defineNote('skills.' + skill + ':(' + ability + ') %V (%1)');
    rules.defineRule('skills.' + skill + '.1',
      'skills.' + skill, '=', 'source + 3',
      abilityNames[ability] + 'Modifier', '+', null
    );
    rules.defineRule('allocatedExp.Skills', 'skills.' + skill, '+=', 'source * (source + 1) + 3');
  }

  // TODO Skill specialization

};

/* Replaces spell names with longer descriptions on the character sheet. */
HybridD20.spellDescriptionRules = function(rules, spells, descriptions) {

  if(spells == null) {
    spells = ScribeUtils.getKeys(rules.choices.spells);
  }
  if(descriptions == null) {
    descriptions = HybridD20.spellsDescriptions;
  }

  rules.defineRule('casterLevels.B', 'levels.Bard', '=', null);
  rules.defineRule('casterLevels.C', 'levels.Cleric', '=', null);
  rules.defineRule('casterLevels.D', 'levels.Druid', '=', null);
  rules.defineRule('casterLevels.P', 'levels.Paladin', '=', null);
  rules.defineRule('casterLevels.R', 'levels.Ranger', '=', null);
  rules.defineRule('casterLevels.W', 'levels.Sorcerer', '=', null);
  rules.defineRule('casterLevels.W', 'levels.Wizard', '=', null);

  for(var i = 0; i < spells.length; i++) {

    var spell = spells[i];
    var matchInfo = spell.match(/^([^\(]+)\(([A-Za-z]+)(\d+)\s*\w*\)$/);
    if(matchInfo == null) {
      console.log("Bad format for spell " + spell);
      continue;
    }

    var abbr = matchInfo[2];
    var level = matchInfo[3];
    var name = matchInfo[1];
    var description = descriptions[name];

    if(description == null) {
      console.log("No description for spell " + name);
      continue;
    }

    if(abbr.length > 2) {
      abbr = "Dom"; // Assume domain spell
    }

    var inserts = description.match(/\$(\w+|{[^}]+})/g);

    if(inserts != null) {
      for(var index = 1; index <= inserts.length; index++) {
        var insert = inserts[index - 1];
        var expr = insert[1] == "{" ?
            insert.substring(2, insert.length - 1) : insert.substring(1);
        if(HybridD20.spellsAbbreviations[expr] != null) {
          expr = HybridD20.spellsAbbreviations[expr];
        }
        expr = expr.replace(/lvl/g, "source");
        rules.defineRule
          ("spells." + spell + "." + index, "casterLevels." + abbr, "=", expr);
        description = description.replace(insert, "%" + index);
      }
    }

    rules.defineChoice("notes", "spells." + spell + ":" + description);

  }

};

/* Returns HTML body content for user notes associated with this rule set. */
HybridD20.ruleNotes = function() {
  return '' +
    '<h2>HybridD20 Scribe Module Notes</h2>\n' +
    'HybridD20 Scribe Module Version ' + HybridD20_VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    TODO\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    TODO\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Known Bugs</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    TODO\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n';
};
