//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 假设两个数组代表的时间序列相同但有偏差，平移对齐两个数组
 * 
 * @param {Number[]} ary1 数组 1（参考数组）
 * @param {Number[]} ary2 数组 2（实际数组）
 * 
 * @returns {Number[]} 从哪里开始把 ary1 和 ary2 对齐。 ary1[0] -> ary2[x]
 */
function align_shift(ary1, ary2) {
    const shift_max = 50 + Math.abs(ary1.length - ary2.length);
    let avg_ary1 = ary1.reduce((prev, curr)=> (prev + curr)) / ary1.length;
    let avg_ary2 = ary2.reduce((prev, curr)=> (prev + curr)) / ary2.length;

    let ary1_de_avg = ary1.map((val) => val - avg_ary1);
    let ary2_de_avg = ary2.map((val) => val - avg_ary2);

    let window_length = Math.min(ary1.length, ary2.length) - window_length - 2;
    let best_shift = 0, least_loss = Number.MAX_VALUE;

    let ary1_slice = ary1_de_avg.slice(shift_max, shift_max + window_length);
    for(let i = -shift_max; i <= shift_max; i++) {
        let ary2_slice = ary2_de_avg.slice(i + shift_max, i + shift_max + window_length);
        let loss = rms(ary1_slice, ary2_slice);
        if(loss < least_loss) {
            least_loss = loss;
            best_shift = i;
        }
    }
    return best_shift;
}

/**
 * 返回两个数组的相像程度。
 * 
 * @param {Number[]} ary1 
 * @param {Number[]} ary2 
 * 
 * @returns {Number[]} 均方根误差。
 */

function rms(ary1, ary2) {
    console.assert(ary1.length == ary2.length);
    let sum = 0;
    for(let i = ary1.length; i >= 0; i--) {
        sum += (ary1[i] - ary2[i]) ** 2;
    }
    return Math.sqrt(sum);
}

/**
 * 修改原数组来填充数组的空洞
 * @param {Number[]} ary 有空洞的时间序列数组
 */
function fill_hole(ary) {
    let last_value = 0;
    for(let i = 0; i < ary.length; i++) {
        if(ary[i] == 0) {
            ary[i] = last_value;
        }
        last_value = ary[i];
    }
}

/**
 * 裁去前面和后面的 0.
 * @param {Number[]} ary
 */
function clip_zeros(ary) {
    while(ary[0] == 0) {
        ary.shift();
    }
    while(ary[ary.length-1] == 0) {
        ary.pop();
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 
 * @param {Number[]} ary 
 * @param {CanvasRenderingContext2D} cxt 
 * @param {string} color 
 * @param {number} shiftX
 * @param {number} scaleX 
 * @param {number} scaleY 
 */
function draw_lines(ary, cxt, color, shiftX, scaleX, scaleY) {
    cxt.strokeStyle = color;
    let canvas_height = cxt.canvas.height;
    cxt.moveTo(shiftX, canvas_height - ary[0])
    for(let i = 1; i < ary.length; i++) {
        cxt.lineTo(i * scaleX + shiftX, canvas_height - ary[i]);
    }
    cxt.stroke();
}