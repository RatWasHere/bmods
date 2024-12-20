/*
  Get Game Server Info mod by candiedapple
  Licensed under MIT License

  Gets Game server info for help you can ping me on BMD Discord server.
*/

const games = {
  a2oa: "ARMA 2: Operation Arrowhead",
  aaa: "ARMA: Armed Assault",
  aapg: "America's Army: Proving Grounds",
  actionsource: "Action: Source",
  acwa: "ARMA: Cold War Assault",
  ahl: "Action Half-Life",
  alienarena: "Alien Arena",
  alienswarm: "Alien Swarm",
  americasarmy: "America's Army",
  americasarmy2: "America's Army 2",
  americasarmy3: "America's Army 3",
  aoc: "Age of Chivalry",
  aoe2: "Age of Empires 2",
  aosc: "Ace of Spades Classic",
  arma2: "ARMA 2",
  arma3: "ARMA 3",
  armagetronadvanced: "Armagetron Advanced",
  armareforger: "ARMA: Reforger",
  armaresistance: "ARMA: Resistance",
  asa: "Ark: Survival Ascended",
  ase: "Ark: Survival Evolved",
  asr08: "Arca Sim Racing '08",
  assettocorsa: "Assetto Corsa",
  atlas: "Atlas",
  avorion: "Avorion",
  avp2: "Aliens versus Predator 2",
  avp2010: "Aliens vs. Predator 2010",
  baldursgate: "Baldur's Gate",
  ballisticoverkill: "Ballistic Overkill",
  barotrauma: "Barotrauma",
  bas: "Build and Shoot",
  basedefense: "Base Defense",
  battalion1944: "Battalion 1944",
  battlefield1942: "Battlefield 1942",
  battlefield2: "Battlefield 2",
  battlefield2142: "Battlefield 2142",
  battlefield3: "Battlefield 3",
  battlefield4: "Battlefield 4",
  battlefieldhardline: "Battlefield Hardline",
  battlefieldvietnam: "Battlefield Vietnam",
  bbc2: "Battlefield: Bad Company 2",
  beammp: "BeamMP (2021)",
  blackmesa: "Black Mesa",
  bladesymphony: "Blade Symphony",
  brainbread: "BrainBread",
  brainbread2: "BrainBread 2",
  breach: "Breach",
  breed: "Breed",
  brink: "Brink",
  c3db: "Commandos 3: Destination Berlin",
  cacr: "Command and Conquer: Renegade",
  chaser: "Chaser",
  chrome: "Chrome",
  cmw: "Chivalry: Medieval Warfare",
  cod: "Call of Duty",
  cod2: "Call of Duty 2",
  cod3: "Call of Duty 3",
  cod4mw: "Call of Duty 4: Modern Warfare",
  codbo3: "Call of Duty: Black Ops 3",
  codenamecure: "Codename CURE",
  codenameeagle: "Codename Eagle",
  codmw2: "Call of Duty: Modern Warfare 2",
  codmw3: "Call of Duty: Modern Warfare 3",
  coduo: "Call of Duty: United Offensive",
  codwaw: "Call of Duty: World at War",
  coj: "Call of Juarez",
  colonysurvival: "Colony Survival",
  conanexiles: "Conan Exiles",
  contagion: "Contagion",
  contractjack: "Contract J.A.C.K.",
  corekeeper: "Core Keeper",
  counterstrike15: "Counter-Strike 1.5",
  counterstrike16: "Counter-Strike 1.6",
  counterstrike2: "Counter-Strike 2",
  crce: "Cross Racing Championship Extreme",
  creativerse: "Creativerse",
  crysis: "Crysis",
  crysis2: "Crysis 2",
  crysiswars: "Crysis Wars",
  cs2d: "CS2D",
  cscz: "Counter-Strike: Condition Zero",
  csgo: "Counter-Strike: Global Offensive",
  css: "Counter-Strike: Source",
  dab: "Double Action: Boogaloo",
  daikatana: "Daikatana",
  dal: "Dark and Light",
  dayofdragons: "Day of Dragons",
  dayz: "DayZ",
  dayzmod: "DayZ Mod",
  ddd: "Dino D-Day",
  ddpt: "Deadly Dozen: Pacific Theater",
  deathmatchclassic: "Deathmatch Classic",
  deerhunter2005: "Deer Hunter 2005",
  descent3: "Descent 3",
  deusex: "Deus Ex",
  devastation: "Devastation",
  dhe4445: "Darkest Hour: Europe '44-'45",
  discord: "Discord",
  dmomam: "Dark Messiah of Might and Magic",
  dod: "Day of Defeat",
  dnf2001: "Duke Nukem Forever 2001",
  dods: "Day of Defeat: Source",
  doi: "Day of Infamy",
  doom3: "Doom 3",
  dootf: "Drakan: Order of the Flame",
  dota2: "Dota 2",
  dow: "Days of War",
  dst: "Don't Starve Together",
  dtr2: "Dirt Track Racing 2",
  dystopia: "Dystopia",
  eco: "Eco",
  egs: "Empyrion - Galactic Survival",
  eldewrito: "Halo Online (ElDewrito)",
  empiresmod: "Empires Mod",
  enshrouded: "Enshrouded",
  etqw: "Enemy Territory: Quake Wars",
  ets2: "Euro Truck Simulator 2",
  f1c9902: "F1 Challenge '99-'02",
  factorio: "Factorio",
  farcry: "Far Cry",
  farcry2: "Far Cry 2",
  farmingsimulator19: "Farming Simulator 19",
  farmingsimulator22: "Farming Simulator 22",
  fear: "F.E.A.R.",
  ffow: "Frontlines: Fuel of War",
  fof: "Fistful of Frags",
  formulaone2002: "Formula One 2002",
  fortressforever: "Fortress Forever",
  garrysmod: "Garry's Mod",
  gck: "Giants: Citizen Kabuto",
  geneshift: "Geneshift",
  globaloperations: "Global Operations",
  goldeneyesource: "GoldenEye: Source",
  groundbreach: "Ground Breach",
  gta5f: "Grand Theft Auto V - FiveM",
  gtasam: "Grand Theft Auto: San Andreas Multiplayer",
  gtasamta: "Grand Theft Auto: San Andreas - Multi Theft Auto",
  gtasao: "Grand Theft Auto: San Andreas OpenMP",
  gtavcmta: "Grand Theft Auto: Vice City - Multi Theft Auto",
  gunmanchronicles: "Gunman Chronicles",
  gus: "Gore: Ultimate Soldier",
  halo: "Halo",
  halo2: "Halo 2",
  heretic2: "Heretic II",
  hexen2: "Hexen II",
  hiddendangerous2: "Hidden & Dangerous 2",
  hl2d: "Half-Life 2: Deathmatch",
  hld: "Half-Life Deathmatch",
  hlds: "Half-Life Deathmatch: Source",
  hll: "Hell Let Loose",
  hlof: "Half-Life: Opposing Force",
  homefront: "Homefront",
  homeworld2: "Homeworld 2",
  hurtworld: "Hurtworld",
  i2cs: "IGI 2: Covert Strike",
  il2sturmovik: "IL-2 Sturmovik",
  imic: "Insurgency: Modern Infantry Combat",
  insurgency: "Insurgency",
  insurgencysandstorm: "Insurgency: Sandstorm",
  ironstorm: "Iron Storm",
  jb007n: "James Bond 007: Nightfire",
  jc2m: "Just Cause 2 - Multiplayer",
  jc3m: "Just Cause 3 - Multiplayer",
  killingfloor: "Killing Floor",
  killingfloor2: "Killing Floor 2",
  kloc: "Kingpin: Life of Crime",
  kpctnc: "Kiss: Psycho Circus: The Nightmare Child",
  kreedzclimbing: "Kreedz Climbing",
  kspd: "Kerbal Space Program - DMP",
  l4d: "Left 4 Dead",
  l4d2: "Left 4 Dead 2",
  m2m: "Mafia II - Multiplayer",
  m2o: "Mafia II - Online",
  mbe: "Minecraft: Bedrock Edition",
  medievalengineers: "Medieval Engineers",
  mgm: "Mumble - GT Murmur",
  minecraft: "Minecraft",
  mnc: "Monday Night Combat",
  moh: "Medal of Honor",
  moha: "Medal of Honor: Airborne",
  mohaa: "Medal of Honor: Allied Assault",
  mohaab: "Medal of Honor: Allied Assault Breakthrough",
  mohaas: "Medal of Honor: Allied Assault Spearhead",
  mohpa: "Medal of Honor: Pacific Assault",
  mohw: "Medal of Honor: Warfighter",
  mordhau: "Mordhau",
  mumble: "Mumble",
  mutantfactions: "Mutant Factions",
  nab: "Nerf Arena Blast",
  nascarthunder2004: "NASCAR Thunder 2004",
  naturalselection: "Natural Selection",
  naturalselection2: "Natural Selection 2",
  netpanzer: "netPanzer",
  neverwinternights: "Neverwinter Nights",
  neverwinternights2: "Neverwinter Nights 2",
  nexuiz: "Nexuiz",
  nfshp2: "Need for Speed: Hot Pursuit 2",
  nitrofamily: "Nitro Family",
  nmrih: "No More Room in Hell",
  nolf2asihw: "No One Lives Forever 2: A Spy in H.A.R.M.'s Way",
  nucleardawn: "Nuclear Dawn",
  ofcwc: "Operation Flashpoint: Cold War Crisis",
  ofr: "Operation Flashpoint: Resistance",
  ohd: "Operation: Harsh Doorstop",
  onset: "Onset",
  openarena: "OpenArena",
  openttd: "OpenTTD",
  painkiller: "Painkiller",
  palworld: "Palworld",
  pce: "Primal Carnage: Extinction",
  pixark: "PixARK",
  postal2: "Postal 2",
  postscriptum: "Post Scriptum",
  prb2: "Project Reality: Battlefield 2",
  prey: "Prey",
  projectcars: "Project Cars",
  projectcars2: "Project Cars 2",
  projectzomboid: "Project Zomboid",
  pvak2: "Pirates, Vikings, and Knights II",
  q3a: "Quake 3: Arena",
  quake: "Quake",
  quake2: "Quake 2",
  quake4: "Quake 4",
  quakelive: "Quake Live",
  rainbowsix: "Rainbow Six",
  rallisportchallenge: "RalliSport Challenge",
  rallymasters: "Rally Masters",
  rdkf: "Rag Doll Kung Fu",
  rdr2r: "Red Dead Redemption 2 - RedM",
  redline: "Redline",
  redorchestra: "Red Orchestra",
  redorchestra2: "Red Orchestra 2",
  rfactor: "rFactor",
  ricochet: "Ricochet",
  risingworld: "Rising World",
  ron: "Rise of Nations",
  roo4145: "Red Orchestra: Ostfront 41-45",
  ror2: "Risk of Rain 2",
  rs2rs: "Rainbow Six 2: Rogue Spear",
  rs2v: "Rising Storm 2: Vietnam",
  rs3rs: "Rainbow Six 3: Raven Shield",
  rtcw: "Return to Castle Wolfenstein",
  rune: "Rune",
  rust: "Rust",
  s2ats: "Savage 2: A Tortured Soul",
  sdtd: "7 Days to Die",
  serioussam: "Serious Sam",
  serioussam2: "Serious Sam 2",
  shatteredhorizon: "Shattered Horizon",
  shogo: "Shogo",
  shootmania: "Shootmania",
  sin: "SiN",
  sinepisodes: "SiN Episodes",
  sof: "Soldier of Fortune",
  sof2: "Soldier of Fortune 2",
  soldat: "Soldat",
  sotf: "Sons Of The Forest",
  spaceengineers: "Space Engineers",
  squad: "Squad",
  stalker: "S.T.A.L.K.E.R.",
  starbound: "Starbound",
  starmade: "StarMade",
  starsiege: "Starsiege",
  stbc: "Star Trek: Bridge Commander",
  stn: "Survive the Nights",
  stvef: "Star Trek: Voyager - Elite Force",
  stvef2: "Star Trek: Voyager - Elite Force 2",
  suicidesurvival: "Suicide Survival",
  svencoop: "Sven Coop",
  swat4: "SWAT 4",
  swb: "Star Wars: Battlefront",
  swb2: "Star Wars: Battlefront 2",
  swjk2jo: "Star Wars Jedi Knight II: Jedi Outcast",
  swjkja: "Star Wars Jedi Knight: Jedi Academy",
  swrc: "Star Wars: Republic Commando",
  synergy: "Synergy",
  t1s: "Tribes 1: Starsiege",
  tacticalops: "Tactical Ops",
  tcgraw: "Tom Clancy's Ghost Recon Advanced Warfighter",
  tcgraw2: "Tom Clancy's Ghost Recon Advanced Warfighter 2",
  teamfactor: "Team Factor",
  teamfortress2: "Team Fortress 2",
  teamspeak2: "Teamspeak 2",
  teamspeak3: "Teamspeak 3",
  terminus: "Terminus",
  terrariatshock: "Terraria - TShock",
  tfc: "Team Fortress Classic",
  theforest: "The Forest",
  theforrest: "The Forrest",
  thefront: "The Front",
  thehidden: "The Hidden",
  theisle: "The Isle",
  tie: "The Isle Evrima",
  theship: "The Ship",
  thespecialists: "The Specialists",
  thps3: "Tony Hawk's Pro Skater 3",
  thps4: "Tony Hawk's Pro Skater 4",
  thu2: "Tony Hawk's Underground 2",
  toh: "Take On Helicopters",
  tonolf: "The Operative: No One Lives Forever",
  towerunite: "Tower Unite",
  trackmania2: "Trackmania 2",
  trackmaniaforever: "Trackmania Forever",
  tremulous: "Tremulous",
  tribesvengeance: "Tribes: Vengeance",
  tron20: "Tron 2.0",
  turok2: "Turok 2",
  u2tax: "Unreal 2: The Awakening - XMP",
  universalcombat: "Universal Combat",
  unreal: "Unreal",
  unrealtournament: "Unreal Tournament",
  unrealtournament2003: "Unreal Tournament 2003",
  unrealtournament2004: "Unreal Tournament 2004",
  unrealtournament3: "Unreal Tournament 3",
  unturned: "unturned",
  urbanterror: "Urban Terror",
  v8sc: "V8 Supercar Challenge",
  valheim: "Valheim",
  vampireslayer: "Vampire Slayer",
  vcm: "Vice City Multiplayer",
  ventrilo: "Ventrilo",
  vietcong: "Vietcong",
  vietcong2: "Vietcong 2",
  vrising: "V Rising",
  warfork: "Warfork",
  warsow: "Warsow",
  wet: "Wolfenstein: Enemy Territory",
  wolfenstein: "Wolfenstein",
  wot: "Wheel of Time",
  wurmunlimited: "Wurm Unlimited",
  xonotic: "Xonotic",
  xpandrally: "Xpand Rally",
  zombiemaster: "Zombie Master",
  zps: "Zombie Panic: Source",
};

