/**
 * Catálogo de coleções visuais, frequências Solfeggio e códigos de intenção.
 */

export const COLLECTIONS = {
  mandala: {
    id: 'mandala',
    label: 'Mandala',
    subtitle: 'Harmonia & Centro',
    defaultFreq: 639,
    folder: './images/',
    files: [
      'mandala.webp', 'mandala1.webp', 'mandala2.webp', 'mandala3.webp', 'mandala4.webp',
      'mandala5.webp', 'mandala6.webp', 'mandala7.webp', 'mandala8.webp', 'mandala9.webp',
      'mandala10.webp', 'mandala11.webp', 'mandala12.webp', 'mandala13.webp', 'mandala14.webp',
      'mandala15.webp', 'mandala16.webp', 'mandala17.webp', 'mandala18.webp', 'mandala19.webp',
      'mandala20.webp', 'mandala21.webp', 'mandala22.webp', 'mandala23.webp', 'mandala24.webp',
      'mandala25.webp', 'mandala26.webp', 'mandala27.webp', 'mandala28.webp', 'mandala29.webp',
      'mandala30.webp', 'mandala31.webp', 'mandala32.webp', 'mandala34.webp', 'mandala35.webp',
      'mandala36.webp', 'mandala37.webp', 'mandala38.webp', 'mandala39.webp', 'mandala40.webp',
      'mandala41.webp'
    ]
  },
  base: {
    id: 'base',
    label: 'Base',
    subtitle: 'Aterramento & Estabilidade',
    defaultFreq: 396,
    folder: './_base/',
    files: Array.from({ length: 21 }, (_, i) => `base${i + 1}.webp`)
  },
  action: {
    id: 'action',
    label: 'Ação',
    subtitle: 'Energia & Movimento',
    defaultFreq: 417,
    folder: './_action/',
    files: Array.from({ length: 32 }, (_, i) => `action${i + 1}.webp`)
  },
  mind: {
    id: 'mind',
    label: 'Mente',
    subtitle: 'Foco & Clareza',
    defaultFreq: 528,
    folder: './_mind/',
    files: Array.from({ length: 40 }, (_, i) => `mind${i + 1}.webp`)
  },
  intuition: {
    id: 'intuition',
    label: 'Intuição',
    subtitle: 'Expansão & Insight',
    defaultFreq: 852,
    folder: './_intuition/',
    files: Array.from({ length: 30 }, (_, i) => `intuicao${i + 1}.webp`)
  }
};

export function getCollectionImages(collectionId) {
  if (collectionId === 'all') {
    return Object.values(COLLECTIONS).flatMap((col) =>
      col.files.map((f) => `${col.folder}${f}`)
    );
  }
  const col = COLLECTIONS[collectionId] || COLLECTIONS.mandala;
  return col.files.map((f) => `${col.folder}${f}`);
}

export const SOLFEGGIO_FREQUENCIES = [
  { hz: 396, name: '396 Hz', label: 'Liberação & Aterramento' },
  { hz: 417, name: '417 Hz', label: 'Transformação & Ação' },
  { hz: 432, name: '432 Hz', label: 'Harmonia Natural' },
  { hz: 528, name: '528 Hz', label: 'Clareza & Foco' },
  { hz: 639, name: '639 Hz', label: 'Conexão & Harmonia' },
  { hz: 741, name: '741 Hz', label: 'Despertar & Expressão' },
  { hz: 852, name: '852 Hz', label: 'Intuição & Ordem' },
  { hz: 963, name: '963 Hz', label: 'Unidade & Expansão' }
];

export const SPEED_PRESETS = [
  { id: 'subliminal', label: 'Subliminar', ms: 120 },
  { id: 'pulse', label: 'Pulso', ms: 450 },
  { id: 'flow', label: 'Fluxo', ms: 1500 },
  { id: 'breath', label: 'Respiração', ms: 4000 },
  { id: 'deep', label: 'Contemplação', ms: 8000 }
];

export const GRABOVOI_CODES = [
  'DEUS SEJA LOUVADO',
  '138', '7794', '35986', '71042', '938179', '1414551', '1489991', '1489999',
  '1784121', '1814321', '1888948', '3396815', '4812813', '5148123', '5184599',
  '5421427', '5481321', '5555555', '5821545', '5893240', '8123457', '8214351',
  '8345444', '8421432', '12370744', '14111963', '48154211', '71381921',
  '81319719', '91371985', '91738919', '148543293', '212585212', '285555901',
  '481854383', '514248538', '519648718', '548142182', '811120218', '917253481',
  '918197185', '942181942', '1001105010', '1231115025', '5142188948',
  '9187948181', '9198310917', '9721854218', '38649129871', '39119488061',
  '49874121861', '53142184161', '58160129471', '71427321893', '97318541218',
  '137142133914', '214217000819', '417584217888', '498217218227', '548491698719',
  '555142198110', '9187756981818', '9187758981818', '91297189194198',
  '915777918934198', '917532178919319', '1959873189849710', '9187756981818210',
  '5184913196197190000', '548 917 818', '894 719 7848', '214 217 000 819',
  '21461 8319 917', '318 798', '3194812 1961', '414 81 88', '419 488 71',
  '419 814', '419 818719 914481', '419 318 88941898', '419317 064891',
  '489314 81961', '493151 864 1491', '498 217 218 227', '515 4851',
  '5154 891', '51847181 211', '519 7148', '519 317 819 217', '519417 418614',
  '519515 619711', '519688 01971', '548 498 319 317', '584916819 97894141',
  '591814918791 068', '61 988 184 161', '641 849 8989', '8137 142 133914',
  '881 881 881', '888 912 818848', '888 412 1289018', '909841319 8049',
  '91 87948181'
];
