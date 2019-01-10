namespace robobithershey {

    // current x position
    let x = 0;
    // current y position
    let y = 0;

    // current direction
    let direction = 0;

    // scale factor
    let scale_x = 5;
    let scale_y = 5;

    class Vertex {
        public x: number;
        public y: number;
    }

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

    function decodeGlyph(glyphIndex: number) {
        control.assert(number >= 0);
        control.assert(number < glyphs.length);

        let glyphCode: string = glyphs[glyphIndex];

        let glyph: Glyph = new Glyph();

        let numVertices: number = parseInt(glyphCode.substr(0, 2));

        // 1st vertex is for left/right
        glyph.left = glyphCode.charCodeAt(3) - 82;
        glyph.right = glyphCode.charCodeAt(4) - 82;

        glyph.vertices = new Array<Vertex>;

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

    //      ^ y
    //      |  
    //   Q4 | Q1
    // -----+------> x   (x,y) = (0,0) = origin
    //   Q3 | Q2
    //      |
    function plotTo(nx: number, ny: number) {
        let c = Math.sqrt((nx * nx) + (ny * ny));

        // alpha = angle from positive x axis
        let alpha = 90;
        if (nx != 0) {
            alpha = (Math.atan(ny / nx) * 180) / Math.PI;
        }


        let newDirection = 0;

        if (nx >= 0) {
            if (ny >= 0) {
                // target vertex in Q1
                newDirection = alpha;
            } else {
                // target vertex in Q2
                newDirection = 360 - alpha
            }
        } else {
            if (ny >= 0) {
                // target vertex in Q4
                newDirection = 180 - alpha;
            } else {
                // target vertex in Q3
                newDirection = 180 + alpha;
            }
        }

        // compute angle to rotate
        rot = newDirection - direction

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

        // drive c

        return newDirection;
    }

    //% block
    export function plotText(text: string) {
        for (let i = 0; i < text.length; i++) {
            let gi = char.charCodeAt(i);

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

                direction = plotTo(nx, ny);
                x += nx;
                y += ny;
            }

            direction = plotTo(((glyph.right - glyph.left) * scale_x) - x, 0);
        }
    }

}