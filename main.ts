namespace robobithershey {

    // absolute position
    let abs_x = 0;
    let abs_y = 0;

    // current direction
    let direction = 0;

    // scale factor
    let scale_x = 5;
    let scale_y = 5;

    // a vertex
    class Vertex {
        public x: number;
        public y: number;
    }

    // a decoded Hershey glyph
    class Glyph {
        // left position
        public left: number;
        // right position
        public right: number;
        // vertices as array x1,y1,x2,y2,...,xn,yn
        public vertices: Array<Vertex>;
    }

    // glyph data (for chars a-z, and blank)
    // hershey font data without number in columns 1:4
    let glyphs: Array<string> = [
        // a - z
        '22L\UUTSRRPRNSMTLVLXMZO[Q[SZTXVRUWUZV[W[YZZY\V',
        '23M[MVOSRNSLTITGSFQGPIOMNTNZO[P[RZTXUUURVVWWYW[V',
        '14MXTTTSSRQROSNTMVMXNZP[S[VYXV',
        '24L\UUTSRRPRNSMTLVLXMZO[Q[SZTXZF RVRUWUZV[W[YZZY\V',
        '17NXOYQXRWSUSSRRQROSNUNXOZQ[S[UZVYXV',
        '24OWOVSQUNVLWIWGVFTGSIQQNZKaJdJfKgMfNcOZP[R[TZUYWV',
        '28L[UUTSRRPRNSMTLVLXMZO[Q[SZTY RVRTYPdOfMgLfLdMaP^S\U[XY[V',
        '29M\MVOSRNSLTITGSFQGPIOMNSM[ RM[NXOVQSSRURVSVUUXUZV[W[YZZY\V',
        '16PWSMSNTNTMSM RPVRRPXPZQ[R[TZUYWV',
        '20PWSMSNTNTMSM RPVRRLdKfIgHfHdIaL^O\Q[TYWV',
        '33M[MVOSRNSLTITGSFQGPIOMNSM[ RM[NXOVQSSRURVSVUTVQV RQVSWTZU[V[XZYY[V',
        '18OWOVQSTNULVIVGUFSGRIQMPTPZQ[R[TZUYWV',
        '33E^EVGSIRJSJTIXH[ RIXJVLSNRPRQSQTPXO[ RPXQVSSURWRXSXUWXWZX[Y[[Z\Y^V',
        '23J\JVLSNROSOTNXM[ RNXOVQSSRURVSVUUXUZV[W[YZZY\V',
        '23LZRRPRNSMTLVLXMZO[Q[SZTYUWUUTSRRQSQURWTXWXYWZV',
        '24KZKVMSNQMUGg RMUNSPRRRTSUUUWTYSZQ[ RMZO[R[UZWYZV',
        '27L[UUTSRRPRNSMTLVLXMZO[Q[SZ RVRUUSZPaOdOfPgRfScS\U[XY[V',
        '15MZMVOSPQPSSSTTTVSYSZT[U[WZXYZV',
        '16NYNVPSQQQSSVTXTZR[ RNZP[T[VZWYYV',
        '16OXOVQSSO RVFPXPZQ[S[UZVYXV RPNWN',
        '19L[LVNRLXLZM[O[QZSXUU RVRTXTZU[V[XZYY[V',
        '17L[LVNRMWMZN[O[RZTXUUUR RURVVWWYW[V',
        '25I^LRJTIWIYJ[L[NZPX RRRPXPZQ[S[UZWXXUXR RXRYVZW\W^V',
        '20JZJVLSNRPRQSQZR[U[XYZV RWSVRTRSSOZN[L[KZ',
        '23L[LVNRLXLZM[O[QZSXUU RVRPdOfMgLfLdMaP^S\U[XY[V',
        '23LZLVNSPRRRTTTVSXQZN[P\Q^QaPdOfMgLfLdMaP^S\WYZV',
        // "blank" (a dash)
        '03MWWVWV'
    ];

    // decode a Hershey glyph
    function decodeGlyph(glyphIndex: number) {
        control.assert(glyphIndex >= 0);
        control.assert(glyphIndex < glyphs.length);

        let glyphCode: string = glyphs[glyphIndex];

        let glyph: Glyph = new Glyph();

        let numVertices: number = parseInt(glyphCode.substr(0, 2));

        // 1st vertex is for left/right
        glyph.left = glyphCode.charCodeAt(3) - 82;
        glyph.right = glyphCode.charCodeAt(4) - 82;

        glyph.vertices = [];

        // copy all remaining vertices to array
        for (let i = 1; i < numVertices; i++) {
            let vertex: Vertex = new Vertex();

            vertex.x = glyphCode.charCodeAt(3 + (2 * i)) - 82;
            vertex.y = glyphCode.charCodeAt(3 + (2 * i) + 1) - 82;

            // skip " R" as we do not support "pen up"
            if (vertex.x == -50) {
                if (vertex.y == 0) {
                    continue;
                }
            }

            glyph.vertices.push(vertex);
        }

        return glyph;
    }

    // turn robobit to a new direction (angle from positive x axis)
    //% block
    function turnToNewDirection(newDirection: number) {
        // compute angle to rotate
        let rot = newDirection - direction

        if (rot >= 360) {
            rot -= 360;
        }

        if (rot <= -360) {
            rot += 360;
        }

        // do not turn more than 180 degrees (just turn to opposite direction)
        if (rot > 180) {
            rot = -1 * (360 - rot);
        }
        if (rot < -180) {
            rot = rot + 360;
        }

        // perform turn operation
        if (rot > 0) {
            // rotate counter clockwise
        } else if (rot < 0) {
            // rotate clockwise
        }

        direction = newDirection;
    }

    // move robobit number units in current direction
    //% block
    function moveForward(c: number) {
        // move
    }

    // plot a line from current position as (0,0) to (dx,dy)
    //% block
    function plotTo(dx: number, dy: number) {
        // translate relative coordinates nx, ny to an
        // angle to turn and length of way to move
        //
        // (0,0) is origin of our coordinate system. Depending on
        // dx's and dy's sign, build a right triangle in one of the
        // four quadrants (Q1..Q4) of our coordinate system with
        // a=dy and b=dx. To move robobit from (0,0) to (dx,dy),
        // we need to turn it by alpha and move the length of c.
        //
        // robobit mal already look in a different direction than
        // positive x axis (0 degree), so we have to subtract
        // robobits current angle from alpha
        //
        //           ^ y
        // Q4        |        Q1 
        //      B    |    B 
        //      |\   |   /|
        //      | \  | c/ |a=dy   b=dx
        //      |  \ | /  |
        //      |   \|/)alpha
        // -----C----A--b-C------> x
        //      |   /|\   |
        //      |  / | \  |
        //      | /  |  \ |
        //      |/   |   \|
        //      B    |    B
        // Q3        |        Q2
        //
        //
        // Trigonometry and Pythagoras are only computed for Q1
        // New direction is then computed from alpha.

        let c = Math.sqrt((dx * dx) + (dy * dy));

        // alpha = angle from positive x axis
        let alpha = 90;
        if (dx != 0) {
            alpha = (Math.atan(Math.abs(dy) / Math.abs(dx) * 180)) / Math.PI;
        }


        let newDirection = 0;

        if (dx >= 0) {
            if (dy >= 0) {
                // target vertex in Q1
                newDirection = alpha;
            } else {
                // target vertex in Q2
                newDirection = 360 - alpha
            }
        } else {
            if (dy >= 0) {
                // target vertex in Q4
                newDirection = 180 - alpha;
            } else {
                // target vertex in Q3
                newDirection = 180 + alpha;
            }
        }

        turnToNewDirection(newDirection);

        // drive c
        moveForward(c);

        abs_x += dx;
        abs_y += dy;
    }

    // plot a text using Hershey font
    //% block
    export function plotText(text: string) {
        for (let i = 0; i < text.length; i++) {
            let gi = text.charCodeAt(i);

            if (gi == 32 /* ascii blank */) {
                // glyph index of "blank"
                gi = 26;
            } else {
                gi -= 97 /* ascii a */;
            }

            let glyph: Glyph = decodeGlyph(gi);

            let x: number = 0;
            let y: number = 0;

            for (let vertex of glyph.vertices) {
                let nx: number = ((vertex.x - glyph.left) * scale_x) - x;
                let ny: number = (vertex.y * scale_y) - y;

                plotTo(nx, ny);
                x += nx;
                y += ny;
            }

            plotTo(((glyph.right - glyph.left) * scale_x) - x, 0);
        }
    }

}