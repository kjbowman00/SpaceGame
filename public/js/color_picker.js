let colorPalette = [
    ["#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#9900ff", "#ff00ff"],
    ["#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
    ["#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
    ["#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
];

$("#color_picker").spectrum({
    showPaletteOnly: true,
    showPalette: true,
    hideAfterPaletteSelect: true,
    color: 'red',
    preferredFormat: "hex",
    palette: colorPalette
});

function getColorIndexFromPalette(color) {
    for (let i = 0; i < colorPalette.length; i++) {
        for (let j = 0; j < colorPalette[i].length; j++) {
            if (colorPalette[i][j] == color) return { i: i, j: j };
        }
    }
    return null;
}