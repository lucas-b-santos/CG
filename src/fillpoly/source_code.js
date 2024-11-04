import $ from "jquery";
("use strict");
/**
 * Represents a 2D point in a polygon.
 *
 * @remarks This class is used to define the vertices of a polygon.
 */
class Vertex {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Converts the vertex coordinates to canvas coordinates.
     *
     * @param {number} pixelSize - The size of a pixel in the canvas.
     *
     * @returns {Vertex} A new vertex with the converted coordinates.
     */
    toCanvasCords(pixelSize) {
        return new Vertex(this.x * pixelSize + pixelSize / 2, this.y * pixelSize + pixelSize / 2);
    }
}
/**
 * Represents a polygon in a 2D space.
 *
 * @remarks This class is used to define and manipulate polygons.
 */
class Polygon {
    cords;
    color;
    constructor() {
        this.cords = [];
        this.color = "";
    }
    /**
     * Gets the color of the polygon.
     *
     * @returns {string} The color of the polygon.
     */
    getColor() {
        return this.color;
    }
    /**
     * Sets the color of the polygon.
     *
     * @param {string} color - The new color of the polygon.
     */
    setColor(color) {
        this.color = color;
    }
    /**
     * Adds a vertex to the polygon.
     *
     * @param {Vertex} vertex - The vertex to add to the polygon.
     */
    addVertex(vertex) {
        this.cords.push(vertex);
    }
    /**
     * Gets the first vertex of the polygon.
     *
     * @returns {Vertex} The first vertex of the polygon.
     */
    firstVertex() {
        return this.cords[0];
    }
    /**
     * Gets the last vertex of the polygon.
     *
     * @returns {Vertex | undefined} The last vertex of the polygon, or `undefined` if the polygon is empty.
     */
    lastVertex() {
        return this.cords.at(-1);
    }
    /**
     * Checks if a given point is inside the polygon.
     *
     * @param {Vertex} point - The point to check.
     *
     * @returns {boolean} `true` if the point is inside the polygon, `false` otherwise.
     */
    isPointInPolygon(point) {
        const cords = this.cords;
        console.log('teste');
        const x = point.x, y = point.y;
        let inside = false;
        for (let i = 0, j = cords.length - 1; i < cords.length; j = i++) {
            let xi = cords[i].x, yi = cords[i].y;
            let xj = cords[j].x, yj = cords[j].y;
            let intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect)
                inside = !inside;
        }
        return inside;
    }
    /**
     * Gets the vertices of the polygon.
     *
     * @returns {Vertex[]} An array of vertices representing the polygon.
     */
    getCords() {
        return this.cords;
    }
}
function main() {
    const pixelSize = 2;
    const backgroundColor = "darkgray";
    const poligonos = Array();
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const buttons = document.querySelectorAll("button");
    const inputs = document.querySelectorAll("input");
    let previousPoint = null;
    let isDrawing = false;
    let isInspecting = false;
    let isExcluding = false;
    let selectedColor = "black";
    let colorirArestas = false;
    /**
     * Blocks all buttons and inputs in the page, except for those specified in the `except` parameter.
     *
     * @param {string} except - A string containing the IDs of the buttons and inputs that should not be blocked.
     *                  IDs should be separated by spaces.
     *
     * @remarks This function iterates over all buttons and inputs in the page,
     *          setting their `disabled` property to `true` for those not specified in the `except` parameter.
     *          This disables the buttons and inputs to be clicked and interacted with by the user.
     */
    function blockOthers(except) {
        buttons.forEach((button) => {
            button.disabled = !except.includes(button.id);
        });
        inputs.forEach((input) => {
            input.disabled = !except.includes(input.id);
        });
    }
    /**
     * Unblocks all buttons and inputs on the page, allowing user interaction.
     *
     * @remarks This function iterates over all buttons and inputs in the page,
     * setting their `disabled` property to `false`. This enables the buttons and
     * inputs to be clicked and interacted with by the user.
     */
    function unblockOthers() {
        buttons.forEach((button) => {
            button.disabled = false;
        });
        inputs.forEach((input) => {
            input.disabled = false;
        });
    }
    /**
     * Draws a single pixel at the specified coordinates with the given color.
     *
     * @param {number} x - The x-coordinate of the pixel in canvas coordinates.
     * @param {number} y - The y-coordinate of the pixel in canvas coordinates.
     * @param {string} color - The color to fill the pixel with.
     */
    function drawPixel(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
    /**
     * Draws a line between two points on the canvas.
     *
     * @param {number} p1 - The starting point of the line.
     * @param {number} p2 - The ending point of the line.
     * @param {string} color - The color of the line.
     * @param {number} width - The width of the line.
     *
     * @returns {void}
     */
    function drawLine(p1, p2, color, width) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
    }
    /**
     * Fills the polygon with the color specified in the polygon object.
     *
     * @param {Vertex} polygon - The polygon object to be filled.
     *
     * @remarks This function uses the scanline algorithm to fill the polygon.
     *          It first calculates the scanlines for each row in the polygon's bounding box.
     *          Then, it iterates over each scanline and draws horizontal lines between the corresponding x-coordinates.
     *          The lines are drawn with the color specified in the polygon object.
     */
    function fillpolly(polygon) {
        const cords = polygon.getCords();
        const Y_cords = cords.map((cord) => cord.y);
        const Y_min_poly = Math.min(...Y_cords);
        const Y_max_poly = Math.max(...Y_cords);
        const Ns = Y_max_poly - Y_min_poly;
        const scanlines = Array.from({ length: Ns }, () => []);
        for (let i = 0; i < cords.length; i++) {
            const a = cords[i];
            const b = cords[(i + 1) % cords.length];
            const edge = [a, b].sort((a, b) => a.y - b.y);
            console.log(edge);
            const Ymax = edge[1].y, Ymin = edge[0].y, Xmax = edge[1].x, Xmin = edge[0].x;
            const Tx = (Xmax - Xmin) / (Ymax - Ymin);
            let current_x = Xmin;
            for (let ii = Ymin - Y_min_poly; ii < Ymax - Y_min_poly; ii++) {
                scanlines[ii].push(current_x);
                current_x += Tx;
            }
        }
        for (let i = 0; i < Ns; i++)
            scanlines[i].sort((a, b) => a - b);
        for (let i = 0; i < Ns; i++) {
            for (let ii = 0; ii < scanlines[i].length; ii += 2) {
                const min = [
                    Math.ceil(scanlines[i][ii]),
                    i + Y_min_poly,
                ];
                const max = [
                    Math.floor(scanlines[i][ii + 1]),
                    i + Y_min_poly,
                ];
                const p1 = new Vertex(...min), p2 = new Vertex(...max);
                drawLine(p1.toCanvasCords(pixelSize), p2.toCanvasCords(pixelSize), polygon.getColor(), pixelSize);
            }
        }
    }
    /**
     * Calculates the distance from a point to the closest edge of a polygon.
     *
     * @param {Vertex} p - The point from which the distance is calculated.
     * @param {Vertex} v1 - The first vertex of the edge.
     * @param {Vertex} v2 - The second vertex of the edge.
     *
     * @returns {number} The distance from the point to the closest edge.
     *
     * @remarks This function checks if the projected point is inside the edge or not.
     *          If it's not, it calculates the distance to the nearest vertex.
     *          If it's inside, it calculates the perpendicular distance to the edge.
     */
    function pointToEdgeDistance(p, v1, v2) {
        const x1 = v1.x, y1 = v1.y, x2 = v2.x, y2 = v2.y;
        const px = p.x, py = p.y;
        // Check if the projected point is inside the edge or not
        // If it's not, calculate the distance to the nearest vertex
        // Dot product between vector(P, v1) and vector(v1, v2)
        // If < 0, the angle formed is > 90 degrees
        // So, the projected point is before x1, y1
        let dotProduct1 = (px - x1) * (x2 - x1) + (py - y1) * (y2 - y1);
        // Dot product between vector(P, v2) and vector(v2, v1)
        // If < 0, the angle formed is > 90 degrees
        // So, the projected point is after x2, y2
        let dotProduct2 = (px - x2) * (x1 - x2) + (py - y2) * (y1 - y2);
        if (dotProduct1 < 0)
            return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
        else if (dotProduct2 < 0)
            return Math.sqrt((px - x2) ** 2 + (py - y2) ** 2);
        // If the projected point is between x1 and x2, the minimum distance is perpendicular
        const numerator = Math.abs((y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1);
        const denominator = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
        const distanceToLine = numerator / denominator;
        return distanceToLine;
    }
    /**
     * Finds the polygon in the given array that has the closest edge to the specified point.
     *
     * @param {Polygon[]} polygon - An array of polygons to search for the closest edge.
     * @param {number} pointX - The x-coordinate of the point to find the closest edge to.
     * @param {number} pointY - The y-coordinate of the point to find the closest edge to.
     *
     * @returns {Polygon | null} - The polygon that has the closest edge to the specified point,
     *                            or `null` if no polygons were found.
     *
     * @remarks This function iterates over each polygon in the given array and calculates the distance
     *          from the specified point to each edge of the polygon. It keeps track of the polygon
     *          with the smallest distance and returns it as the result.
     */
    function findClosestEdge(polygon, pointX, pointY) {
        let closestPolygon = null;
        let minDistance = Infinity;
        polygon.forEach((polygon) => {
            const cords = polygon.getCords();
            for (let i = 0; i < cords.length; i++) {
                const x1 = cords[i].x;
                const y1 = cords[i].y;
                const x2 = cords[(i + 1) % cords.length].x;
                const y2 = cords[(i + 1) % cords.length].y;
                // Calcula a distância do ponto até a aresta atual
                const distance = pointToEdgeDistance(new Vertex(pointX, pointY), new Vertex(x1, y1), new Vertex(x2, y2));
                if (distance < minDistance) {
                    minDistance = distance;
                    closestPolygon = polygon;
                }
            }
        });
        return closestPolygon;
    }
    /**
     * Initializes the canvas by filling it with pixels of the specified background color.
     *
     * @remarks This function iterates over each pixel in the canvas and calls the `drawPixel` function
     *          to fill it with the specified background color.
     *
     * @returns {void}
     */
    function initializeCanvas() {
        for (let x = 0; x < canvas.width / pixelSize; x++) {
            for (let y = 0; y < canvas.height / pixelSize; y++)
                drawPixel(x, y, backgroundColor);
        }
    }
    /**
     * Redraws the canvas with the current polygons and options.
     *
     * @param {boolean} [withEdges=false] - Indicates whether to draw the edges of the polygons.
     *
     * @returns {void}
     *
     * @remarks This function clears the canvas and redraws each polygon.
     *          If `withEdges` is `true`, it also draws the edges of the polygons.
     *          The polygons are filled with their respective colors.
     */
    function redraw(withEdges = false) {
        initializeCanvas();
        for (let i = 0; i < poligonos.length; i++) {
            const cords = poligonos[i].getCords();
            fillpolly(poligonos[i]);
            if (!withEdges)
                continue;
            for (let ii = 0; ii < cords.length; ii++) {
                const v1 = new Vertex(cords[ii].x, cords[ii].y);
                const v2 = new Vertex(cords[(ii + 1) % cords.length].x, cords[(ii + 1) % cords.length].y);
                drawLine(v1.toCanvasCords(pixelSize), v2.toCanvasCords(pixelSize), "yellow", pixelSize);
            }
        }
    }
    // Verifica cliques no canvas
    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        // Converte p/ cordenadas Viewport
        const x = Math.floor((event.clientX - rect.left) / pixelSize);
        const y = Math.floor((event.clientY - rect.top) / pixelSize);
        if (isInspecting) {
            const inside = poligonos.map((poligono) => {
                return poligono.isPointInPolygon(new Vertex(x, y));
            });
            const selectedPolygons = poligonos.filter((value, index) => inside[index]);
            const closestPolygon = findClosestEdge(selectedPolygons, x, y);
            if (closestPolygon) {
                if (isExcluding) {
                    const idx = poligonos.indexOf(closestPolygon);
                    poligonos.splice(idx, 1);
                }
                else
                    closestPolygon.setColor(selectedColor);
            }
            redraw(colorirArestas);
            isInspecting = false;
            isExcluding = false;
            unblockOthers();
            return;
        }
        if (!isDrawing)
            return;
        // Verificação se as coordenadas estão dentro dos limites do canvas
        if (x < 0 ||
            y < 0 ||
            x >= canvas.width / pixelSize ||
            y >= canvas.height / pixelSize)
            return; // Ignora o clique fora dos limites
        // Colorir o pixel clicado
        drawPixel(x, y, selectedColor);
        const currentPoint = new Vertex(x, y);
        // Se houver um ponto anterior, desenhar uma linha entre o ponto anterior e o novo
        if (previousPoint)
            drawLine(previousPoint, currentPoint.toCanvasCords(pixelSize), selectedColor, pixelSize);
        else
            poligonos.push(new Polygon());
        const lastPol = poligonos.at(-1);
        lastPol.addVertex(currentPoint);
        // Atualizar o ponto anterior
        previousPoint = currentPoint.toCanvasCords(pixelSize);
    });
    // Quando usuário seleciona para adicionar polígono
    $("#btnAdicionarPoligono").on("click", () => {
        if (!isDrawing) {
            isDrawing = true;
            $("#btnAdicionarPoligono").text("Fechar Polígono");
            blockOthers("btnAdicionarPoligono");
            return;
        }
        const lastPolDrawed = poligonos.at(-1);
        // Verificar se há pelo menos 3 pontos
        if (previousPoint == null || lastPolDrawed.cords.length < 3) {
            alert("Um poligono precisa de pelo menos 3 pontos!");
            return;
        }
        lastPolDrawed.setColor(selectedColor);
        redraw(colorirArestas);
        previousPoint = null;
        isDrawing = false;
        unblockOthers();
        $("#btnAdicionarPoligono").text("Adicionar Polígono");
    });
    // Quando usuário seleciona para pintar
    $("#btnPintar").on("click", () => {
        if (isInspecting) {
            isInspecting = false;
            unblockOthers();
        }
        if (poligonos.length === 0) {
            alert("Nenhum polígono foi adicionado!");
            return;
        }
        isInspecting = true;
        blockOthers("btnPintar colorPicker");
    });
    // Quando usuário opta por excluir polígono
    $("#btnExcluir").on("click", () => {
        if (isInspecting) {
            isInspecting = false;
            isExcluding = false;
            unblockOthers();
        }
        if (poligonos.length === 0) {
            alert("Nenhum polígono foi adicionado!");
            return;
        }
        isInspecting = true;
        isExcluding = true;
        blockOthers("btnExcluir");
    });
    // Obtém cor quando usuário seleciona
    $("#colorPicker").on("change", function () {
        selectedColor = $(this).val();
    });
    // Verifica quando usuário marcou checkbox
    $("#ckboxColorirArestas").on("change", function (event) {
        const target = event.target;
        // Se marcou, redesenha pintando as arestas
        if (target.checked) {
            redraw(true);
            colorirArestas = true;
            // Se desmarcou, redesenha sem pintar arestas
        }
        else {
            redraw();
            colorirArestas = false;
        }
    });
    // Limpa tela ao clicar no botão Limpar
    $("#btnLimpar").on("click", () => {
        initializeCanvas();
        poligonos.length = 0;
        previousPoint = null;
        isDrawing = false;
        isInspecting = false;
    });
    initializeCanvas();
}
$(main);
