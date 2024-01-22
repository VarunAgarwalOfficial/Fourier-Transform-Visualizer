let width = 800;
let height = 600;
let series = []
let dft_series = [];
let drawn = [];
let n = 0;

let slider;
async function setup() {
    let cnv = createCanvas(width, height);

    cnv.parent('container');

    points = await fetch('/data.json').then(res => res.json());
    points = points.points;
    let max_re = 0;
    let max_im = 0;
    for (let i = 0; i < points.length; i += 2) {
        series.push(new Complex(re = points[i], im = points[i + 1]));
        if (points[i] > max_re) max_re = points[i];
        if (points[i + 1] > max_im) max_im = points[i + 1];
    }

    for (let i = 0; i < series.length; i++) {
        series[i] = series[i].add(new Complex(-max_re / 2, -max_im / 2));
    }

    slider = createSlider(50, series.length, step = 50);
    let no_vec = slider.value();



    dft_series = dft(series);
    dft_series.sort((a, b) => b.abs - a.abs);
    sum = new Complex(0, 0);
    for (let i = 0; i < no_vec; i++) {
        let rad = dft_series[i].abs;
        let phase = dft_series[i].phase;
        let k = dft_series[i].freq;
        let theta = (2 * PI * k * n) / dft_series.length + phase;
        sum = sum.add(new Complex(rad * cos(theta), rad * sin(theta)));
    }
    drawn.push(new Complex(sum.re / dft_series.length, sum.im / dft_series.length));

}

function dft(series, N = series.length) {
    let X = [];

    for (let k = 0; k < N; k++) {
        let sum = new Complex(0, 0);
        for (let n = 0; n < N; n++) {
            let phi = -1 * (2 * PI * k * n) / N;
            sum = sum.add(series[n].mul(new Complex(cos(phi), sin(phi))));
        }
        X[k] = {
            re: sum.re,
            im: sum.im,
            abs: sqrt(sum.re * sum.re + sum.im * sum.im),
            phase: atan2(sum.im, sum.re),
            freq: k
        };
    }
    return X;
}






function draw() {
    background(0);
    stroke(255, 255, 255);
    strokeWeight(1);
    fill(0, 0, 0, 0);

    sum = new Complex(0, 0);
    prev = new Complex(0, 0);
    let no_vec = slider.value();

    for (let i = 0; i < no_vec; i++) {
        let rad = dft_series[i].abs;
        let phase = dft_series[i].phase;
        let k = dft_series[i].freq;
        let theta = (2 * PI * k * n) / dft_series.length + phase;
        sum = sum.add(new Complex(rad * cos(theta) / dft_series.length, rad * sin(theta) / dft_series.length));

        if (prev.re == 400 || prev.im == 300)
            console.log([width / 2 + prev.re, height / 2 + prev.im, width / 2 + sum.re, height / 2 + sum.im, i])
        line(width / 2 + prev.re, height / 2 + prev.im, width / 2 + sum.re, height / 2 + sum.im);
        circle(width / 2 + prev.re, height / 2 + prev.im, rad / dft_series.length);
        prev = sum
    }
    strokeWeight(2);
    stroke(0, 188, 212);

    drawn.push(sum)
    for (let i = 0; i < drawn.length - 1; i++) {
        line(width / 2 + drawn[i].re, height / 2 + drawn[i].im, width / 2 + drawn[i + 1].re, height / 2 + drawn[i + 1].im);
    }

    if (drawn.length > 0.9 * dft_series.length) {
        drawn.shift();
    }
    n++;
}



class Complex {
    constructor(re, im) {
        this.re = re;
        this.im = im;
    }
    add(c2) {
        return new Complex(this.re + c2.re, this.im + c2.im);
    }
    mul(c2) {
        return new Complex(this.re * c2.re - this.im * c2.im, this.re * c2.im + this.im * c2.re);
    }
}