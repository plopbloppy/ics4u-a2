const form = document.getElementById("cubic-form") as HTMLFormElement;
const canvas = document.getElementById("graph") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const centerX = canvas.width/2 + 5;
const centerY = canvas.height/2 + 5;

//roots
let x1: any;
let x2: any;
let x3: any;

if (ctx) {
    //grid
    ctx.beginPath();
    for (let i = 5; i <= canvas.width; i += 30) {

        //vertical lines
        ctx.moveTo(i, 5);
        ctx.lineTo(i, canvas.height);

        //horizontal lines
        ctx.moveTo(5, i);
        ctx.lineTo(canvas.width, i);

        ctx.strokeStyle = "#AAAAAA";
        ctx.stroke();
    }

    ctx.lineWidth = 2;
    ctx.beginPath();

    //x-axis
    ctx.moveTo(5, centerY);
    ctx.lineTo(canvas.width, centerY);

    //y-axis
    ctx.moveTo(centerX, 5);
    ctx.lineTo(centerX, canvas.height);

    ctx.strokeStyle = "#443d80";
    ctx.stroke();
}

function drawFunction(x1: any, x2: any, x3: any, yInt: any) {
    if (ctx) {
        ctx.translate(centerX, centerY);
        ctx.beginPath();
        ctx.arc(x1, 0, Math.abs(x2 - x1), 0, Math.PI);
        // ctx.arc(x2, 0, 50, 0, Math.PI);
        ctx.stroke(); 
    }
}

form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const a: number = Number(formData.get("a"));
    const b: number = Number(formData.get("b"));
    const c: number = Number(formData.get("c"));
    const d: number = Number(formData.get("d"));

    const p = (3 * a * c - b * b) / (3 * a * a);
    const q = (27 * a * a * d - 9 * a * b * c + 2 * b ** 3) / (27 * a ** 3);
    const discriminant = (q / 2) ** 2 + (p / 3) ** 3;

    if (discriminant < 0) {
        const k = 2 * Math.sqrt(-p / 3);
        const theta = Math.acos(-q / (2 * Math.sqrt(-1 * ((p / 3) ** 3)))) / 3;
        x1 = k * Math.cos(theta) - b / (3 * a);
        x2 = k * Math.cos(theta + (2 * Math.PI) / 3) - b / (3 * a);
        x3 = k * Math.cos(theta + (4 * Math.PI / 3)) - b / (3 * a);

        (document.getElementById("result") as HTMLInputElement).value = `x1=${x1}, x2=${x2}, x3=${x3}`;
    } else if (discriminant > 0) {
        const U = -q / 2 + Math.sqrt((q / 2) ** 2 + (p / 3) ** 3);
        const V = -q / 2 - Math.sqrt((q / 2) ** 2 + (p / 3) ** 3);
        x1 = U ** 1 / 3;
        x2 = V ** 1 / 3;
        x3 = (-q / 2 + Math.sqrt((q / 2) ** 2 + (p / 3) ** 3)) ** 2 / 3 - b / (3 * a);

        (document.getElementById("result") as HTMLInputElement).value = `x1=${x1}, x2=${x2}, x3=${x3}`;
    } else {
        if (p == q && p == 0) {
            const x1 = (-q / 2 + Math.sqrt((q / 2) ** 2 + (p / 3) ** 3)) ** 2 / 3 - b / (3 * a);
            (document.getElementById("result") as HTMLInputElement).value = `x1=${x1}, x2=${x1}, x3=${x1}`;

        } else {
            const x1 = (p / 2) ** 1 / 3 - b / (3 * a);
            const x3 = -2 * x1;

            (document.getElementById("result") as HTMLInputElement).value = `x1=${x1}, x2=${x1}, x3=${x3}`;
        }
    }
    drawFunction(x1, x2, x3, d);
})