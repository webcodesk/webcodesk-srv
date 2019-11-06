export function getOffset(el) {
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: (rect.top + scrollTop),
    left: (rect.left + scrollLeft),
    right: rect.right + scrollLeft,
    bottom: rect.bottom + scrollTop
  };
}