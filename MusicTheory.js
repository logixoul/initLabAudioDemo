export function noteIndexToFrequency(noteIndex) {
    return 440 * Math.pow(2, (noteIndex - 69) / 12);
}
