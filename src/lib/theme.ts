/** Dark unless the visitor picked light; the choice is remembered on this device. */
const STORAGE_KEY = "pn-theme";
const COLORS = { light: "#F7F3EC", dark: "#14111D" } as const;

export const THEME_DARK_COLOR = COLORS.dark;

/** Runs before first paint (see the root layout), so a light choice never flashes dark. */
export const THEME_INIT_SCRIPT = `try{if(localStorage.getItem("${STORAGE_KEY}")==="light"){document.documentElement.setAttribute("data-theme","light");document.addEventListener("DOMContentLoaded",function(){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","${COLORS.light}")})}}catch(e){}`;

export function toggleTheme(): void {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  if (next === "light") root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", COLORS[next]);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Private mode: the choice just lasts until the page closes.
  }
  window.dispatchEvent(new Event("pn-theme-change"));
}
