export function idToNumConverter(id) {
  return parseInt(id);
}

export function idToStrConverter(id) {
  return id.toString();
}

export function idPadStartZero(id) {
  return id.padStart(3, "0");
}

export function nextIdGet(id) {
  const nextIdInt = idToNumConverter(id) + 1;
  const nextIdStr = idToStrConverter(nextIdInt);
  return idPadStartZero(nextIdStr);
}
