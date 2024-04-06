export function parse_colour(colour: number): string {
  return '#'+colour.toString(16).padStart(6,'0')
}

export function waitForElm(e: HTMLElement, selector: string): Promise<NodeListOf<HTMLElement>> {
  return new Promise(resolve => {
    if (e.querySelector(selector)) {
      return resolve(e.querySelectorAll<HTMLElement>(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (e.querySelector(selector)) {
        observer.disconnect();
        return resolve(e.querySelectorAll<HTMLElement>(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(e, {
      childList: true,
      subtree: true
    });
  });
}
