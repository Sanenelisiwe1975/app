export default function BackToTop() {
  return (
    <button className="back-to-top" id="backToTop" aria-label="Back to top">
      <svg className="icon">
        <use href="#icon-arrow-up" />
      </svg>
    </button>
  );
}
