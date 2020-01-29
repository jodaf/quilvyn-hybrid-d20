/*
Copyright 2020, James J. Hayes

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

var HybridD20_VERSION = '1.5.0.1alpha';

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
  rules.defineSheetElement('Powers', 'Feature Notes');
  rules.randomizeOneAttribute = HybridD20.randomizeOneAttribute;
  rules.makeValid = SRD35.makeValid;
  rules.ruleNotes = HybridD20.ruleNotes;
  HybridD20.abilityRules(rules);
  HybridD20.raceRules(rules, SRD35.LANGUAGES, SRD35.RACES);
  HybridD20.skillRules(rules, HybridD20.SKILLS);
  HybridD20.featRules(rules, HybridD20.FEATS);
  HybridD20.powerRules(rules, HybridD20.POWERS);
  SRD35.descriptionRules(rules, SRD35.ALIGNMENTS, SRD35.DEITIES, SRD35.GENDERS);
  HybridD20.equipmentRules(rules, SRD35.ARMORS, SRD35.SHIELDS, SRD35.WEAPONS);
  HybridD20.combatRules(rules);
  SRD35.movementRules(rules);
  HybridD20.magicRules(rules, SRD35.SCHOOLS);
  HybridD20.spellDescriptionRules(rules);
  rules.defineChoice('preset', 'race', 'level', 'powers');
  rules.defineChoice('random', HybridD20.RANDOMIZABLE_ATTRIBUTES);
  Scribe.addRuleSet(rules);
  HybridD20.rules = rules;
}

// Arrays of choices
HybridD20.FEATS = [
  // General Feats
  'Bravery', 'Camouflage', 'Fast Stealth', 'Great Fortitude',
  'Improved Great Fortitude', 'Improved Initiative', 'Intimidating Prowess',
  'Iron Will', 'Improved Iron Will', 'Ledge Walker', 'Lightning Reflexes',
  'Improved Lightning Reflexes', 'Mind Over Body', 'Nimble Step',
  'Rogue Crawl', 'Swift Tracker', 'Favored Terrain', 'Toughness', 'Trap Sense',
  'Wild Empathy',
  // General Combat Feats
  'Bleeding Sneak Attack', 'Crippling Sneak Attack', 'Improved Critical',
  'Deadly Precision', 'Death Attack', 'Defensive Roll', 'Defensive Training',
  'Dodge', 'Evasion', 'Favored Enemy', 'Penetrating Strike', 'Resiliency',
  'Slow Reactions', 'Sneak Attack', 'Surprise Attacks', 'Uncanny Dodge',
  'Weapon Proficiency', 'Weapon Training',
  // HTH Combat Feats
  'Advance', 'Agile Maneuvers', 'Arcane Armor Training', 'Armor Proficiency',
  'Blind-Fight', 'Improved Bull Rush', 'Canny Defense', 'Cleave',
  'Combat Reflexes', 'Defensive Combat Training', 'Improved Defensive Fighting',
  'Improved Disarm', 'Disruptive', 'Double Slice', 'Improved Feint',
  'Flurry Of Blows', 'Follow-Through', 'Hidden Weapons',
  'Improvised Weapon Use', 'Insightful Defense', 'Improved Grapple', 'Lunge',
  'Mobility', 'Mounted Combat', 'No Retreat', 'Opportunist', 'Overhand Chop',
  'Improved Overrun', 'Power Attack', 'Precise Strike', 'Quiet Death',
  'Quivering Palm', 'Riposte', 'Improved Shield Bash', 'Shield Cover',
  'Shield Deflection', 'Shield Proficiency', 'Sidestep Charge', 'Stunning Fist',
  'Improved Sunder', 'Improved Trip', 'Two-Weapon Defense',
  'Two-Weapon Fighting', 'Improved Unarmed Strike', 'Vital Strike',
  'Weapon Finesse', 'Whirlwind Attack',
  // Fire Combat Feats
  'Deadly Aim', 'Deflect Arrows', 'Far Shot', 'Mighty Throw', 'Mounted Archery',
  'Point Blank Shot', 'Precise Shot', 'Rapid Reload', 'Rapid Shot',
  'Manyshot', 'Snatch Arrows', 'Successive Fire', 'Throw Anything',
  // Metamagic Feats
  'Empower Spell', 'Enlarge Spell', 'Extend Spell', 'Heighten Spell',
  'Maximize Spell', 'Silent Spell', 'Still Spell', 'Quicken Spell',
  'Widen Spell'
];
// Note: the order here handles dependencies among attributes when generating
// random characters
HybridD20.RANDOMIZABLE_ATTRIBUTES = [
  'charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom',
  'name', 'race', 'gender', 'alignment', 'deity', 'experience', 'feats',
  'skills', 'languages', 'hitPoints', 'armor', 'shield', 'weapons', 'spells'
];
// TODO Domain Powers, Immunity, School Focus, School Specialization
HybridD20.POWERS = [
  'Abundant Step', 'Acidic Ray', 'Added Summonings', 'Alien Resistance',
  'Aligned Arrow', 'Aligned Ki Strike', 'Animal Form', 'Animal Fury',
  'Arcane Sight', 'Arcane Strike', 'Arcane Theurgy', 'Armored Skin',
  'Arrow Of Death', 'Augment Summoning', 'Augmented Wild Shape',
  'Axiomatic Strike', 'Beast Wild Shape', 'Bleeding Critical',
  'Blinding Critical', 'Blinding Speed', 'Blindsight', 'Bloodline Abilities',
  'Breath Weapon', 'Call To Mind', 'Channeling Smite', 'Claws', 'Clear Mind',
  'Clerical Ordainment', 'Combat Focus', 'Conviction', 'Corrupting Touch',
  'Countersong', 'Damage Reduction', 'Darkvision', 'Dazzling Display',
  'Deadly Performance', 'Deafening Critical', "Death's Gift", 'Deathless',
  'Defensive Precognition', 'Defensive Prescience', 'Destiny Realized',
  'Devastating Critical', 'Dimension Spring Attack', 'Dirge Of Doom',
  'Discordant Performance', 'Distance Arrow', 'Druidical Initiation',
  'Elemental Blast', 'Elemental Rage', 'Elemental Ray', 'Empty Body',
  'Energy Arrow', 'Energy Burst Arrow', 'Energy Resistance', 'Enhance Arrows',
  'Eschew Materials', 'Exhausting Critical', 'Fascinate', 'Fast Healing',
  'Fated', 'Fey Magic', 'Feytouched', 'Font Of Power', 'Free Casting',
  'Free Manifesting', 'Frightening Tune', "Gorgon's Fist", 'Grasp Of The Dead',
  'Grave Touch', 'Greater Arcane Resistance', 'Greater Augmented Wild Shape',
  'Greater Dispelling Attack', 'Greater Rage',
  'Greater Reaving Dispelling Attack', 'Greater Wild Shape', 'Guarded Stance',
  'Hail Of Arrows', 'Hand Of The Apprentice', 'Heavenly Fire', 'Hellfire',
  'Huge Elemental Wild Shape', 'Huge Plant Wild Shape', 'Imbue Arrow',
  'Impromptu Sneak Attack', 'Incorporeal Form', 'Increased DR',
  'Inertial Armor', 'Inspire Competence', 'Inspire Courage',
  'Inspire Greatness', 'Inspire Heroics', 'Intimidating Glare',
  'It Was Meant To Be', 'Ki Alacrity', 'Ki Dodge', 'Ki Flurry', 'Ki Strike',
  'Knockback', 'Know Direction', 'Large Elemental Wild Shape', 'Laughing Touch',
  'Lay On Hands', 'Lesser Arcane Resistance', "Lion's Charge", 'Long Limbs',
  'Low-Light Vision', 'Luck', 'Mass Suggestion', 'Medium Elemental Wild Shape',
  'Metamagic Adept', 'Metamagic Mastery', 'Mighty Rage', 'Mighty Swing',
  'Mind Over Body (Power)', 'Moment Of Clarity', 'Natural Spell',
  'Night Vision', 'Offensive Precognition', 'Offensive Prescience', 'One Of Us',
  'Opportunistic Strike', 'Paralyzing Show', 'Perfect Self', 'Phase Arrow',
  'Pierce The Fog Of War', 'Plant Wild Shape', 'Power Over Shadow',
  'Powerful Blow', 'Psionic Awareness', 'Psychic Warrior', 'Quick Reflexes',
  'Quivering Palm Power', 'Rage', 'Ranged Legerdemain',
  'Reaving Dispelling Attack', 'Regeneration', 'Renewed Vigor', 'Rolling Dodge',
  'Roused Anger', 'Scent', 'School Defense', 'Seeker Arrow',
  'Selective Channeling', 'Sickening Critical', 'Slippery Mind', 'Slow Fall',
  'Small Elemental Wild Shape', 'Smite Evil', 'Song Of Freedom',
  'Soothing Performance', 'Sorcery', 'Soul Of The Fey', 'Soulknife',
  'Speak With Animals', 'Spectral Tendril', 'Spell Critical', 'Spell Immunity',
  'Spell Mastery', 'Spell Penetration', 'Spell Repertoire (Bard)',
  'Spell Repertoire (Divine)', 'Spell Repertoire (Druidical)',
  'Spell Repertoire (Sorcerer)', 'Spell Repertoire (Wizard)',
  'Spell Resistance', 'Spell Synthesis', 'Spell Theurgy',
  'Spellcasting (Arcane)', 'Spellcasting (Divine)', 'Spellcasting (Druidical)',
  'Spontaneous Casting', 'Staggering Critical', 'Stength Surge',
  'Stunning Critical', 'Suggestion', 'Superior Wild Shape', 'Surprise Accuracy',
  'Surprise Spells', 'Swift Foot', 'Tenacious Magic', 'Terrifying Howl',
  'Timeless Body', 'Tireless Rage', 'Tiring Critical', 'Touch Of Death',
  'Touch Of Destiny', 'Trackless Step', 'Trollborn', 'Turn Elemental',
  'Turn Outsider', 'Unexpected Strike', 'Unusual Anatomy', 'Wand Expertise',
  'Wild Shape', 'Wild Surge', 'Wings Of Heaven', 'Wings', 'Within Reach',
  'Wizardry', 'Woodland Stride'
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
  'Concentration:wis', 'Craft (Alchemy):int', 'Craft (Smith):str',
  'Craft (Construction):wis', 'Craft (Fine Art):dex', 'Diplomacy:cha',
  'Disable Device:int', 'Drive:dex', 'Endurance:con', 'Fire Combat:dex',
  'Fly:dex', 'Handle Animal:cha', 'Heal:wis', 'HTH Combat:str',
  'Knowledge (Lore):int', 'Knowledge (Planes):int', 'Knowledge (War):int',
  'Linguistics:int', 'Perception:wis', 'Perform (Acting):cha',
  'Perform (Dance):cha', 'Perform (Music):cha)', 'Profession (Mining):wis',
  'Profession (Sailing):wis', 'Sleight Of Hand:dex', 'Spellcraft:int',
  'Stealth:dex', 'Streetwise:cha', 'Survival:wis'
];

/* Defines the rules related to character abilities. */
HybridD20.abilityRules = function(rules) {

  // Since reaching each new level requires 1.1 times the experience to reach
  // the prior level, the minimum experience for level N can be computed using
  // the sum of the geometric series [1.1^0, 1.1^1, 1.1^2, ... 1.1^N]
  //   exp(N) = 100 * sum[i=0..N-1]1.1^i
  //          = 100 * ((1.1^N - 1) / (1.1 - 1))
  //          = 100 * ((1.1^N - 1) * 10)
  //          = 1000 * 1.1^N - 1000
  // and the level for a given experience can be determined by solving the
  // above equation for N
  //   1000 * 1.1^N - 1000 = exp
  //   1.1^N = (exp + 1000) / 1000 = exp / 1000 + 1
  //   N = log[1.1](exp / 1000 + 1)
  //
  rules.defineRule('experienceNeeded',
    'level', '=', 'Math.floor(1000 * Math.pow(1.1, source + 1) - 1000)'
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
    'skills.Fire Combat', '^=', null,
    'skills.HTH Combat', '=', null
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
  rules.defineRule('meleeAttack', 'skills.HTH Combat', '=', null);
  rules.defineRule('rangedAttack', 'skills.Fire Combat', '=', null);
  rules.defineRule('save.Fortitude', 'constitutionModifier', '=', null);
  rules.defineRule('save.Reflex', 'dexterityModifier', '=', null);
  rules.defineRule('save.Will', 'wisdomModifier', '=', null);

};

/* Defines the rules related to equipment. */
HybridD20.equipmentRules = function(rules, armors, shields, weapons) {

  rules.defineRule('armorProficiencyLevel', '', '=', SRD35.PROFICIENCY_NONE);
  rules.defineRule('shieldProficiencyLevel', '', '=', SRD35.PROFICIENCY_NONE);
  rules.defineRule('weaponProficiencyLevel', '', '=', SRD35.PROFICIENCY_LIGHT);
  SRD35.equipmentRules(rules, armors, shields, weapons);

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
        'validationNotes.advanceFeatSkills:' +
          'Requires Dodge >= Advance/Mobility >= Advance'
      ];
      rules.defineRule
        ('combatNotes.advanceFeature', 'feats.Advance', '=', 'source * 5');
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
        'validationNotes.armorProficiencyFeatSkills:' +
          'Requires HTH Combat >= Armor Proficiency - 2'
      ];
      rules.defineRule('armorProficiencyLevel',
        'feats.Armor Proficiency', '^', 'source >= 3 ? ' + SRD35.PROFICIENCY_HEAVY + ' : source == 2 ? ' + SRD35.PROFICIENCY_MEDIUM + ' : ' + SRD35.PROFICIENCY_LIGHT
      );
      // TODO Armor training, optimization, defense, and mastery
    } else if(feat == 'Bleeding Sneak Attack') {
      notes = [
        'combatNotes.bleedingSneakAttackFeature:' +
          'Sneak attack causes extra %V hp/round until healed',
        'validationNotes.bleedingSneakAttackFeatFeatures:' +
          'Requires Sneak Attack >= Bleeding Sneak Attack * 2'
      ];
      rules.defineRule('combatNote.bleedingSneakAttackFeature',
        'feats.Bleeding Sneak Attack', '=', 'Math.min(source, 10)'
      );
    } else if(feat == 'Blind-Fight') {
      notes = [
        'abilityNotes.blind-FightFeature:+%V movement in poor visibility',
        'combatNotes.blind-FightFeature:' +
          'Reroll concealed miss, no bonus to invisible foe, retain %V Dex ' +
          'bonus to AC vs. invisible foe',
        'validationNotes.blind-FightFeatSkills:' +
          'Requires HTH Combat >= Blind-Fight/Perception >= Blind-Fight'
      ];
      rules.defineRule('abilityNotes.blind-FightFeature',
        'feats.Blind-Fight', '=', 'source * 5',
        'speed', 'v', 'source / 2'
      );
      rules.defineRule('combatNotes.blind-FightFeature',
        'feats.Blind-Fight', '=', null,
        'dexterityModifier', 'v', null
      );
    } else if(feat == 'Bravery') {
      notes = [
        'saveNotes.braveryFeature:+%V vs. fear',
        'validationNotes.braveryFeatPrereq:' +
           'Requires HTH Combat skill >= Bravery * 4 - 2|Iron Will feat >= Bravery * 4 - 2'
      ];
      rules.defineRule('saveNotes.braveryFeature', 'feats.Bravery', '=', null);
    } else if(feat == 'Camouflage') {
      notes = [
        'featureNotes.camouflageFeature:Hide in any natural terrain',
        'validationNotes.camouflageFeatSkills:' +
          'Requires Stealth >= 13/Survival >= 13'
      ];
    } else if(feat == 'Canny Defense') {
      notes = [
        'combatNotes.cannyDefenseFeature:+%V unarmored AC',
        'validationNotes.cannyDefenseFeatAbility:Requires Intelligence >= 13',
        'validationNotes.cannyDefenseFeatBaseAttack:Requires Base Attack >= 7',
        'validationNotes.cannyDefenseFeatFeatures:' +
          'Requires Dodge >= Canny Defense/Mobility >= Canny Defense/Weapon Finesse >= Canny Defense'
      ];
      rules.defineRule('combatNotes.cannyDefenseFeature',
        'feats.Canny Defense', '=', null,
        'intelligenceModifier', 'v', null
      );
    } else if(feat == 'Cleave') {
      notes = [
        'combatNotes.cleaveFeature:%V extra attack(s) when foe(s) drops',
        'validationNotes.cleaveFeatAbility:Requires Strength >= 13',
        'validationNotes.cleaveFeatFeatures:Requires Power Attack',
        'validationNotes.cleaveFeatSkills:Requires HTH Combat >= Cleave'
      ];
      rules.defineRule('combatNotes.cleaveFeature', 'feats.Cleave', '=', null);
    } else if(feat == 'Combat Reflexes') {
      notes = [
        'combatNotes.combatReflexesFeature:Flatfooted AOO, up to %V AOO/round',
        'validationNotes.combatReflexesFeatSkills:' +
          'Requires HTH Combat >= Combat Reflexes'
      ];
      rules.defineRule('cobatNotes.combatReflexesFeature',
        'feats.CombatReflexes', '=', null,
        'dexterityModifier', 'v', 'source + 1'
      );
    } else if(feat == 'Deadly Aim') {
      notes = [
        'combatNotes.deadlyAimFeature:-%V attack/+%1 damage w/projectiles',
        'validationNotes.deadlyAimFeatAbility:Requires Dexterity >= 13',
        'validationNotes.deadlyAimFeatSkills:' +
          'Requires Fire Combat >= Deadly Aim'
      ];
      rules.defineRule
        ('combatNotes.deadlyAimFeature', 'feats.Deadly Aim', '=', null);
      rules.defineRule('combatNotes.deadlyAimFeature.1',
        'feats.Deadly Aim', '=', '2 * source'
      );
    } else if(feat == 'Deadly Precision') {
      notes = [
        'combatNotes.deadlyPrecisionFeature:' +
          'Reroll sneak attack damage die le %V, min die %1',
        'validationNotes.deadlyPrecisionFeatAbility:Requires Dexterity >= 15',
        'validationNotes.deadlyPrecisionFeatFeatures:' +
           'Requires Sneak Attack >= Deadly Precision',
        'validationNotes.deadlyPrecisionFeatSkills:' +
          'Requires HTH Combat >= Deadly Precision + 4'
      ];
      rules.defineRule('combatNotes.deadlyPrecisionFeature',
        'feats.Deadly Precision', '=', 'Math.floor(source / 4)'
      );
      rules.defineRule('combatNotes.deadlyPrecisionFeature.1',
        'feats.Deadly Precision', '=', 'Math.floor((source + 6) / 4)'
      );
    } else if(feat == 'Crippling Sneak Attack') {
      notes = [
        'combatNotes.cripplingSneakAttackFeature: ' +
          '%V Strength damage from sneak attack',
        'validationNotes.cripplingSneakAttackFeatFeatures:' +
          'Requires Sneak Attack >= 10'
      ];
      rules.defineRule('combatNotes.cripplingSneakAttackFeature',
        'feats.Crippling Sneak Attack', '=', 'Math.min(source, 2)'
      );
    } else if(feat == 'Death Attack') {
      notes = [
        'combatNotes.deathAttackFeature:' +
          'Target studied 3+ rd paralyzed 1d6+%1 rd or killed when struck (DC %V Fort neg)',
        'validationNotes.deathAttackFeatFeatures:' +
           'Requires Sneak Attack >= Death Attack',
        'validationNotes.deathAttackFeatSkills:Requires Stealth >= 5'
      ];
      rules.defineRule('combatNotes.deathAttackFeature',
        'intelligenceModifier', '=', 'source + 10',
        'feats.Death Attack', '+', null
      );
    } else if(feat == 'Defensive Combat Training') {
      notes = [
        'combatNotes.defensiveCombatTrainingFeature:+%V CMD',
        'validationNotes.defensiveCombatTrainingFeatSkills:' +
          'Requires HTH Combat >= Defensive Combat Training'
      ];
      rules.defineRule('combatManeuverDefense',
        'combatNotes.defensiveCombatTraining', '+', null
      );
      rules.defineRule('combatNotes.defensiveCombatTrainingFeature',
        'feats.Defensive Combat Training', '=', null
      );
    } else if(feat == 'Defensive Roll') {
      notes = [
        'combatNotes.defensiveRollFeature:' +
          'DC damage Ref save vs. lethal blow for %V% damage',
        'validationNotes.defensiveRollFeatFeatures:' +
          'Requires Lightning Reflexes >= Defensive Roll/Evasion >= 10'
      ];
      rules.defineRule('combatNotes.defensiveRollFeature',
        'feats.Defensive Roll', '=', '5 * source'
      );
    } else if(feat == 'Defensive Training') {
      notes = [
        'combatNotes.defensiveTrainingFeature:+%V AC vs. Giant type',
        'validationNotes.defensiveTrainingFeatRace:' +
          'Requires Race =~ Dwarf|Gnome'
      ];
      rules.defineRule('combatNotes.defensiveTrainingFeature',
        'feats.Defensive Training', '=', 'Math.min(source, 4)'
      );
    } else if(feat == 'Deflect Arrows') {
      notes = [
        'combatNotes.deflectArrowsFeature:Deflect ranged %V/round',
        // NOTE: DA >= 6, Dex >= 21, Wis >= 19 deflect all range + magic
        'validationNotes.deflectArrowsFeatAbility:Requires Dexterity >= 13',
        'validationNotes.deflectArrowsFeatFeatures:' +
          'Requires Lightning Reflexes >= Deflect Arrows * 2/Improved Unarmed Strike >= Deflect Arrows',
        'validationNotes.deflectArrowsFeatSkills:Requires Fire Combat >= Deflect Arrows'
      ];
      rules.defineRule
        ('combatNotes.deflectArrowsFeature', 'feats.Deflect Arrows', '=', null);
    } else if(feat == 'Disruptive') {
      notes = [
        "combatNotes.disruptiveFeature:+%V foes' defensive spell DC%1",
        'validationNotes.disruptiveFeatSkills:' +
          'Requires HTH Combat >= Disruptive + 5'
      ]
      rules.defineRule
        ('combatNotes.disruptiveFeature', 'feats.Disruptive', '=', null);
      rules.defineRule('combatNotes.disruptiveFeature.1',
        'feats.Disruptive', '=', 'source < 10 ? "" : ", provoke AOO"'
      );
    } else if(feat == 'Dodge') {
      notes = [
        'combatNotes.dodgeFeature:+%V AC%1%2',
        'validationNotes.dodgeFeatAbility:Requires Dexterity >= 13',
        'validationNotes.dodgeFeatSkills:' +
          'Requires Fire Combat >= Dodge | HTH Combat >= Dodge'
      ];
      rules.defineRule('armorClass', 'combatNotes.dodgeFeature', '+', null);
      rules.defineRule('combatNotes.dodgeFeature',
        'feats.Dodge', '=', 'Math.floor(source / 4) + 1'
      );
      rules.defineRule('combatNotes.dodgeFeature.1',
        'feats.Dodge', '=', 'source < 6 ? "" : ", 20% conceal 1 rd after 5\' move"',
        'dexterity', '=', 'source >= 15 ? null : ""'
      );
      rules.defineRule('combatNotes.dodgeFeature.2',
        'feats.Dodge', '=', 'source < 11 ? "" : ", 50% conceal 1 rd after 2 move or withdraw"',
        'dexterity', '=', 'source >= 17 ? null : ""'
      );
    } else if(feat == 'Double Slice') {
      notes = [
        'combatNotes.doubleSliceFeature:+%V off-hand damage',
        'validationNotes.doubleSliceFeatAbility:Requires Dexterity >= 13',
        'validationNotes.doubleSliceFeatFeatures:' +
          'Requires Two-Weapon Fighting >= Double Slice',
        'validationNotes.doubleSliceFeatSkills:' +
          'Requires HTH Combat >= Double Slice'
      ];
      rules.defineRule('combatNotes.doubleSliceFeature',
        'feats.Double Slice', '=', null,
        // NOTE: should top off at strengthModifier
        'strengthModifier', '+', 'Math.floor(source / 2)'
      );
    } else if(feat == 'Evasion') {
      notes = [
        'saveNotes.evasionFeature:' +
          '%V% damage on successful Reflex save instead of half, %1% on fail',
        'validationNotes.evasionFeatFeatures:' +
          'Requires Lightning Reflexes >= Lightning Reflexes'
      ];
      rules.defineRule('saveNotes.evasionFeature',
        'feats.Evasion', '=', 'Math.min(0, 50 - source * 5)'
      );
      rules.defineRule('saveNotes.evasionFeature.1',
        'feats.Evasion', '=', 'source >= 11 ? 100 - 5 * (source - 10) : 100'
      );
    } else if(feat == 'Far Shot') {
      notes = [
        'combatNotes.farShotFeature:-%V range penalty',
        'validationNotes.farShotFeatFeatures:Requires Point Blank Shot',
        'validationNotes.farShotFeatSkills:Requires Fire Combat >= Far Shot'
      ];
      rules.defineRule
        ('combatNotes.farShotFeature', 'feats.Far Shot', '=', null);
    } else if(feat == 'Fast Stealth') {
      notes = [
        'skillNotes.fastStealthFeature:-%V Stealth at full speed',
        'validationNotes.fastStealthFeatSkills:' +
          'Requires Stealth >= Fast Stealth * 2'
      ];
      rules.defineRule('skillNotes.fastStealthFeature',
        'feats.Fast Stealth', '=', '5 - source'
      );
    } else if(feat == 'Favored Enemy') {
      // TODO
    } else if(feat == 'Favored Terrain') {
      notes = [
        'combatNotes.favoredTerrainFeature:+%V Initiative in chosen terrain',
        'skillNotes.favoredTerrainFeature:' +
          '+%V Perception, Survival in chosen terrain',
        'validationNotes.favoredTerrainFeatSkills:' +
          'Requires Survival >= Favored Terrain'
      ];
      rules.defineRule('combatNotes.favoredTerrainFeature',
        'feats.Favored Terrain', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('skillNotes.favoredTerrainFeature',
        'feats.Favored Terrain', '=', null
      );
    } else if(feat == 'Flurry Of Blows') {
      notes = [
        'combatNotes.flurryOfBlowsFeature:%1 extra light attack at -%V',
        'validationNotes.flurryOfBlowsFeatFeatures:' +
          'Requires Improved Unarmed Strike >= Flurry Of Blows * 3',
        'validationNotes.flurryOfBlowsFeatSkills:' +
          'Requires HTH Combat >= Flurry Of Blows * 3'
       ];
       rules.defineRule('combatNotes.flurryOfBlowsFeature',
         'feats.Flurry Of Blows', '=', 'source < 3 ? 3 - source : 0'
       );
       rules.defineRule('combatNotes.flurryOfBlowsFeature.1',
         'feats.Flurry Of Blows', '=', 'source < 4 ? 1 : 2'
       );
    } else if(feat == 'Follow-Through') {
      notes = [
        'combatNotes.follow-ThroughFeature:Reduce second attack penalty by %V',
        'validationNotes.follow-ThroughFeatSkills:' +
          'Requires HTH Combat >= Follow-Through + 5'
      ];
      rules.defineRule('combatNotes.follow-ThroughFeature',
        'feats.Follow-Through', '=', null
      );
    } else if(feat == 'Great Fortitude') {
      notes = [
        'saveNotes.greatFortitudeFeature:+%V Fortitude'
      ];
      rules.defineRule
        ('saveNotes.greatFortitudeFeature', 'feats.Great Fortitude', '=', null);
      rules.defineRule
        ('save.Fortitude', 'saveNotes.greatFortitudeFeature', '+', null);
    } else if(feat == 'Hidden Weapons') {
      notes = [
        'skillNotes.hiddenWeaponsFeature:+%V Sleight Of Hand to conceal weapon',
        'validationNotes.hiddenWeaponsFeatSkills:' +
          'Requires Sleight Of Hand >= Hidden Weapons'
      ];
      rules.defineRule
        ('skillNotes.hiddenWeaponsFeature', 'feats.Hidden Weapons', '=', null);
    } else if(feat == 'Improved Grapple') {
      notes = [
        'combatNotes.improvedGrappleFeature:' +
          'No AOO on Grapple, grapples +%1%2%3%4%5%6',
        'validationNotes.improvedGrappleFeatAbility:Requires Dexterity >= 13',
        'validationNotes.improvedGrappleFeatFeatures:' +
          'Requires Improved Unarmed Strike',
        'validationNotes.improvedGrappleFeatSkills:' +
          'Requires HTH Combat >= Improved Grapple'
      ];
      rules.defineRule('combatNotes.improvedGrappleFeature.1',
        'feats.Improved Grapple', '=', 'source < 16 ? Math.floor(source / 4) + (source == 1 ? 0 : 1) : 4'
      );
      rules.defineRule('combatNotes.improvedGrappleFeature.2',
        'combatNotes.improvedGrappleFeature.1', '=', '"/" + (source - 5)',
        'feats.Improved Grapple', '=', 'source < 6 ? "" : null'
      );
      rules.defineRule('combatNotes.improvedGrappleFeature.3',
        'combatNotes.improvedGrappleFeature.1', '=', '"/" + (source - 10)',
        'feats.Improved Grapple', '=', 'source < 11 ? "" : null'
      );
      rules.defineRule('combatNotes.improvedGrappleFeature.4',
        'combatNotes.improvedGrappleFeature.1', '=', '"/" + (source - 15)',
        'feats.Improved Grapple', '=', 'source < 16 ? "" : null'
      );
      rules.defineRule('combatNotes.improvedGrappleFeature.5',
        'feats.Improved Grapple', '=', 'source >= 10 ? ", " + (source < 20 ? source - 20 : "-0") + " one-handed" : ""'
      );
      // NOTE: Adept Wrestling not described; feature from Reaping Mauler
      // prestige class seems to overlap basic Improved Grapple feature
      // TODO Devastating Grapple
    } else if(feat == 'Improved Bull Rush') {
      notes = [
        'combatNotes.improvedBullRushFeature:' +
          'No AOO on Bull Rush, +%V strength check%1',
        'validationNotes.improvedBullRushFeatAbility:Requires Strength >= 13',
        'validationNotes.improvedBullRushFeatSkills:' +
          'Requires HTH Combat >= Improved Bull Rush'
      ];
      rules.defineRule
        ('combatNotes.improvedBullRush', 'feats.Improved Bull Rush', '=', null);
      rules.defineRule('combatNotes.improvedBullRush.1',
        'feats.improvedBullRush', '=', 'source<6 ? "" : ", foe move draws AOO"'
      );
    } else if(feat == 'Improved Critical') {
      // TODO
    } else if(feat == 'Improved Defensive Fighting') {
      notes = [
        'combatNotes.defensiveCombatTrainingFeature:-%1 attack/+%V AC',
        'validationNotes.improvedDefensiveFightingFeatSkills:' +
          'Requires HTH Combat >= Improved Defensive Fighting'
      ];
      rules.defineRule('combatNotes.defensiveCombatTrainingFeature',
        'feats.Defensive Combat Training', '=', null
      );
      rules.defineRule('combatNotes.defensiveCombatTrainingFeature.1',
        'feats.Defensive Combat Training', '=', 'source < 7 ? source : Math.floor(source / 2)'
      );
    } else if(feat == 'Improved Disarm') {
      notes = [
        'combatNotes.improvedDisarmFeature:No AOO on disarm, +%V attack%1',
        'validationNotes.improvedDisarmFeatAbility:Requires Intelligence >= 13',
        'validationNotes.improvedDisarmFeatFeatures:' +
          'Requires Combat Expertise >= Improved Disarm',
        'validationNotes.improvedDisarmFeatSkills:' +
          'Requires HTH Combat >= Improved Disarm'
      ];
      rules.defineRule
        ('combatNotes.improvedDisarm', 'feats.Improved Disarm', '=', null);
      rules.defineRule('combatNotes.improvedDisarm.1',
        'feats.improvedDisarm', '=', 'source<6 ? "" : ", weapon thrown 15\'"'
      );
    } else if(feat == 'Improved Feint') {
      notes = [
        'combatNotes.improvedFeintFeature:' +
          'Bluff check to Feint as move action %V/rd%1',
        'validationNotes.improvedFeintFeatAbility:Requires Intelligence >= 13',
        'validationNotes.improvedFeintFeatFeatures:' +
          'Requires Combat Expertise >= Improved Feint',
        'validationNotes.improvedFeintFeatSkills:' +
          'Requires Bluff >= Improved Feint'
      ];
      rules.defineRule
        ('combatNotes.improvedFeintFeature', 'feats.Improved Feint', '=', null);
      rules.defineRule('combatNotes.improvedFeintFeature.1',
        'feats.Improved Feint', '=', '(source < 6 ? "" : ", foe flat-footed full turn") + (source < 11 ? "" : ", feint free action") + (source < 16 ? "" : ", take 10")'
      );
    } else if(feat == 'Improved Great Fortitude') {
      notes = [
        'saveNotes.improvedGreatFortitudeFeature:Reroll Fort %V/day',
        'validationNotes.improvedGreatFortitudeFeatFeatures:' +
          'Requires Great Fortitude >= Improved Great Fortitude'
      ];
      rules.defineRule('saveNotes.improvedGreatFortitudeFeature',
        'feats.Improved Great Fortitude', '=', 'Math.floor((source + 3) / 4)'
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
        'validationNotes.improvedIronWillFeatFeatures:' +
          'Requires Iron Will >= Improved Iron Will'
      ];
      rules.defineRule('saveNotes.improvedIronWillFeature',
        'feats.Improved Iron Will', '=', 'Math.floor((source + 3) / 4)'
      );
    } else if(feat == 'Improved Lightning Reflexes') {
      notes = [
        'saveNotes.improvedLightningReflexesFeature:Reroll Reflex %V/day',
        'validationNotes.improvedLightningReflexesFeatFeatures:' +
          'Requires Lightning Reflexes >= Improved Lightning Reflexes'
      ];
      rules.defineRule('saveNotes.improvedLightningReflexesFeature',
        'feats.Improved Lightning Reflexes', '=', 'Math.floor((source + 3) / 4)'
      );
    } else if(feat == 'Improved Overrun') {
      notes = [
        'combatNotes.improvedOverrunFeature:' +
          '+%V Overrun check, foes cannot avoid%1',
        'validationNotes.improvedOverrunFeatAbility:Requires Strength >= 13',
        'validationNotes.improvedOverrunFeatFeatures:Requires Power Attack'
      ];
      rules.defineRule('combatNotes.improvedOverrunFeature',
        'feats.Improved Overrun', '=', null
      );
      rules.defineRule('combatNotes.improvedOverrunFeature.1',
        'feats.Improved Overrun', '=', 'source < 6 ? "" : ", floored foes AOO"'
      );
    } else if(feat == 'Improved Shield Bash') {
      notes = [
        'combatNotes.improvedShieldBashFeature:No AC penalty on Shield Bash',
        'sanityNotes.improvedShieldBashShield:Implies Shield != None',
        'validationNotes.improvedShieldBashFeatSkills:Requires HTH Combat',
        'validationNotes.improvedShieldBashFeatFeatures:' +
          'Requires Shield Proficiency'
      ];
    } else if(feat == 'Improved Sunder') {
      notes = [
        'combatNotes.improvedSunderFeature:No AOO on Sunder, +%V attack%1',
        'validationNotes.improvedSunderFeatAbility:Requires Strength >= 13',
        'validationNotes.improvedSunderFeatFeatures:' +
          'Requires Power Attack >= Improved Sunder',
        'validationNotes.improvedSunderFeatSkills:' +
          'Requires HTH Combat >= Improved Sunder'
      ];
      rules.defineRule('combatNotes.improvedSunderFeature',
        'features.Improved Sunder', '=', null
      );
      rules.defineRule('combatNotes.improvedSunderFeature.1',
        'features.Improved Sunder', '=', 'source < 6 ? "" : ", apply excess damage to wielder"'
      );
    } else if(feat == 'Improved Trip') {
      notes = [
        'combatNotes.improvedTripFeature:No AOO on Trip, +%V Str check%1',
        'validationNotes.improvedTripFeatAbility:Requires Intelligence >= 13',
        'validationNotes.improvedTripFeatFeats:' +
          'Requires Combat Expertise >= Improved Trip',
        'validationNotes.improvedTripFeatSkills:' +
          'Requires HTH Combat >= Improved Trip * 2'
      ];
      rules.defineRule('combatNotes.improvedTripFeature',
        'feats.Improved Trip', '=', null
      );
      rules.defineRule('combatNotes.improvedTripFeature.1',
        'feats.Improved Trip', '=', 'source < 4 ? "" : ", attack after trip"'
      );
    } else if(feat == 'Improved Unarmed Strike') {
      notes = [
        'combatNotes.improvedUnarmedStrikeFeature:' +
          'No AOO on unarmed attack, %V damage may be lethal, +%1 AC',
        'validationNotes.improvedUnarmedStrikeFeatSkills:' +
          'Requires HTH Combat >= Improved Unarmed Strike'
      ];
      rules.defineRule('combatNotes.improvedUnarmedStrikeFeature',
        'feats.Improved Unarmed Strike', '=', '(source < 9 ? "1d" : "2d") + "034688111668881111111".charAt(source).replace("1", "10")'
      );
      rules.defineRule('combatNotes.improvedUnarmedStrikeFeature.1',
        'feats.Improved Unarmed Strike', '=', 'Math.floor((source+1)/4)'
      );
    } else if(feat == 'Improvised Weapon Use') {
      notes = [
        'combatNotes.improvisedWeaponUseFeature:Foes flat-footed%1',
        'validationNotes.improvisedWeaponUseFeatSkills:' +
          'Requires HTH Combat >= Improvised Weapon Use'
      ];
      rules.defineRule('combatNotes.improvisedWeaponUseFeature.1',
        'feats.Improvised Weapon Use', '=', 'source < 6 ? "" : ", damage +step"'
      );
      rules.defineRule('weaponAttackAdjustment.Improvised',
        'feats.Improvised Weapon Use', '+=', 'Math.min(source, 4)'
      );
      rules.defineRule('weaponCriticalAdjustment.Improvised',
        'feats.Improvised Weapon Use', '+=', 'source >= 8 ? -1 : null'
      );
    } else if(feat == 'Insightful Defense') {
      notes = [
        'combatNotes.insightfulDefenseFeature:' +
          '+%V unarmored AC, even if flat-footed',
        'validationNotes.insightfulDefenseFeatAbility:Requires Wisdom >= 13',
        'validationNotes.insightfulDefenseFeatSkills:' +
           'Requires HTH Combat >= Insightful Defense/Perception >= Insightful Defense'
      ];
      rules.defineRule('combatNotes.insightfulDefenseFeature',
        'feats.Insightful Defense', '=', null,
        'wisdomModifier', 'v', null
      );
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
        'validationNotes.ledgeWalkerFeatSkills:' +
          'Requires Acrobatics >= Ledge Walker * 2'
      ];
      rules.defineRule('abilityNotes.ledgeWalkerFeature',
        'speed', '=', 'Math.floor(source / 2)',
        'feats.Ledge Walker', '+', '5 * source'
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
      notes = [
        "combatNotes.lungeFeature:%1 AC to increase attack reach by 5'",
        'validationNotes.lungeFeatSkills:Requires HTH Combat >= Lunge + 5'
      ];
      rules.defineRule
        ('combatNotes.lungeFeature.1', 'feats.Lunge', '=', 'source - 6');
    } else if(feat == 'Manyshot') {
      notes = [
        'combatNotes.manyshotFeature:' +
          'Fire %V arrows simultaneously at %1 attack',
        'validationNotes.manyshotFeatAbility:Requires Dexterity >= 17',
        'validationNotes.manyshotFeatFeatures:' +
          'Requires Point Blank Shot >= Manyshot/Rapid Shot',
        'validationNotes.manyshotFeatSkills:Requires Fire Combat >= 6'
      ];
      rules.defineRule('combatNotes.manyshotFeature',
        'combatNotes.manyshotFeature.2', '=', '"2/3/4".slice(0, source*2-3)'
      );
      rules.defineRule('combatNotes.manyshotFeature.1',
        'combatNotes.manyshotFeature.2', '=', '"-4/-6/-8".slice(0, source*3-4)'
      );
      rules.defineRule('combatNotes.manyshotFeature.2',
         'skills.Fire Combat', '=', 'source >= 16 ? 4 : source >= 11 ? 3 : 2',
         'feats.Manyshot', 'v', 'source + 1'
      );
    } else if(feat == 'Mighty Throw') {
      notes = [
        'combatNotes.mightyThrowFeature:+%V attack w/thrown weapon',
        'validationNotes.mightyThrowFeatAbility:Requires Strength >= 13'
      ];
      rules.defineRule('combatNotes.mightyThrowFeature',
        'feats.Mighty Throw', '=', null,
        'strengthModifier', 'v', null
      );
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
      notes = [
        'combatNotes.mobilityFeature:+%V AC vs. movement AOO',
        'validationNotes.mobilityFeatAbility:Requires Dexterity >= 13',
        'validationNotes.mobilityFeatFeatures:Requires Dodge >= Mobility',
        'validationNotes.mobilityFeatSkills:Requires HTH Combat >= Mobility'
      ];
      rules.defineRule
        ('combatNotes.mobilityFeature', 'feats.Mobility', '=', null);
    } else if(feat == 'Mounted Archery') {
      notes = [
        'combatNotes.mountedArcheryFeature:Reduce mounted ranged penalty by %V',
        'validationNotes.mountedArcheryFeatFeatures:' +
          'Requires Mounted Combat >= Mounted Archery',
        'validationNotes.mountedArcheryFeatSkills:' +
          'Requires Handle Animal >= Mounted Archery'
      ];
      rules.defineRule('combatNotes.mountedArcheryFeature',
        'feats.Mounted Archery', '=', null
      );
    } else if(feat == 'Mounted Combat') {
      notes = [
        'combatNotes.mountedCombatFeature:' +
          'Handle Animal save vs. mount damage %V/rd%1%2%3%4',
        'validationNotes.mountedCombatFeatSkills:' +
          'Requires HTH Combat >= Mounted Combat/Handle Animal >= Mounted Combat'
      ];
      rules.defineRule('combatNotes.mountedCombatFeature',
        'feats.Mounted Combat', '=', 'Math.floor((source + 1) / 2)'
      );
      rules.defineRule('combatNotes.mountedCombatFeature.1',
        'feats.Mounted Combat', '=', 'source >= 2 ? ", mounted Overrun" + (source >= 9 ? " multiple foes" : "") + " unavoidable, bonus hoof attack" : ""'
      );
      rules.defineRule('combatNotes.mountedCombatFeature.2',
        'feats.Mounted Combat', '=', 'source >= 3 ? ", move before and after mounted attack" : ""'
      );
      rules.defineRule('combatNotes.mountedCombatFeature.3',
        'feats.Mounted Combat', '=', 'source >= 4 ? ", +" + source + " damage from mounted charge" : ""'
      );
      rules.defineRule('combatNotes.mountedCombatFeature.4',
        'feats.Mounted Combat', '=', 'source >= 7 ? ", Bull Rush to unhorse foe" : ""'
      );
      // TODO Full Mounted Atack, Mounted Fighting, Burst of Speed, Deadly Charge
    } else if(feat == 'Nimble Step') {
      notes = [
        'abilityNotes.nimbleStepFeature:' +
          "Full speed through %V' of difficult terrain",
        'validationNotes.ledgeWalkerFeatAbility:Requires Dexterity >= 13',
        'validationNotes.ledgeWalkerFeatSkills:' +
          'Requires Acrobatics >= Nimble Step'
      ];
      rules.defineRule('abilityNotes.nimbleStepFeature',
        'feats.Nimble Step', '=', '5 * source'
      );
    } else if(feat == 'No Retreat') {
      notes = [
        'combatNotes.noRetreatFeature:AOO on withdrawing foe',
        'validationNotes.noRetreatFeatFeatures:Requires Riposte',
        'validationNotes.noRetreatFeatSkills:Requires HTH Combat >= 15'
      ];
    } else if(feat == 'Opportunist') {
      notes = [
        'combatNotes.opportunistFeature:' +
          'AOO vs. foe struck by ally, +%1d6 Sneak Attack damage',
        'validationNotes.opportunistFeatFeatures:' +
          'Requires Lightning Reflexes >= 7/Sneak Attack >= 10',
        'validationNotes.opportunistFeatSkills:Requires HTH Combat >= 7'
      ];
      rules.defineRule('combatNotes.opportunistFeature',
        'feats.Opportunist', '=', 'Math.floor(source / 2)'
      );
    } else if(feat == 'Overhand Chop') {
      notes = [
        'combatNotes.overhandChopFeature:+%V two-handed damage%1%2',
        'validationNotes.overhandChopFeatAbility:Requires Strength >= 12',
        'validationNotes.overhandChopFeatSkills:' +
          'Requires HTH Combat >= Overhand Chop'
      ];
      rules.defineRule('combatNotes.overhandChopFeature.3',
        'feats.Overhand Chop', '=', 'source >= 11 ? 1.5 : 0.5',
        'strengthModifier', '*', null
      );
      rules.defineRule('combatNotes.overhandChopFeature',
        'feats.Overhand Chop', '=', null,
        'combatNotes.overhandChopFeature.3', 'v', 'Math.floor(source)'
      );
      rules.defineRule('combatNotes.overhandChopFeature.1',
        'feats.Overhand Chop', '=', 'source >= 6 ? ", apply to first of full-attack" : ""'
      );
      rules.defineRule('combatNotes.overhandChopFeature.2',
        'feats.Overhand Chop', '=', 'source >= 11 ? ", " + (source < 16 ? source - 16 : "-0") + " attack for auto-crit" : ""'
      );
    } else if(feat == 'Penetrating Strike') {
      notes = [
        'combatNotes.penetratingStrikeFeature:' +
          'Focused weapons ignore DR %V/anything',
        'validationNotes.penetratingStrikeFeatFeatures:' +
          'Requires Weapon Focus/Weapon Training >= Penetrating Strike',
        'validationNotes.penetratingStrikeFeatSkills:' +
          'Requires Fire Combat >= Penetrating Strike * 10 | HTH Combat >= Penetrating Strike * 10'
      ];
      rules.defineRule('combatNotes.penetratingStrikeFeature',
        'feats.Penetrating Strike', '=', null
      );
    } else if(feat == 'Point Blank Shot') {
      notes = [
        'combatNotes.pointBlankShotFeature:' +
          "+%V/+%1 ranged attack/damage w/in 30'",
        'validationNotes.pointBlankShotSkills:' +
          'Requires Fire Combat >= Point Blank Shot'
      ];
      rules.defineRule('combatNotes.pointBlankShotFeature',
        'feats.Point Blank Shot', '=', 'Math.floor((source + 1) / 2)'
      );
      rules.defineRule('combatNotes.pointBlankShotFeature.1',
        'feats.Point Blank Shot', '=', 'Math.floor(source / 2)'
      );
    } else if(feat == 'Power Attack') {
      notes = [
        'combatNotes.powerAttackFeature:Up to %V -attack/+damage',
        'validationNotes.powerAttackFeatAbility:Requires Strength >= 13',
        'validationNotes.powerAttackFeatSkills:' +
          'Requires HTH Combat >= Power Attack'
      ];
      rules.defineRule
        ('combatNotes.powerAttackFeature', 'feats.Power Attack', '=', null);
    } else if(feat == 'Precise Shot') {
      notes = [
        'combatNotes.preciseShotFeature:' +
          'Reduce penalty on shot into melee by %V, concealed miss chance by %1%',
        'validationNotes.preciseShotFeatFeatures:' +
          'Requires Point Blank Shot >= Precise Shot',
        'validationNotes.preciseShotFeatSkills:' +
          'Requires Fire Combat >= Precise Shot'
      ];
      rules.defineRule
        ('combatNotes.preciseShotFeature', 'feats.Precise Shot', '=', null);
      rules.defineRule('combatNotes.preciseShotFeature.1',
        'feats.Precise Shot', '=', 'source * 5'
      );
    } else if(feat == 'Precise Strike') {
      notes = [
        'combatNotes.preciseStrikeFeature:+%V damage w/light weapon',
        'validationNotes.preciseStrikeFeatFeatures:' +
          'Requires Dodge/Weapon Finesse >= Precise Strike / 2',
        'validationNotes.preciseStrikeFeatSkills:' +
          'Requires HTH Combat >= Precise Strike + 6'
      ];
      rules.defineRule
        ('combatNotes.preciseStrikeFeature', 'feats.Precise Strike', '=', null);
    } else if(feat == 'Quiet Death') {
      notes = [
        'combatNotes.quietDeathFeature:Opposed Stealth to avoid id as killer',
        'validationNotes.quietDeathFeatFeatures:' +
           'Requires Death Attack >= 6/Sneak Attack >= 6',
        'validationNotes.quietDeathFeatSkills:Requires Stealth >= 8'
      ];
    } else if(feat == 'Quivering Palm') {
      notes = [
        'combatNotes.quiveringPalmFeature:Foe DC %V Fort save or dies 1/week',
        'validationNotes.quiveringPalmFeatFeatures:' +
          'Requires Improved Unarmed Strike >= 11/Stunning Fist >= 5',
        'validationNotes.quiveringPalmFeatSkills:Requires HTH Combat >= 11'
      ];
      rules.defineRule('combatNotes.quiveringPalmFeature',
        'Improved Unarmed Strike', '=', '10 + Math.floor(source / 2)',
        'wisdomModifier', '+', null
      );
    } else if((matchInfo = feat.match(/^Rapid Reload \((.*)\)$/))!=null) {
      var weapon = matchInfo[1];
      var weaponNoSpace = weapon.replace(/ /g, '');
      notes = [
        'combatNotes.rapidReload(' + weaponNoSpace + ')Feature:' +
          'Reload ' + weapon + ' Crossbow as ' +
          (weapon == 'Heavy' ? 'move' : 'free') + ' action',
        'sanityNotes.rapidReload(' + weaponNoSpace + ')FeatWeapons:' +
          'Implies ' + weapon + ' Crossbow',
        'validationNotes.rapidReload(' + weaponNoSpace + ')FeatSkills:' +
          'Requires Fire Combat'
      ];
    } else if(feat == 'Rapid Shot') {
      notes = [
        'combatNotes.rapidShotFeature:Normal and extra ranged -2 attacks',
        'validationNotes.rapidShotFeatAbility:Requires Dexterity >= 13',
        'validationNotes.rapidShotFeatFeatures:Requires Point Blank Shot',
        'validationNotes.rapidShotFeatSkills:Requires Fire Combat'
      ];
    } else if(feat == 'Resiliency') {
      notes = [
        'combatNotes.resiliencyFeature:%V temp HP/day to stay >= 0 1 min'
      ];
      rules.defineRule
        ('combatNotes.resiliencyFeature', 'feats.Resiliency', '=', null);
    } else if(feat == 'Riposte') {
      notes = [
        'combatNotes.riposteFeature:Make AOO after successful parry',
        'validationNotes.riposteFeatSkills:Requires HTH Combat >= 11'
      ];
    } else if(feat == 'Rogue Crawl') {
      notes = [
        "abilityNotes.rogueCrawlFeature:Crawl %V'/rd"
      ];
      rules.defineRule('abilityNotes.rogueCrawlFeature',
        'feats.Rogue Crawl', '=', 'source * 5 + 5'
      );
    } else if(feat == 'Shield Cover') {
      notes = [
        'saveNotes.shieldCoverFeature:+%V Reflex',
        'validationNotes.shieldCoverFeatFeatures:' +
          'Requires Shield Proficiency >= Shield Cover',
        'validationNotes.shieldCoverFeatSkills:' +
          'Requires HTH Combat >= Shield Cover'
      ];
      rules.defineRule('saveNotes.shieldCoverFeature',
        'feats.Shield Cover', '=', null,
        'shield', 'v', 'source == "None" ? 0 : ' +
                       'source == "Tower" ? 4 : source.match(/Heavy/) ? 2 : 1'
      );
    } else if(feat == 'Shield Deflection') {
      notes = [
        'combatNotes.shieldDeflectionFeature:+%V Touch AC',
        'validationNotes.shieldDeflectionFeatFeatures:' +
          'Requires Shield Proficiency >= Shield Deflection',
        'validationNotes.shieldDeflectionFeatSkills:' +
          'Requires HTH Combat >= Shield Deflection'
      ];
      rules.defineRule('combatNotes.shieldDefelectionFeature',
        'feats.Shield Defelection', '=', null
      );
    } else if(feat == 'Shield Proficiency') {
      notes = [
        'combatNotes.shieldProficiencyFeature:Proficiency with %V shields%1',
        'validationNotes.shieldProficiencyFeatSkills:' +
          'Requires HTH Combat >= Shield Proficiency'
      ];
      rules.defineRule('combatNotes.shieldProficiencyFeature',
        'feats.Shield Proficiency', '=', 'source >= 5 ? "Tower" : source >= 2 ? "Heavy" : "Light"'
      );
      rules.defineRule('shieldProficiencyLevel',
        'feats.Shield Proficiency', '^', 'source >= 5 ? ' + SRD35.PROFICIENCY_TOWER + ' : source == 2 ? ' + SRD35.PROFICIENCY_HEAVY + ' : ' + SRD35.PROFICIENCY_LIGHT
      );
      // TODO Armor training, optimization, defense, and mastery
    } else if(feat == 'Sidestep Charge') {
      notes = [
        'combatNotes.sidestepChargeFeature:' +
          '+%V AC vs. charge, AOO after missed charge',
        'validationNotes.sidestepChargeFeatAbility:Dexterity >= 13',
        'validationNotes.sidestepChargeFeatFeatures:' +
          'Requires Dodge >= Sidestep Charge',
        'validationNotes.sidestepChargeFeatSkills:' +
          'Requires HTH Combat >= Sidestep Charge'
      ]
      rules.defineRule('combatNotes.sidestepChargeFeature',
        'feats.Sidestep Charge', '=', 'Math.floor(source / 2)'
      );
    } else if(feat == 'Slow Reactions') {
      notes = [
        'combatNotes.slowReactionsFeature:' +
          'After successful sneak attack, foe no AOO, -%V Combat Reflexes'
      ];
      rules.defineRule('combatNotes.slowReactionsFeature',
        'feats.Slow Reactions', '=', 'source - 1'
      );
    } else if(feat == 'Snatch Arrows') {
      notes = [
        'combatNotes.snatchArrowsFeature:Catch ranged weapons',
        'validationNotes.snatchArrowsFeatAbility:Requires Dexterity >= 15',
        'validationNotes.snatchArrowsFeatFeatures:' +
          'Requires Deflect Arrows/Improved Unarmed Strike'
      ];
    } else if(feat == 'Sneak Attack') {
      notes = [
        'combatNotes.masterStrikeFeature:' +
          'Sneak attack target DC %V Fort or sleep/paralyze/die',
        'combatNotes.sneakAttackFeature:' +
          '%Vd6 extra damage when surprising or flanking',
        'validationNotes.sneakAttackFeatFeatures:' +
           'Requires Lightning Reflexes >= Sneak Attack / 2 + 1',
        'validationNotes.sneakAttackFeatSkills:' +
           'Requires HTH Combat >= Sneak Attack / 2 + 1'
      ];
      rules.defineRule('combatNotes.sneakAttackFeature',
        'feats.Sneak Attack', '=', 'Math.floor((source+1) / 2)'
      );
      rules.defineRule('combatNotes.masterStrikeFeature',
        'feats.Sneak Attack', '=', 'source >= 20 ? 20 : null',
        'intelligenceModifier', '+', null
      );
    } else if(feat == 'Stunning Fist') {
      notes = [
        'combatNotes.stunningFistFeature:' +
          'Foe DC %V Fortitude save or stunned %1/day',
        'validationNotes.stunningFistFeatAbility:' +
          'Requires Dexterity >= 13/Wisdom >= 13',
        'validationNotes.stunningFistFeatSkills:' +
          'Requires HTH Combat >= Stunning Fist',
        'validationNotes.stunningFistFeatFeatures:' +
          'Requires Improved Unarmed Strike >= Stunning Fist'
      ];
      rules.defineRule('combatNotes.stunningFistFeature',
        'feats.Stunning Fist', '=', '10 + Math.floor(source / 2)',
        'wisdomModifier', '+', null
      );
      rules.defineRule('combatNotes.stunningFistFeature.1',
        'feats.Stunning Fist', '=', null
      )
    } else if(feat == 'Successive Fire') {
      notes = [
        'combatNotes.successiveFireFeature:' +
          'Reduce multi-attack fire penalties by %V',
        'validationNotes.successiveFireFeatSkills:' +
          'Requires Fire Combat >= Successive Fire + 5'
      ];
      rules.defineRule('combatNotes.successiveFireFeature',
        'feats.Successive Fire', '=', null
      );
    } else if(feat == 'Surprise Attacks') {
      notes = [
        'combatNotes.surpriseAttacksFeature:Foes flat-footed in surprise rd',
        'validationNotes.surpriseAttacksFeatFeatures:Requires Sneak Attack',
        'validationNotes.surpriseAttacksFeatSkills:Requires Stealth >= 2'
      ];
    } else if(feat == 'Swift Tracker') {
      notes = [
        'skillNotes.swiftTrackerFeature:%V/%1 track at normal/double speed',
        'validationNotes.swiftTrackerFeatSkills:' +
          'Requires Survival >= Swift Tracker'
      ];
      rules.defineRule('skillNotes.swiftTrackerFeature',
        'feats.Swift Tracker', '=', 'source - 5'
      );
      rules.defineRule('skillNotes.swiftTrackerFeature.1',
        'feats.Swift Tracker', '=', '(source * 2) - 20'
      );
    } else if(feat == 'Throw Anything') {
      notes = [
        'combatNotes.throwAnythingFeature:' +
          'Reduce penalty for improvised ranged weapon by %V, +1 attack w/thrown splash',
        'validationNotes.throwAnythingFeatSkills:' +
          'Requires HTH Combat >= Throw Anything'
      ];
      rules.defineRule
        ('combatNotes.throwAnythingFeature', 'feats.Throw Anything', '=', null);
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
        'validationNotes.trapSenseFeatFeatures:' +
          'Requires Lightning Reflexes >= Trap Sense',
        'validationNotes.trapSenseFeatSkills:Requires Perception >= Trap Sense'
      ];
      rules.defineRule
        ('combatNotes.trapSenseFeature', 'feats.Trap Sense', '=', null);
      rules.defineRule
        ('saveNotes.trapSenseFeature', 'feats.Trap Sense', '=', null);
    } else if(feat == 'Two-Weapon Defense') {
      notes = [
        'combatNotes.two-WeaponDefenseFeature:+%V AC w/two weapons',
        'validationNotes.two-WeaponDefenseFeatAbility:Requires Dexterity >= 15',
        'validationNotes.two-WeaponDefenseFeatFeatures:' +
          'Requires Two-Weapon Fighting >= Two-Weapon Defense',
        'validationNotes.two-WeaponDefenseFeatSkills:' +
          'Requires HTH Combat >= Two-Weapon Defense'
      ];
      rules.defineRule('combatNotes.two-weaponDefenseFeature',
        'feats.Two-Weapon Defense', '=', '1 + Math.floor(source / 4)'
      );
    } else if(feat == 'Two-Weapon Fighting') {
      notes = [
        'combatNotes.two-WeaponFightingFeature:' +
          'Reduce primary/off-hand penalties to %1/%2%3',
        'combatNotes.two-WeaponRendFeature:+1d%V+%1 when hit with both',
        'combatNotes.two-WeaponPounceFeature:+%1 attack w/both on charge',
        'validationNotes.two-WeaponFightingFeatAbility:' +
          'Requires Dexterity >= 15',
        'validationNotes.two-WeaponFightingFeatSkills:' +
          'Requires HTH Combat >= Two-Weapon Fighting'
      ];
      rules.defineRule('combatNotes.two-weaponFightingFeature.1',
        'feats.Two-Weapon Fighting', '=', 'source < 6 ? source - 6 : 0'
      );
      rules.defineRule('combatNotes.two-weaponFightingFeature.2',
        'feats.Two-Weapon Fighting', '=', 'source < 10 ? source - 10 : 0'
      );
      rules.defineRule('combatNotes.two-weaponFightingFeature.3',
        'feats.Two-Weapon Fighting', '=', 'source >= 6 ? "Additional off-hand -5" + (source >= 11 ? "/-10" : "") + (source >= 16 ? "/-15" : "") : ""'
      );
      rules.defineRule('combatNotes.two-weaponRendFeature',
        'feats.Two-Weapon Fighting', '=', 'source<9 ? null : source<13 ? 6 : source<17 ? 8 : 10'
      );
      rules.defineRule('combatNotes.two-weaponRendFeature.1',
        'strengthModifier', '=', 'Math.floor(source * 1.5)'
      );
      rules.defineRule('combatNotes.two-weaponPounceFeature',
        'feats.Two-Weapon Fighting', '?', 'source >= 10'
      );
      rules.defineRule('combatNotes.two-weaponPounceFeature.1',
        'feats.Two-Weapon Fighting', '=', 'source<14 ? 0 : source<18 ? 1 : 2'
      );
    } else if(feat == 'Uncanny Dodge') {
      notes = [
        'combatNotes.uncannyDodgeFeature:+%V flat-footed AC, -%V foe Sneak Attack%1',
        'validationNotes.uncannyDodgeFeatFeatures:' +
          'Requires Lightning Reflexes >= Uncanny Dodge'
      ];
      rules.defineRule('combatNotes.uncannyDodgeFeature',
        'feats.Uncanny Dodge', '=', null,
        'dexterityModifier', 'v', null
      );
      rules.defineRule('combatNotes.uncannyDodgeFeature.1',
        'feats.Uncanny Dodge', '=', 'source >= 5 ? (source >= 6 ? ", -2" : ", -1") + " foe flanking attack" : ""'
      );
    } else if(feat == 'Vital Strike') {
      notes = [
        'combatNotes.vitalStrikeFeature:+%Vd6 damage on lone full-attack',
        'validationNotes.vitalStrikeFeatSkills:' +
          'Requires HTH Combat >= Vital Strike + 10'
      ];
      rules.defineRule('combatNotes.vitalStrikeFeature',
        'feats.Vital Strike', '=', 'Math.min(Math.floor((source+1)/2), 5)',
        'skills.HTH Combat', '*', 'source >= 16 ? 2 : null'
      );
    } else if(feat == 'Weapon Finesse') {
      notes = [
        'combatNotes.weaponFinesseFeature:' +
          '+%V melee attack (dex instead of str)',
        'sanityNotes.weaponFinesseFeatAbility:' +
          'Implies Dexterity Modifier exceed Strength Modifier',
        'validationNotes.weaponFinesseFeatAbility:Requires Dexterity >= 13'
      ];
      rules.defineRule('combatNotes.weaponFinesseFeature',
        'combatNotes.weaponFinesseFeature.1', '=', null,
        'strengthModifier', '+', '-source'
      );
      rules.defineRule('combatNotes.weaponFinesseFeature.1',
        'feats.Weapon Finesse', '=', null,
        'dexterityModifier', 'v', null
      );
      rules.defineRule
        ('meleeAttack', 'combatNotes.weaponFinesseFeature', '+', null);
      rules.defineRule('sanityNotes.weaponFinesseFeatAbility',
        'feats.Weapon Finesse', '=', '-1',
        'dexterityModifier', '+', 'source',
        'strengthModifier', '+', '-source',
        '', 'v', '0'
      );
    } else if((matchInfo = feat.match(/^Weapon Proficiency \((.*)\)$/))!=null) {
      var weapon = matchInfo[1];
      var weaponNoSpace = weapon.replace(/ /g, '');
      notes = [
        'validationNotes.weaponProficiency(' + weaponNoSpace + ')FeatSkills:' +
          'Requires HTH Combat'
      ];
      if(weapon == 'Bastard Sword' || weapon == 'Dwarven Waraxe') {
        notes = notes.concat([
          'validationNotes.weaponProficiency(' + weaponNoSpace +
            ')FeatAbility:Requires Strength >= 13'
        ]);
      }
      // TODO Martial Weapon Proficiency
    } else if(feat == 'Weapon Training') {
      // TODO
    } else if(feat == 'Whirlwind Attack') {
      notes = [
        'combatNotes.whirlwindAttackFeature:Attack all foes w/in reach',
        'validationNotes.whirlwindAttackFeatAbility:' +
          'Requires Dexterity >= 13/Intelligence >= 13',
        'validationNotes.whirlwindAttackFeatSkills:' +
          'Requires HTH Combat >= Whirlwind Attack',
        'validationNotes.whirlwindAttackFeatFeatures:' +
          'Requires Combat Expertise >= Whirlwind Attack/Dodge >= Whirlwind Attack/Mobility >= 4'
      ];
    } else if(feat == 'Wild Empathy') {
      notes = [
        'skillNotes.wildEmpathyFeature:Diplomacy with animals',
        'validationNotes.wildEmpathyFeatSkills:Requires Handle Animal'
      ];
    // Metamagic Feats
    } else if(feat == 'Empower Spell') {
      notes = [
        'magicNotes.empowerSpellFeature:' +
          'x1.5 chosen spell variable effects uses +2 spell slot',
        'sanityNotes.empowerSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if(feat == 'Enlarge Spell') {
      notes = [
        'magicNotes.enlargeSpellFeature:' +
          'x2 chosen spell range uses +1 spell slot',
        'sanityNotes.enlargeSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if(feat == 'Extend Spell') {
      notes = [
        'magicNotes.extendSpellFeature:' +
          'x2 chosen spell duration uses +1 spell slot',
        'sanityNotes.extendSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if(feat == 'Heighten Spell') {
      notes = [
        'magicNotes.heightenSpellFeature:Increase chosen spell level',
        'sanityNotes.heightenSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if(feat == 'Maximize Spell') {
      notes = [
        'magicNotes.maximizeSpellFeature:' +
          'Maximize all chosen spell variable effects uses +3 spell slot',
        'sanityNotes.maximizeSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if(feat == 'Quicken Spell') {
      notes = [
        'magicNotes.quickenSpellFeature:' +
          'Free action casting 1/round uses +4 spell slot',
        'sanityNotes.quickenSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if(feat == 'Silent Spell') {
      notes = [
        'magicNotes.silentSpellFeature:' +
          'Cast spell w/out speech uses +1 spell slot',
        'sanityNotes.silentSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if(feat == 'Still Spell') {
      notes = [
        'magicNotes.stillSpellFeature:' +
          'Cast spell w/out movement uses +1 spell slot',
        'sanityNotes.stillSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if(feat == 'Widen Spell') {
      notes = [
        'magicNotes.widenSpellFeature:x2 area of affect uses +3 spell slot',
        'sanityNotes.widenSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else
      continue;

    rules.defineChoice('feats', feat);
    rules.defineRule('features.' + feat, 'feats.' + feat, '=', null);
    if(notes != null)
      rules.defineNote(notes);
    rules.defineRule('allocatedExp.Feats',
      'feats.' + feat, '+=', 'source * (source + 1) + 3'
    );

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
    ['powers', 'Powers', 'bag', 'powers'],
    ['skills', 'Skills', 'bag', 'skills'],
    ['languages', 'Languages', 'set', 'languages'],
    ['hitPoints', 'Hit Points', 'text', [4]],
    ['armor', 'Armor', 'select-one', 'armors'],
    ['shield', 'Shield', 'select-one', 'shields'],
    ['weapons', 'Weapons', 'bag', 'weapons'],
    ['spells', 'Spells', 'fset', 'spells'],
    ['notes', 'Notes', 'textarea', [40,10]],
    ['hiddenNotes', 'Hidden Notes', 'textarea', [40,10]]
  ];
  return editorElements;
};

/* Defines the rules related to spells. */
HybridD20.magicRules = function(rules, schools) {
  rules.defineChoice('schools', schools);
};


/* Defines the rules related to character powers. */
HybridD20.powerRules = function(rules, powers) {

  for(var i = 0; i < powers.length; i++) {

    var cost = 5;
    var power = powers[i];
    var matchInfo;
    var notes = null;

    if(power == 'Abundant Step') {
      notes = [
        'magicNotes.abundantStepFeature:<i>Dimension Door</i> for 2 Ki points',
        'validationNotes.abundantStepPowerFeatures:Requires Ki Mastery'
      ];
      cost = 12;
    } else if(power == 'Aligned Ki Strike') {
      notes = [
        'combatNotes.alignedKiStrikeFeature:Treat unarmed as lawful weapon',
        'validationNotes.alignedKiStrikePowerFeatures:Requires Ki Mastery'
      ];
      cost = 20;
    } else if(power == 'Acidic Ray') {
      notes = [
        'magicNotes.acidicRayFeature:30 ft ranged touch 1d6+%V HP',
        'validationNotes.acidicRayPowerFeatures:Requires Sorcery'
      ];
      cost = 10;
      rules.defineRule('magicNotes.acidicRayFeature',
        'features.Sorcery', '=', 'Math.floor(source / 2) + 1'
      );
    } else if(power == 'Added Summonings') {
      notes = [
        'magicNotes.addedSummoningsFeature:' +
          '<i>Summon Monster</i> brings additional demon/fiendish creature',
        'validationNotes.addedSummoningsPowerFeatures:Requires Sorcery'
      ];
      cost = 20;
    } else if(power == 'Alien Resistance') {
      notes = [
        'saveNotes.alienResistanceFeature:%V spell resistance',
        'validationNotes.alienResistancePowerFeatures:Requires Sorcery'
      ];
      cost = 100;
      rules.defineRule('saveNotes.alienResistanceFeature',
        'features.Sorcery', '=', 'source + 11'
      );
    } else if(power == 'Aligned Arrow') {
      notes = [
        'combatNotes.alignedArrowsFeature:Arrows anarchic/axiomatic/holy/unholy',
        'validationNotes.alignedArrowPowerFeatures:' +
          'Requires Arcane Spellcasting/Point-Blank Shot/Precise Shot/Spell Repertoire (Arcane)/Weapon Training (Bows)',
        'validationNotes.alignedArrowPowerSkills:Requires Combat (Fire) >= 15'
      ];
      cost = 40;
    } else if(power == 'Animal Form') {
      cost = 20;
      notes = [
        "abilityNotes.animalFormFeature:+4 Str/Dex, 60' climb/fly/swim",
        'combatNotes.animalFormFeature:+4 natural AC',
        "featureNotes.animalFormFeature:Darkvision/Low-Light Vision/Scent/Improved Grab/Improved Pounce/Improved Trip",
        'magicNotes.animalFormFeature:<i>Beast Shape II</i> to selected beast at will'
      ];
    } else if(power == 'Animal Fury') {
      notes = [
        'combatNotes.animalFuryFeature:Bite attack 1d%V+%1 HP during rage',
        'validationNotes.animalFuryPowerFeatures:Requires Rage >= 2'
      ];
      rules.defineRule('combatNotes.animalFuryFeature',
        '', '=', '6',
        'features.Small', '+', '-2'
      );
      rules.defineRule('combatNotes.animalFuryFeature.1',
        'strengthModifier', '=', 'Math.floor(source / 2)'
      );
      cost = 20;
    } else if(power == 'Arrow Of Death') {
      notes = [
        'combatNotes.arrowOfDeathFeature:' +
          'Special arrow kills (DC 20 Fort 3d6+%V HP)',
        'validationNotes.arrowOfDeathPowerFeatures:' +
          'Requires Point-Blank Shot/Precise Shot/Spell Repertoire (Arcane)/Spellcasting (Arcane)/Weapon Training (Bows)',
        'validationNotes.arrowOfDeathPowerSkills:Requires Combat (Fire) >= 16'
      ];
      rules.defineRule('combatNotes.arrowOfDeathFeature',
        'features.Spellcasting (Arcane)', '=', null
      );
      cost = 24;
    } else if(power == 'Arcane Sight') {
      notes = [
        "featureNotes.arcaneSightFeature:See magical auras within 120'"
      ];
      cost = 30;
    } else if(power == 'Arcane Strike') {
      notes = [
        'combatNotes.arcaneStrikeFeature:' +
          'Weapons +%V magic damage bonus 1 rd',
        'validationNotes.arcaneStrikePowerFeatures:' +
           'Requires Spellcasting (Arcane)'
      ];
      cost = 50;
      rules.defineRule('combatNotes.arcaneStrikeFeature',
        'features.Spellcasting (Arcane)', '=', 'Math.floor(source / 5) + 1'
      );
    } else if(power == 'Arcane Theurgy') {
      cost = 0;
      // TODO
    } else if(power == 'Armored Skin') {
      notes = [
        'combatNotes.armoredSkinFeature:+%V AC'
      ];
      cost = 30;
      rules.defineRule
        ('armorClass', 'combatNotes.armoredSkinFeature', '+', null);
      rules.defineRule('combatNotes.armoredSkinFeature',
        'powers.Armored Skin', '=', 'Math.floor(source / 3) + 1'
      );
    } else if(power == 'Augment Summoning') {
      notes = [
        'magicNotes.augmentSummoningFeature:Summoned creatures +4 Str/Con',
        'validationNotes.augmentSummoningPowerFeatures:' +
          'Requires Spell Focus (Conjuration)'
      ];
      cost = 45;
    } else if(power == 'Augmented Wild Shape') {
      notes = [
        'magicNotes.augmentedWildShapeFeature:+%V Str in Wild Shape',
        'validationNotes.augmentedWildShapePowerFeatures:Requires Wild Shape'
      ];
      cost = 20;
      rules.defineRule('magicNotes.augmentedWildShapeFeature', '', '=', '4');
    } else if(power == 'Axiomatic Strike') {
      notes = [
        'combatNotes.axiomaticStrikeFeature:Unarmed +2d6 vs. chaotic',
        'validationNotes.axiomaticStrikePowerFeatures:Requires Ki Mastery'
      ];
      cost = 60;
    } else if(power == 'Beast Wild Shape') {
      notes = [
        'magicNotes.augmentedWildShapeFeature:Wild Shape to magical beast',
        'validationNotes.beastWildShapePowerFeatures:Requires Wild Shape'
      ];
      cost = 12;
    } else if(power == 'Bleeding Critical') {
      notes = [
        'combatNotes.bleedingCriticalFeature:1d6 HP/rd after critical hit',
        'validationNotes.bleedingCriticalPowerFeatures:' +
          'Requires Improved Critical >= 4'
      ];
      cost = 35;
    } else if(power == 'Blinding Critical') {
      notes = [
        'combatNotes.blindingCriticalFeature:' +
          'Foe permanently blind (DC %V Fort 1 rd) after critical hit',
        'validationNotes.blindingCriticalPowerFeatures:' +
          'Requires Improved Critical >= 8'
      ];
      cost = 45;
      rules.defineRule('combatNotes.blindingCriticalFeature',
        'baseAttack', '=', 'source + 10'
      );
    } else if(power == 'Blinding Speed') {
      notes = [
        "abilityNotes.blindingSpeedFeature:+30' move %V rd/day",
        'combatNotes.blindingSpeedFeature:+1 attack/AC %V rd/day',
        'saveNotes.blindingSpeedFeature:+1 Reflex %V rd/day',
        'validationNotes.blindingCriticalPowerAbility:Requires Dexterity >= 25'
      ];
      cost = 50;
      rules.defineRule('abilityNotes.blindingSpeedFeature',
        'feats.Blinding Speed', '=', 'source >= 5 ? source : null'
      );
      rules.defineRule('combatNotes.blindingSpeedFeature',
        'feats.Blinding Speed', '=', 'source >= 5 ? source : null'
      );
      rules.defineRule('saveNotes.blindingSpeedFeature',
        'feats.Blinding Speed', '=', 'source >= 5 ? source : null'
      );
    } else if(power == 'Blindsight') {
      notes = [
        'abilityNotes.blindsightFeature:' +
          "Percieve through invisibility and concealment w/in 30'",
        'validationNotes.blindsightPowerFeatures:Requires Blind-Fight'
      ];
      cost = 40;
      // TODO Extend 15' per 20 XP
    } else if(power == 'Breath Weapon') {
      notes = [
        'combatNotes.blindingCriticalFeature:' +
          'Foe blinded permanently (DC %V Fort for 1 rd) after critical hit',
        'combatNotes.breathWeaponFeature:' +
          "%3 %4 %Vd6 HP (%1 DC Reflex half) %2/day",
        'validationNotes.breathWeaponPowerFeatures:Requires Sorcery >= 9'
      ];
      cost = 14;
      var breathShape = "30' cone"; // TODO
      var energyType = 'acid'; // TODO
      rules.defineRule
        ('combatNotes.breathWeaponFeature', 'features.Sorcery', '=', null);
      rules.defineRule('combatNotes.breathWeaponFeature.1',
        'features.Sorcery', '=', '10 + Math.floor(source / 2)',
        'charismaModifier', '+', null
      );
      rules.defineRule('combatNotes.breathWeaponFeature.2',
        'features.Sorcery', '=',
        'source >= 20 ? 3 : source >= 17 ? 2 : source >= 9 ? 1 : null'
      );
      rules.defineRule('combatNotes.breathWeaponFeature.3',
        'features.Sorcery', '=', '"' + breathShape + '"'
      );
      rules.defineRule('combatNotes.breathWeaponFeature.4',
        'features.Sorcery', '=', '"' + energyType + '"'
      );
    } else if(power == 'Call To Mind') {
      cost = 10;
      // TODO
    } else if(power == 'Channeling Smite') {
      cost = 20;
      // TODO
    } else if(power == 'Claws') {
      cost = 20;
      // TODO
    } else if(power == 'Clear Mind') {
      cost = 30;
      // TODO
    } else if(power == 'Clerical Ordainment') {
      cost = 0;
      // TODO
    } else if(power == 'Combat Focus') {
      cost = 40;
      // TODO
    } else if(power == 'Corrupting Touch') {
      cost = 10;
      // TODO
    } else if(power == 'Conviction') {
      cost = 28;
      // TODO
    } else if(power == 'Countersong') {
      cost = 4;
      // TODO
    } else if(power == 'Damage Reduction') {
      cost = 4; // TODO
      // TODO
    } else if(power == 'Darkvision') {
      cost = 'source * 5 + 15';
      notes = [
        "featureNotes.darkvisionFeature:%V' b/w vision in darkness"
      ];
      rules.defineRule('featureNotes.darkvisionFeature',
        'powers.Darkvision', '=', 'source * 5 + 55'
      );
    } else if(power == 'Dazzling Display') {
      cost = 20;
      // TODO
    } else if(power == 'Deadly Performance') {
      cost = 28;
      // TODO
    } else if(power == 'Deafening Critical') {
      notes = [
        'combatNotes.deafeningCriticalFeature:' +
          'Foe permanently deaf (DC %V Fort 1 rd) after critical hit',
        'validationNotes.deafeningCriticalPowerFeatures:' +
          'Requires Improved Critical >= 6'
      ];
      cost = 45;
      rules.defineRule('combatNotes.deafeningCriticalFeature',
        'baseAttack', '=', 'source + 10'
      );
    } else if(power == "Death's Gift") {
      cost = 30;
      // TODO
    } else if(power == 'Deathless') {
      cost = 120;
      // TODO
    } else if(power == 'Defensive Precognition') {
      cost = 20;
      // TODO
    } else if(power == 'Defensive Prescience') {
      cost = 20;
      // TODO
    } else if(power == 'Destiny Realized') {
      cost = 68;
      // TODO
    } else if(power == 'Devastating Critical') {
      notes = [
        'combatNotes.devastatingCriticalFeature:' +
          'Foe die (DC %V Fort 3d6 HP) after critical hit',
        'validationNotes.devastatingCriticalPowerFeatures:' +
          'Requires Improved Critical >= 20'
      ];
      cost = 50;
      rules.defineRule('combatNotes.devastatingCriticalFeature',
        'strengthModifier', '=', 'source + 20'
      );
    } else if(power == 'Dimension Spring Attack') {
      cost = 100;
      // TODO
    } else if(power == 'Dirge Of Doom') {
      cost = 12;
      // TODO
    } else if(power == 'Discordant Performance') {
      cost = 16;
      // TODO
    } else if(power == 'Distance Arrow') {
      cost = 20;
      // TODO
    } else if(power == 'Druidical Initiation') {
      cost = 0;
      // TODO
    } else if(power == 'Elemental Blast') {
      cost = 14;
      // TODO
    } else if(power == 'Elemental Rage') {
      cost = 20;
      // TODO
    } else if(power == 'Elemental Ray') {
      cost = 10;
      // TODO
    } else if(power == 'Empty Body') {
      cost = 18;
      // TODO
    } else if(power == 'Energy Arrow') {
      cost = 60;
      // TODO
    } else if(power == 'Energy Burst Arrow') {
      cost = 70;
      // TODO
    } else if(power == 'Energy Resistance') {
      cost = 3;
      // TODO
    } else if(power == 'Enhance Arrows') {
      cost = 35;
      // TODO
    } else if(power == 'Eschew Materials') {
      cost = 20;
      // TODO
    } else if(power == 'Exhausting Critical') {
      notes = [
        'combatNotes.exhaustingCriticalFeature:' +
          'Foe exhausted after critical hit',
        'validationNotes.exhaustingCriticalPowerFeatures:' +
          'Requires Improved Critical >= 8'
      ];
      cost = 80;
    } else if(power == 'Fascinate') {
      cost = 8;
      // TODO
    } else if(power == 'Fast Healing') {
      cost = 40;;
      // TODO
    } else if(power == 'Fated') {
      cost = 30;
      // TODO
    } else if(power == 'Fey Magic') {
      cost = 90;
      // TODO
    } else if(power == 'Feytouched') {
      cost = 68;
      // TODO
    } else if(power == 'Font Of Power') {
      cost = 30;
      // TODO
    } else if(power == 'Free Casting') {
      cost = 26;
      // TODO
    } else if(power == 'Free Manifesting') {
      cost = 26;
      // TODO
    } else if(power == 'Frightening Tune') {
      cost = 16;
      // TODO
    } else if(power == "Gorgon's Fist") {
      cost = 20;
      // TODO
    } else if(power == 'Grasp Of The Dead') {
      cost = 14;
      // TODO
    } else if(power == 'Grave Touch') {
      cost = 10;
      // TODO
    } else if(power == 'Greater Arcane Resistance') {
      cost = 60;
      // TODO
    } else if(power == 'Greater Augmented Wild Shape') {
      notes = [
        'magicNotes.greaterAugmentedWildShapeFeature:+2 Str in Wild Shape',
        // Note: treat this as required, since the cost works out the same
        'validationNotes.augmentSummoningPowerFeatures:' +
          'Requires Augmented Wild Shape'
      ];
      rules.defineRule('magicNotes.augmentedWildShapeFeature',
        'magicNotes.greaterAugmentedWildShapeFeature', '+', '2'
      );
      cost = 20;
    } else if(power == 'Greater Dispelling Attack') {
      cost = 50;
      // TODO
    } else if(power == 'Greater Rage') {
      cost = 40;
      // TODO
    } else if(power == 'Greater Reaving Dispelling Attack') {
      cost = 70;
      // TODO
    } else if(power == 'Greater Wild Shape') {
      cost = 8;
      // TODO
    } else if(power == 'Guarded Stance') {
      cost = 10;
      // TODO
    } else if(power == 'Hail Of Arrows') {
      cost = 26;
      // TODO
    } else if(power == 'Hand Of The Apprentice') {
      cost = 20;
      // TODO
    } else if(power == 'Heavenly Fire') {
      cost = 20;
      // TODO
    } else if(power == 'Hellfire') {
      cost = 14;
      // TODO
    } else if(power == 'Huge Elemental Wild Shape') {
      cost = 14;
      // TODO
    } else if(power == 'Huge Plant Wild Shape') {
      cost = 14;
      // TODO
    } else if(power == 'Imbue Arrow') {
      cost = 45;
      // TODO
    } else if(power == 'Impromptu Sneak Attack') {
      cost = 8;
      // TODO
    } else if(power == 'Incorporeal Form') {
      cost = 48;
      // TODO
    } else if(power == 'Increased DR') {
      cost = 18;
      // TODO
    } else if(power == 'Inertial Armor') {
      cost = 10;
      // TODO
    } else if(power == 'Inspire Competence') {
      cost = 8;
      // TODO
    } else if(power == 'Inspire Courage') {
      cost = 4;
      // TODO
    } else if(power == 'Inspire Greatness') {
      cost = 12;
      // TODO
    } else if(power == 'Inspire Heroics') {
      cost = 16;
      // TODO
    } else if(power == 'Intimidating Glare') {
      cost = 10;
      // TODO
    } else if(power == 'It Was Meant To Be') {
      cost = 14;
      // TODO
    } else if(power == 'Ki Alacrity') {
      cost = 4;
      // TODO
    } else if(power == 'Ki Dodge') {
      cost = 6;
      // TODO
    } else if(power == 'Ki Flurry') {
      cost = 20;
      // TODO
    } else if(power == 'Ki Strike') {
      cost = 30;
      // TODO
    } else if(power == 'Knockback') {
      cost = 20;
      // TODO
    } else if(power == 'Know Direction') {
      cost = 20;
      // TODO
    } else if(power == 'Large Elemental Wild Shape') {
      cost = 12;
      // TODO
    } else if(power == 'Laughing Touch') {
      cost = 10;
      // TODO
    } else if(power == 'Lay On Hands') {
      cost = 20;
      // TODO
    } else if(power == 'Lesser Arcane Resistance') {
      cost = 40;
      // TODO
    } else if(power == "Lion's Charge") {
      cost = 20;
      // TODO
    } else if(power == 'Long Limbs') {
      cost = 60;
      // TODO
    } else if(power == 'Low-Light Vision') {
      cost = 10; // TODO Rage-related costs only 5
      // TODO
    } else if(power == 'Luck') {
      cost = 20;
      // TODO
    } else if(power == 'Mass Suggestion') {
      cost = 20;
      // TODO
    } else if(power == 'Medium Elemental Wild Shape') {
      cost = 10;
      // TODO
    } else if(power == 'Metamagic Adept') {
      cost = 8;
      // TODO
    } else if(power == 'Metamagic Mastery') {
      cost = 10;
      // TODO
    } else if(power == 'Mighty Rage') {
      cost = 40;
      // TODO
    } else if(power == 'Mighty Swing') {
      cost = 20;
      // TODO
    } else if(power == 'Mind Over Body (Power)') {
      cost = 0;
      // TODO
    } else if(power == 'Moment Of Clarity') {
      cost = 20;
      // TODO
    } else if(power == 'Natural Spell') {
      cost = 35;
      // TODO
    } else if(power == 'Night Vision') {
      cost = 15;
      // TODO
    } else if(power == 'Offensive Precognition') {
      cost = 20;
      // TODO
    } else if(power == 'Offensive Prescience') {
      cost = 20;
      // TODO
    } else if(power == 'One Of Us') {
      cost = 15;
      // TODO
    } else if(power == 'Opportunistic Strike') {
      cost = 15;
      // TODO
    } else if(power == 'Paralyzing Show') {
      cost = 28;
      // TODO
    } else if(power == 'Perfect Self') {
      cost = 68;
      // TODO
    } else if(power == 'Plant Wild Shape') {
      cost = 10;
      // TODO
    } else if(power == 'Power Over Shadow') {
      cost = 70;
      // TODO
    } else if(power == 'Phase Arrow') {
      cost = 17;
      // TODO
    } else if(power == 'Pierce The Fog Of War') {
      cost = 90;
      // TODO
    } else if(power == 'Powerful Blow') {
      cost = 10;
      // TODO
    } else if(power == 'Psionic Awareness') {
      cost = 0;
      // TODO
    } else if(power == 'Psychic Warrior') {
      cost = 0;
      // TODO
    } else if(power == 'Quick Reflexes') {
      cost = 10;
      // TODO
    } else if(power == 'Quivering Palm Power') {
      cost = 20;
      // TODO
    } else if(power == 'Rage') {
      cost = 16;
      // TODO
    } else if(power == 'Ranged Legerdemain') {
      cost = 30;
      // TODO
    } else if(power == 'Reaving Dispelling Attack') {
      cost = 70;
      // TODO
    } else if(power == 'Regeneration') {
      cost = 120;
      // TODO
    } else if(power == 'Renewed Vigor') {
      cost = 10;
      // TODO
    } else if(power == 'Rolling Dodge') {
      cost = 10;
      // TODO
    } else if(power == 'Roused Anger') {
      cost = 20;
      // TODO
    } else if(power == 'Scent') {
      cost = 30;
      // TODO
    } else if(power == 'School Defense') {
      cost = 10;
      // TODO
    } else if(power == 'Seeker Arrow') {
      cost = 12;
      // TODO
    } else if(power == 'Selective Channeling') {
      cost = 0;
      // TODO
    } else if(power == 'Sickening Critical') {
      notes = [
        'combatNotes.sickeningingCriticalFeature:' +
          'Foe sickened 1 min after critical hit',
        'validationNotes.sickeningingCriticalPowerFeatures:' +
          'Requires Improved Critical >= 6'
      ];
      cost = 40;
    } else if(power == 'Slippery Mind') {
      cost = 35;
      // TODO
    } else if(power == 'Slow Fall') {
      cost = 10;
      // TODO
    } else if(power == 'Small Elemental Wild Shape') {
      cost = 8;
      // TODO
    } else if(power == 'Smite Evil') {
      cost = 14;
      // TODO
    } else if(power == 'Sorcery') {
      cost = 10;
      // TODO
    } else if(power == 'Soothing Performance') {
      cost = 20;
      // TODO
    } else if(power == 'Song Of Freedom') {
      cost = 20;
      // TODO
    } else if(power == 'Soul Of The Fey') {
      cost = 90;
      // TODO
    } else if(power == 'Soulknife') {
      cost = 30;
      // TODO
    } else if(power == 'Speak With Animals') {
      cost = 20;
      // TODO
    } else if(power == 'Spectral Tendril') {
      cost = 30;
      // TODO
    } else if(power == 'Spell Critical') {
      notes = [
        'combatNotes.spellCriticalFeature:' +
          'Cast spell on foe as free action after critical hit',
        'validationNotes.spellCriticalPowerFeatures:' +
          'Requires Improved Critical >= 11'
      ];
      cost = 40;
    } else if(power == 'Spell Immunity') {
      cost = 10;
      // TODO
    } else if(power == 'Spell Mastery') {
      cost = 5;
      // TODO
    } else if(power == 'Spell Penetration') {
      cost = 40;
      // TODO
    } else if(power == 'Spell Repertoire (Bard)') {
      cost = 0;
      // TODO
    } else if(power == 'Spell Repertoire (Divine)') {
      cost = 0;
      // TODO
    } else if(power == 'Spell Repertoire (Druidical)') {
      cost = 0;
      // TODO
    } else if(power == 'Spell Repertoire (Sorcerer)') {
      cost = 0;
      // TODO
    } else if(power == 'Spell Repertoire (Wizard)') {
      cost = 0;
      // TODO
    } else if(power == 'Spell Resistance') {
      cost = 100;
      // TODO
    } else if(power == 'Spell Synthesis') {
      cost = 26;
      // TODO
    } else if(power == 'Spell Theurgy') {
      cost = 0;
      // TODO
    } else if(power == 'Spellcasting (Arcane)') {
      cost = 0;
      // TODO
    } else if(power == 'Spellcasting (Divine)') {
      cost = 0;
      // TODO
    } else if(power == 'Spellcasting (Druidical)') {
      cost = 0;
      // TODO
    } else if(power == 'Spontaneous Casting') {
      cost = 20;
      // TODO
    } else if(power == 'Staggering Critical') {
      notes = [
        'combatNotes.staggeringCriticalFeature:' +
          'Foe staggered 1d4+1 rd (DC %V Fort 1 rd) after critical hit',
        'validationNotes.staggeringCriticalPowerFeatures:' +
          'Requires Improved Critical >= 6'
      ];
      cost = 35;
      rules.defineRule('combatNotes.staggeringingCriticalFeature',
        'baseAttack', '=', 'source + 10'
      );
      // TODO
    } else if(power == 'Stength Surge') {
      cost = 10;
      // TODO
    } else if(power == 'Stunning Critical') {
      notes = [
        'combatNotes.stunningCriticalFeature:' +
          'Foe stunned 1d4+1 rd (DC %V Fort 1 rd) after critical hit',
        'validationNotes.stunningCriticalPowerFeatures:' +
          'Requires Improved Critical >= 10'
      ];
      cost = 30;
      rules.defineRule('combatNotes.stunningCriticalFeature',
        'baseAttack', '=', 'source + 10'
      );
    } else if(power == 'Suggestion') {
      cost = 12;
      // TODO
    } else if(power == 'Superior Wild Shape') {
      cost = 10;
      // TODO
    } else if(power == 'Surprise Accuracy') {
      cost = 10;
      // TODO
    } else if(power == 'Surprise Spells') {
      cost = 60;
      // TODO
    } else if(power == 'Swift Foot') {
      cost = 5;
      // TODO
    } else if(power == 'Tenacious Magic') {
      cost = 15;
      // TODO
    } else if(power == 'Terrifying Howl') {
      cost = 20;
      // TODO
    } else if(power == 'Timeless Body') {
      cost = 90;
      // TODO
    } else if(power == 'Tireless Rage') {
      cost = 30;
      // TODO
    } else if(power == 'Tiring Critical') {
      notes = [
        'combatNotes.tiringCriticalFeature:Foe fatigued after critical hit',
        'validationNotes.tiringCriticalPowerFeatures:' +
          'Requires Improved Critical >= 6'
      ];
      cost = 50;
    } else if(power == 'Touch Of Death') {
      cost = 10;
      // TODO
    } else if(power == 'Touch Of Destiny') {
      cost = 20;
      // TODO
    } else if(power == 'Trackless Step') {
      cost = 20;
      // TODO
    } else if(power == 'Trollborn') {
      cost = 70;
      // TODO
    } else if(power == 'Turn Outsider') {
      cost = 40;
      // TODO
    } else if(power == 'Turn Elemental') {
      cost = 40;
      // TODO
    } else if(power == 'Unexpected Strike') {
      cost = 15;
      // TODO
    } else if(power == 'Unusual Anatomy') {
      cost = 30;
      // TODO
    } else if(power == 'Wand Expertise') {
      cost = 50;
      // TODO
    } else if(power == 'Wild Shape') {
      cost = 6;
      // TODO
    } else if(power == 'Wild Surge') {
      cost = 0;
      // TODO
    } else if(power == 'Wings') {
      cost = 30;
      // TODO
    } else if(power == 'Wings Of Heaven') {
      cost = 14;
      // TODO
    } else if(power == 'Within Reach') {
      cost = 22;
      // TODO
    } else if(power == 'Wizardry') {
      cost = 0;
      // TODO
    } else if(power == 'Woodland Stride') {
      cost = 0;
      // TODO
    } else
      continue;

    rules.defineChoice('powers', power);
    rules.defineRule('features.' + power, 'powers.' + power, '=', null);
    if(notes != null)
      rules.defineNote(notes);
    rules.defineRule('allocatedExp.Powers', 'powers.' + power, '+=', cost);

  }

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
    var max = Math.floor(1000 * Math.pow(1.1, level + 1) - 1001);
    var min = Math.floor(1000 * Math.pow(1.1, level) - 1000);
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
      skill = !attributes['skills.HTH Combat'] ? 'skills.HTH Combat' :
              !attributes['skills.Fire Combat'] ? 'skills.Fire Combat' :
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
    SRD35.randomizeOneAttribute.apply(this, [attributes, attribute]);
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
    rules.defineRule('allocatedExp.Skills',
      'skills.' + skill, '+=', 'source * (source + 1) + 3'
    );

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
    '    Renamed Sneak Attack, Bleeding Attack to Bleeding Sneak Attack\n' +
    '  </li>\n' +
    '  <li>\n' +
    '    Renamed Sneak Attack, Cripping Strike to Crippling Sneak Attack\n' +
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
