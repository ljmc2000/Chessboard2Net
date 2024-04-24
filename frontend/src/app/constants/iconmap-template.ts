export const IconMapTemplate: any={
  P: 'pawn',
  R: 'rook',
  N: 'knight',
  B: 'bishop',
  Q: 'queen',
  K: 'king',

  F: 'pawn',  //fresh
  E: 'pawn',  //en passant
  C: 'rook',  //can castle
  J: 'king',  //can castle
}

export function getDefaultIconMap(): any {
  var icon_map: any={};
  icon_map[' ']=`blank`;

  for(var key in IconMapTemplate) {
    icon_map[key.toUpperCase()]=`doodles/${IconMapTemplate[key]}_back`;
    icon_map[key.toLowerCase()]=`doodles/${IconMapTemplate[key]}`;
  }

  return icon_map;
}

export function getReversedDefaultIconMap(): any {
  var icon_map: any={};
  icon_map[' ']=`blank`;

  for(var key in IconMapTemplate) {
    icon_map[key.toUpperCase()]=`doodles/${IconMapTemplate[key]}`;
    icon_map[key.toLowerCase()]=`doodles/${IconMapTemplate[key]}_back`;
  }

  return icon_map;
}
