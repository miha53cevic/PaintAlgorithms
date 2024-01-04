createCanvas(640, 480, '2d');

const image = ctx.createImageData(WIDTH, HEIGHT);

// H [0, 360],  S [0, 100], V [0, 100]
function HSVtoRGB(H, S, V) {
    // normalize to [0, 1.0]
    H /= 360;
    S /= 100;
    V /= 100;

    let r, g, b;
    if (S == 0) {
        r = V * 255;
        g = V * 255;
        b = V * 255;
    }
    else {
        let var_h = H * 6
        if (var_h == 6) var_h = 0
        const var_i = Math.floor(var_h)
        const var_1 = V * (1 - S)
        const var_2 = V * (1 - S * (var_h - var_i))
        const var_3 = V * (1 - S * (1 - (var_h - var_i)))

        let var_r, var_g, var_b;
        if (var_i == 0) { var_r = V; var_g = var_3; var_b = var_1 }
        else if (var_i == 1) { var_r = var_2; var_g = V; var_b = var_1 }
        else if (var_i == 2) { var_r = var_1; var_g = V; var_b = var_3 }
        else if (var_i == 3) { var_r = var_1; var_g = var_2; var_b = V }
        else if (var_i == 4) { var_r = var_3; var_g = var_1; var_b = V }
        else { var_r = V; var_g = var_1; var_b = var_2 }

        r = var_r * 255;
        g = var_g * 255;
        b = var_b * 255;
    }
    return [ r, g, b ];
}

function DrawColorPicker(radius) {
    for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
            const distance = Math.sqrt((x * x) + (y * y));
            if (distance > radius) continue;

            // angle of (x,y) point to center
            const angle = Math.atan2(y, x) + Math.PI; // atan2 returns [-pi, +pi] so we move to [0, 2pi]

            // use polar coordinates for HSV (distance, angle) or (radius, phi)
            const radiusNormalized = distance / radius * 100; // normalize to [0, 100]
            const rgb = HSVtoRGB(toDegrees(angle), radiusNormalized, 100);

            // translate from (0, 0) in middle back to (0, 0) in top left corner
            const sx = x + WIDTH / 2;
            const sy = y + HEIGHT / 2;
            const offset = 4; // RGBA values for each pixel
            const index = (WIDTH * sy + sx) * offset;

            image.data[index + 0] = rgb[0];
            image.data[index + 1] = rgb[1];
            image.data[index + 2] = rgb[2];
            image.data[index + 3] = 255;
        }
    }
}

function Init() {
    const radius = 225;
    DrawColorPicker(radius);
    ctx.putImageData(image, 0, 0);

    // Add color picking
    ctx.canvas.addEventListener('click', () => {
        // translate to 0,0 in middle
        const sx = MOUSE_POS.x - WIDTH / 2;
        const sy = MOUSE_POS.y - HEIGHT / 2;

        // Check if in circle
        const distance = Math.sqrt((sx * sx) + (sy * sy));
        if (distance > radius) return;

        // Reset previous position (just redraw circle)
        DrawColorPicker(radius);
        ctx.putImageData(image, 0, 0);

        // draw circle on point
        drawArc(MOUSE_POS.x, MOUSE_POS.y, 8, 0, toRadian(360), 'black');

        // Show chosen point rgb value
        const angle = toDegrees(Math.atan2(sy, sx) + Math.PI);
        const radiusNormalized = distance / radius * 100;
        const rgb = HSVtoRGB(angle, radiusNormalized, 100);
        document.getElementById('pickedColor').innerText = `RGB: (${Math.floor(rgb[0])}, ${Math.floor(rgb[1])}, ${Math.floor(rgb[2])})`;
    });
}

Init();