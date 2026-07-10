// Fixed categorical order, validated via the dataviz skill's palette checker
// (adjacent + all-pairs CVD separation, lightness band, chroma floor, contrast).
export const CATEGORICAL_PALETTE = ["#6366f1", "#0284c7", "#0d9488", "#db2777", "#ea580c", "#16a34a"];

// Neutral "Lainnya"/"Other" bucket — deliberately desaturated to recede, not a
// real identity slot, so it's exempt from the categorical palette validation.
export const OTHER_COLOR = "#94a3b8";
