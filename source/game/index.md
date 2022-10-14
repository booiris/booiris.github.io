<style>
body {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

#fps {
    white-space: pre;
    font-family: monospace;
}
</style>
<div id="fps"></div>
<canvas id="game-of-life-canvas"></canvas>
<script src="./bootstrap.js"></script>
<button id="play-pause"></button>
<button id="restart"></button>
<script type="module" src="./bootstrap.js"></script>