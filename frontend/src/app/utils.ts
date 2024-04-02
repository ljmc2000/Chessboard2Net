export function parse_colour(colour: number): string {
  return '#'+colour.toString(16).padStart(6,'0')
}
