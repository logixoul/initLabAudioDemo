window.AudioContext = window.AudioContext || window.webkitAudioContext;

let context = new AudioContext();

function playSound() {
    let buf = new Float32Array(context.sampleRate * seconds)
    for (let i = 0; i < buf.length; i++)
        buf[i] = sineWaveAt(i, tone) * volume;
    let buffer = context.createBuffer(1, buf.length, context.sampleRate)
    buffer.copyToChannel(buf, 0)
    let source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
}

function sineWaveAt(sampleNumber, tone) {
  const sampleFreq = context.sampleRate / tone
  return Math.sin(sampleNumber / (sampleFreq / (Math.PI * 2)))
}

let volume = 0.2,
  seconds = 0.5,
  tone = 441

document.addEventListener("keydown", () => {
    playSound();
    console.log("playing")
});