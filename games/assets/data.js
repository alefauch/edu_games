// Données des pays : code ISO (pour le drapeau), nom, capitale, continent, importance (1 à 3).
// L'importance sert à faire apparaître plus souvent les pays les plus connus.
(function () {
  const RAW = [
    // ---------- Europe (sans le Caucase) ----------
    ['fr', 'France', 'Paris', 'Europe', 3],
    ['de', 'Allemagne', 'Berlin', 'Europe', 3],
    ['es', 'Espagne', 'Madrid', 'Europe', 3],
    ['it', 'Italie', 'Rome', 'Europe', 3],
    ['gb', 'Royaume-Uni', 'Londres', 'Europe', 3],
    ['pt', 'Portugal', 'Lisbonne', 'Europe', 3],
    ['be', 'Belgique', 'Bruxelles', 'Europe', 3],
    ['nl', 'Pays-Bas', 'Amsterdam', 'Europe', 3],
    ['ch', 'Suisse', 'Berne', 'Europe', 3],
    ['at', 'Autriche', 'Vienne', 'Europe', 3],
    ['gr', 'Grèce', 'Athènes', 'Europe', 3],
    ['ru', 'Russie', 'Moscou', 'Europe', 3],
    ['ie', 'Irlande', 'Dublin', 'Europe', 2],
    ['lu', 'Luxembourg', 'Luxembourg', 'Europe', 2],
    ['dk', 'Danemark', 'Copenhague', 'Europe', 2],
    ['no', 'Norvège', 'Oslo', 'Europe', 2],
    ['se', 'Suède', 'Stockholm', 'Europe', 2],
    ['fi', 'Finlande', 'Helsinki', 'Europe', 2],
    ['is', 'Islande', 'Reykjavik', 'Europe', 2],
    ['pl', 'Pologne', 'Varsovie', 'Europe', 2],
    ['cz', 'Tchéquie', 'Prague', 'Europe', 2],
    ['hu', 'Hongrie', 'Budapest', 'Europe', 2],
    ['ro', 'Roumanie', 'Bucarest', 'Europe', 2],
    ['hr', 'Croatie', 'Zagreb', 'Europe', 2],
    ['ua', 'Ukraine', 'Kiev', 'Europe', 2],
    ['tr', 'Turquie', 'Ankara', 'Europe', 2],
    ['mc', 'Monaco', 'Monaco', 'Europe', 2],
    ['sk', 'Slovaquie', 'Bratislava', 'Europe', 1],
    ['bg', 'Bulgarie', 'Sofia', 'Europe', 1],
    ['si', 'Slovénie', 'Ljubljana', 'Europe', 1],
    ['rs', 'Serbie', 'Belgrade', 'Europe', 1],
    ['ba', 'Bosnie-Herzégovine', 'Sarajevo', 'Europe', 1],
    ['me', 'Monténégro', 'Podgorica', 'Europe', 1],
    ['al', 'Albanie', 'Tirana', 'Europe', 1],
    ['mk', 'Macédoine du Nord', 'Skopje', 'Europe', 1],
    ['by', 'Biélorussie', 'Minsk', 'Europe', 1],
    ['md', 'Moldavie', 'Chisinau', 'Europe', 1],
    ['lt', 'Lituanie', 'Vilnius', 'Europe', 1],
    ['lv', 'Lettonie', 'Riga', 'Europe', 1],
    ['ee', 'Estonie', 'Tallinn', 'Europe', 1],
    ['cy', 'Chypre', 'Nicosie', 'Europe', 1],
    ['mt', 'Malte', 'La Valette', 'Europe', 1],
    ['ad', 'Andorre', 'Andorre-la-Vieille', 'Europe', 1],
    ['li', 'Liechtenstein', 'Vaduz', 'Europe', 1],
    ['sm', 'Saint-Marin', 'Saint-Marin', 'Europe', 1],
    ['va', 'Vatican', 'Vatican', 'Europe', 1],

    // ---------- Asie ----------
    ['cn', 'Chine', 'Pékin', 'Asie', 3],
    ['jp', 'Japon', 'Tokyo', 'Asie', 3],
    ['in', 'Inde', 'New Delhi', 'Asie', 3],
    ['kr', 'Corée du Sud', 'Séoul', 'Asie', 2],
    ['th', 'Thaïlande', 'Bangkok', 'Asie', 2],
    ['vn', 'Vietnam', 'Hanoï', 'Asie', 2],
    ['id', 'Indonésie', 'Jakarta', 'Asie', 2],
    ['ph', 'Philippines', 'Manille', 'Asie', 2],
    ['ir', 'Iran', 'Téhéran', 'Asie', 2],
    ['sa', 'Arabie saoudite', 'Riyad', 'Asie', 2],
    ['kp', 'Corée du Nord', 'Pyongyang', 'Asie', 1],
    ['my', 'Malaisie', 'Kuala Lumpur', 'Asie', 1],
    ['sg', 'Singapour', 'Singapour', 'Asie', 1],
    ['pk', 'Pakistan', 'Islamabad', 'Asie', 1],
    ['iq', 'Irak', 'Bagdad', 'Asie', 1],
    ['lb', 'Liban', 'Beyrouth', 'Asie', 1],
    ['sy', 'Syrie', 'Damas', 'Asie', 1],
    ['jo', 'Jordanie', 'Amman', 'Asie', 1],
    ['ae', 'Émirats arabes unis', 'Abou Dabi', 'Asie', 1],
    ['qa', 'Qatar', 'Doha', 'Asie', 1],
    ['af', 'Afghanistan', 'Kaboul', 'Asie', 1],
    ['np', 'Népal', 'Katmandou', 'Asie', 1],
    ['bd', 'Bangladesh', 'Dacca', 'Asie', 1],
    ['mn', 'Mongolie', 'Oulan-Bator', 'Asie', 1],
    ['kz', 'Kazakhstan', 'Astana', 'Asie', 1],
    ['kh', 'Cambodge', 'Phnom Penh', 'Asie', 1],
    ['la', 'Laos', 'Vientiane', 'Asie', 1],

    // ---------- Amérique ----------
    ['us', 'États-Unis', 'Washington', 'Amérique', 3],
    ['ca', 'Canada', 'Ottawa', 'Amérique', 3],
    ['mx', 'Mexique', 'Mexico', 'Amérique', 3],
    ['br', 'Brésil', 'Brasilia', 'Amérique', 3],
    ['ar', 'Argentine', 'Buenos Aires', 'Amérique', 3],
    ['cu', 'Cuba', 'La Havane', 'Amérique', 2],
    ['co', 'Colombie', 'Bogota', 'Amérique', 2],
    ['pe', 'Pérou', 'Lima', 'Amérique', 2],
    ['cl', 'Chili', 'Santiago', 'Amérique', 2],
    ['jm', 'Jamaïque', 'Kingston', 'Amérique', 1],
    ['ht', 'Haïti', 'Port-au-Prince', 'Amérique', 1],
    ['do', 'République dominicaine', 'Saint-Domingue', 'Amérique', 1],
    ['gt', 'Guatemala', 'Guatemala', 'Amérique', 1],
    ['cr', 'Costa Rica', 'San José', 'Amérique', 1],
    ['pa', 'Panama', 'Panama', 'Amérique', 1],
    ['ve', 'Venezuela', 'Caracas', 'Amérique', 1],
    ['ec', 'Équateur', 'Quito', 'Amérique', 1],
    ['uy', 'Uruguay', 'Montevideo', 'Amérique', 1],
    ['py', 'Paraguay', 'Asuncion', 'Amérique', 1],

    // ---------- Afrique (sans l'Afrique centrale) ----------
    ['ma', 'Maroc', 'Rabat', 'Afrique', 3],
    ['dz', 'Algérie', 'Alger', 'Afrique', 3],
    ['tn', 'Tunisie', 'Tunis', 'Afrique', 3],
    ['eg', 'Égypte', 'Le Caire', 'Afrique', 3],
    ['sn', 'Sénégal', 'Dakar', 'Afrique', 2],
    ['ke', 'Kenya', 'Nairobi', 'Afrique', 2],
    ['za', 'Afrique du Sud', 'Pretoria', 'Afrique', 2],
    ['mg', 'Madagascar', 'Antananarivo', 'Afrique', 2],
    ['ly', 'Libye', 'Tripoli', 'Afrique', 1],
    ['ml', 'Mali', 'Bamako', 'Afrique', 1],
    ['mr', 'Mauritanie', 'Nouakchott', 'Afrique', 1],
    ['ne', 'Niger', 'Niamey', 'Afrique', 1],
    ['bf', 'Burkina Faso', 'Ouagadougou', 'Afrique', 1],
    ['gh', 'Ghana', 'Accra', 'Afrique', 1],
    ['ng', 'Nigeria', 'Abuja', 'Afrique', 1],
    ['et', 'Éthiopie', 'Addis-Abeba', 'Afrique', 1],
    ['so', 'Somalie', 'Mogadiscio', 'Afrique', 1],
    ['sd', 'Soudan', 'Khartoum', 'Afrique', 1],
    ['ao', 'Angola', 'Luanda', 'Afrique', 1],
    ['zw', 'Zimbabwe', 'Harare', 'Afrique', 1],
    ['mz', 'Mozambique', 'Maputo', 'Afrique', 1],
    ['ug', 'Ouganda', 'Kampala', 'Afrique', 1],
    ['na', 'Namibie', 'Windhoek', 'Afrique', 1],

    // ---------- Océanie (uniquement pour les drapeaux) ----------
    ['au', 'Australie', 'Canberra', 'Océanie', 3],
    ['nz', 'Nouvelle-Zélande', 'Wellington', 'Océanie', 2],
  ];

  const COUNTRIES = RAW.map(([code, name, capital, region, weight]) => ({ code, name, capital, region, weight }));
  const BY_CODE = Object.fromEntries(COUNTRIES.map((c) => [c.code, c]));

  // Continents proposés dans les jeux de capitales.
  const REGIONS = [
    { key: 'Europe', emoji: '🏰' },
    { key: 'Asie', emoji: '🐼' },
    { key: 'Amérique', emoji: '🗽' },
    { key: 'Afrique', emoji: '🦁' },
  ];

  // Continents proposés dans les jeux de drapeaux (l'Océanie en plus).
  const FLAG_REGIONS = REGIONS.concat({ key: 'Océanie', emoji: '🦘' });

  // Drapeaux : toute l'Europe + les grands pays du monde.
  const MAJOR_FLAGS = [
    'us', 'ca', 'mx', 'br', 'ar', 'cl', 'co', 'pe', 'cu', 'jm',
    'cn', 'jp', 'in', 'kr', 'th', 'vn', 'id', 'ph', 'sa', 'ae', 'ir',
    'au', 'nz',
    'za', 'eg', 'ma', 'dz', 'tn', 'sn', 'ng', 'ke',
  ];

  // Drapeaux presque identiques : ne jamais les proposer ensemble.
  const LOOKALIKES = [['mc', 'id']];

  // Autres façons d'écrire un pays (mode difficile du jeu des drapeaux).
  const ALIASES = {
    cz: ['République tchèque'],
    us: ['USA', 'Etats-Unis d’Amérique'],
    gb: ['Grande-Bretagne', 'Angleterre'],
    nl: ['Hollande'],
    va: ['Cité du Vatican'],
    ae: ['Émirats'],
    by: ['Bélarus'],
    mk: ['Macédoine'],
  };

  window.Data = {
    COUNTRIES,
    REGIONS,
    FLAG_REGIONS,
    ALIASES,
    byCode: (code) => BY_CODE[code],
    capitalPool: (regions) => COUNTRIES.filter((c) => regions.includes(c.region)),
    flagPool: (regions) => COUNTRIES.filter((c) => (c.region === 'Europe' || MAJOR_FLAGS.includes(c.code)) &&
      (!regions || regions.includes(c.region))),
    flagSrc: (c) => 'flags/' + c.code + '.svg',
    areLookalikes: (a, b) => LOOKALIKES.some((p) => p.includes(a.code) && p.includes(b.code)),
    regionEmoji: (r) => (FLAG_REGIONS.find((x) => x.key === r) || { emoji: '🌏' }).emoji,
  };
})();