function swap(json) {
  var ret = {};
  for (var key in json) {
    ret[json[key]] = key;
  }
  return ret;
}

module.exports = {
  modules: ["gamedig"],
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
  },
  data: {
    name: "Get Game Server Info",
  },
  category: "Game",
  UI: [
    {
      element: "dropdown",
      storeAs: "gametype",
      forcePush: true,
      name: "Game",
      choices: Object.values(games).map((name) => {
        return { name: name };
      }),
    },
    {
      element: "input",
      storeAs: "host",
      name: "Host",
      placeholder: "Your game ip",
    },
    {
      element: "input",
      storeAs: "port",
      name: "Port",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "servername",
      name: "Store Server Name as",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "servermap",
      name: "Store Server Map as",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "password",
      name: "Store Is Password Required as",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "numplayers",
      name: "Store Number of players connected as",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "maxplayers",
      name: "Store Maximum number of players can connect as",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "raw",
      name: "Store all information received from the server in a disorganized format as (object)",
    },
    "-",
    {
      element: "input",
      storeAs: "timeoutDur",
      name: "Timeout After x Seconds",
      placeholder: "2",
    },
    {
      element: "largeInput",
      storeAs: "additionalOptions",
      name: "Additional Options For Query Calls",
      placeholder: "Optional - JSON Only"
    }
  ],

  async run(values, interaction, client, bridge){
    const timeout = bridge.transf(values.timeoutDur) ? Number(bridge.transf(values.timeoutDur))*1000 : 10000

    try{
      await Promise.race([
        new Promise((resolve, reject) => {

          const { GameDig } = require("gamedig");

          GameDig.query({
            type: swap(games)[values.gametype],
            host: bridge.transf(values.host),
            port: bridge.transf(values.port),
            givenPortOnly: true, // the library will attempt multiple ports in order to ensure success, to avoid this pass this option
            ...(JSON.parse(bridge.transf(values.additionalOptions) || "{}"))
          })
            .then((state) => {
              bridge.store(values.servername, state.name);
              bridge.store(values.servermap, state.map);
              bridge.store(values.password, state.password);
              bridge.store(values.numplayers, state.numplayers);
              bridge.store(values.maxplayers, state.maxplayers);
              bridge.store(values.raw, state.raw);
              resolve(); // Resolve the promise once all operations are completed
            })
            .catch((error) => {
              bridge.store(values.servername, error);
              bridge.store(values.servermap, error);
              bridge.store(values.password, error);
              bridge.store(values.numplayers, error);
              bridge.store(values.maxplayers, error);
              bridge.store(values.raw, error);
              reject(error); // Reject the promise if there is an error
            });
        }),

        new Promise((_, reject) => setTimeout(()=> reject(new Error(`Request Took Too Long!`)), timeout))
      ])
    } catch(error){
      bridge.store(values.servername, error);
      bridge.store(values.servermap, error);
      bridge.store(values.password, error);
      bridge.store(values.numplayers, error);
      bridge.store(values.maxplayers, error);
      bridge.store(values.raw, error);
    }
  }
};
