const EXPORTED_SYMBOLS = [ 'RSA' ];

var RSA = (function() {
    var ai = 2;
    var L = 16;
    var q = L;
    var V = 1 << 16;
    var e = V >>> 1;
    var R = V * V;
    var Z = V - 1;
    var af = 9999999999999998;
    var aa;
    var ag;
    var o, c;
    function y(al) {
        aa = al;
        ag = new Array(aa);
        for (var ak = 0; ak < ag.length; ak++) {
            ag[ak] = 0
        }
        o = new b();
        c = new b();
        c.digits[0] = 1
    }
    y(20);
    var N = 15;
    var Q = s(1000000000000000);
    function b(ak) {
        if (typeof ak == "boolean" && ak == true) {
            this.digits = null
        } else {
            this.digits = ag.slice(0)
        }
        this.isNeg = false
    }
    function t(ao) {
        var an = ao.charAt(0) == "-";
        var am = an ? 1 : 0;
        var ak;
        while (am < ao.length && ao.charAt(am) == "0") {++am
        }
        if (am == ao.length) {
            ak = new b()
        } else {
            var al = ao.length - am;
            var ap = al % N;
            if (ap == 0) {
                ap = N
            }
            ak = s(Number(ao.substr(am, ap)));
            am += ap;
            while (am < ao.length) {
                ak = g(aj(ak, Q), s(Number(ao.substr(am, N))));
                am += N
            }
            ak.isNeg = an
        }
        return ak
    }
    function U(al) {
        var ak = new b(true);
        ak.digits = al.digits.slice(0);
        ak.isNeg = al.isNeg;
        return ak
    }
    function s(am) {
        var ak = new b();
        ak.isNeg = am < 0;
        am = Math.abs(am);
        var al = 0;
        while (am > 0) {
            ak.digits[al++] = am & Z;
            am >>= L
        }
        return ak
    }
    function B(am) {
        var ak = "";
        for (var al = am.length - 1; al > -1; --al) {
            ak += am.charAt(al)
        }
        return ak
    }
    var d = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z");
    function T(am, ao) {
        var al = new b();
        al.digits[0] = ao;
        var an = A(am, al);
        var ak = d[an[1].digits[0]];
        while (f(an[0], o) == 1) {
            an = A(an[0], al);
            digit = an[1].digits[0];
            ak += d[an[1].digits[0]]
        }
        return (am.isNeg ? "-": "") + B(ak)
    }
    function ah(am) {
        var al = new b();
        al.digits[0] = 10;
        var an = A(am, al);
        var ak = String(an[1].digits[0]);
        while (f(an[0], o) == 1) {
            an = A(an[0], al);
            ak += String(an[1].digits[0])
        }
        return (am.isNeg ? "-": "") + B(ak)
    }
    var n = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
    function W(am) {
        var al = 15;
        var ak = "";
        for (i = 0; i < 4; ++i) {
            ak += n[am & al];
            am >>>= 4
        }
        return B(ak)
    }
    function F(al) {
        var ak = "";
        var an = ab(al);
        for (var am = ab(al); am > -1; --am) {
            ak += W(al.digits[am])
        }
        return ak
    }
    function E(ar) {
        var am = 48;
        var al = am + 9;
        var an = 97;
        var aq = an + 25;
        var ap = 65;
        var ao = 65 + 25;
        var ak;
        if (ar >= am && ar <= al) {
            ak = ar - am
        } else {
            if (ar >= ap && ar <= ao) {
                ak = 10 + ar - ap
            } else {
                if (ar >= an && ar <= aq) {
                    ak = 10 + ar - an
                } else {
                    ak = 0
                }
            }
        }
        return ak
    }
    function O(an) {
        var al = 0;
        var ak = Math.min(an.length, 4);
        for (var am = 0; am < ak; ++am) {
            al <<= 4;
            al |= E(an.charCodeAt(am))
        }
        return al
    }
    function ac(ao) {
        var al = new b();
        var ak = ao.length;
        for (var an = ak,
        am = 0; an > 0; an -= 4, ++am) {
            al.digits[am] = O(ao.substr(Math.max(an - 4, 0), Math.min(an, 4)))
        }
        return al
    }
    function G(at, ar) {
        var ak = at.charAt(0) == "-";
        var an = ak ? 1 : 0;
        var au = new b();
        var al = new b();
        al.digits[0] = 1;
        for (var am = at.length - 1; am >= an; am--) {
            var ao = at.charCodeAt(am);
            var ap = E(ao);
            var aq = l(al, ap);
            au = g(au, aq);
            al = l(al, ar)
        }
        au.isNeg = ak;
        return au
    }
    function H(ak) {
        return (ak.isNeg ? "-": "") + ak.digits.join(" ")
    }
    function g(al, ap) {
        var ak;
        if (al.isNeg != ap.isNeg) {
            ap.isNeg = !ap.isNeg;
            ak = Y(al, ap);
            ap.isNeg = !ap.isNeg
        } else {
            ak = new b();
            var ao = 0;
            var an;
            for (var am = 0; am < al.digits.length; ++am) {
                an = al.digits[am] + ap.digits[am] + ao;
                ak.digits[am] = an & 65535;
                ao = Number(an >= V)
            }
            ak.isNeg = al.isNeg
        }
        return ak
    }
    function Y(al, ap) {
        var ak;
        if (al.isNeg != ap.isNeg) {
            ap.isNeg = !ap.isNeg;
            ak = g(al, ap);
            ap.isNeg = !ap.isNeg
        } else {
            ak = new b();
            var ao, an;
            an = 0;
            for (var am = 0; am < al.digits.length; ++am) {
                ao = al.digits[am] - ap.digits[am] + an;
                ak.digits[am] = ao & 65535;
                if (ak.digits[am] < 0) {
                    ak.digits[am] += V
                }
                an = 0 - Number(ao < 0)
            }
            if (an == -1) {
                an = 0;
                for (var am = 0; am < al.digits.length; ++am) {
                    ao = 0 - ak.digits[am] + an;
                    ak.digits[am] = ao & 65535;
                    if (ak.digits[am] < 0) {
                        ak.digits[am] += V
                    }
                    an = 0 - Number(ao < 0)
                }
                ak.isNeg = !al.isNeg
            } else {
                ak.isNeg = al.isNeg
            }
        }
        return ak
    }
    function ab(al) {
        var ak = al.digits.length - 1;
        while (ak > 0 && al.digits[ak] == 0) {--ak
        }
        return ak
    }
    function M(am) {
        var ao = ab(am);
        var an = am.digits[ao];
        var al = (ao + 1) * q;
        var ak;
        for (ak = al; ak > al - q; --ak) {
            if ((an & 32768) != 0) {
                break
            }
            an <<= 1
        }
        return ak
    }
    function aj(aq, ap) {
        var au = new b();
        var ao;
        var al = ab(aq);
        var at = ab(ap);
        var ar, ak, am;
        for (var an = 0; an <= at; ++an) {
            ao = 0;
            am = an;
            for (j = 0; j <= al; ++j, ++am) {
                ak = au.digits[am] + aq.digits[j] * ap.digits[an] + ao;
                au.digits[am] = ak & Z;
                ao = ak >>> L
            }
            au.digits[an + al + 1] = ao
        }
        au.isNeg = aq.isNeg != ap.isNeg;
        return au
    }
    function l(ak, ap) {
        var ao, an, am;
        result = new b();
        ao = ab(ak);
        an = 0;
        for (var al = 0; al <= ao; ++al) {
            am = result.digits[al] + ak.digits[al] * ap + an;
            result.digits[al] = am & Z;
            an = am >>> L
        }
        result.digits[1 + ao] = an;
        return result
    }
    function z(ao, ar, am, aq, ap) {
        var ak = Math.min(ar + ap, ao.length);
        for (var an = ar,
        al = aq; an < ak; ++an, ++al) {
            am[al] = ao[an]
        }
    }
    var r = new Array(0, 32768, 49152, 57344, 61440, 63488, 64512, 65024, 65280, 65408, 65472, 65504, 65520, 65528, 65532, 65534, 65535);
    function w(al, ar) {
        var an = Math.floor(ar / q);
        var ak = new b();
        z(al.digits, 0, ak.digits, an, ak.digits.length - an);
        var aq = ar % q;
        var am = q - aq;
        for (var ao = ak.digits.length - 1,
        ap = ao - 1; ao > 0; --ao, --ap) {
            ak.digits[ao] = ((ak.digits[ao] << aq) & Z) | ((ak.digits[ap] & r[aq]) >>> (am))
        }
        ak.digits[0] = ((ak.digits[ao] << aq) & Z);
        ak.isNeg = al.isNeg;
        return ak
    }
    var I = new Array(0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535);
    function m(al, ar) {
        var am = Math.floor(ar / q);
        var ak = new b();
        z(al.digits, am, ak.digits, 0, al.digits.length - am);
        var ap = ar % q;
        var aq = q - ap;
        for (var an = 0,
        ao = an + 1; an < ak.digits.length - 1; ++an, ++ao) {
            ak.digits[an] = (ak.digits[an] >>> ap) | ((ak.digits[ao] & I[ap]) << aq)
        }
        ak.digits[ak.digits.length - 1] >>>= ap;
        ak.isNeg = al.isNeg;
        return ak
    }
    function C(al, am) {
        var ak = new b();
        z(al.digits, 0, ak.digits, am, ak.digits.length - am);
        return ak
    }
    function k(al, am) {
        var ak = new b();
        z(al.digits, am, ak.digits, 0, ak.digits.length - am);
        return ak
    }
    function S(al, am) {
        var ak = new b();
        z(al.digits, 0, ak.digits, 0, am);
        return ak
    }
    function f(ak, am) {
        if (ak.isNeg != am.isNeg) {
            return 1 - 2 * Number(ak.isNeg)
        }
        for (var al = ak.digits.length - 1; al >= 0; --al) {
            if (ak.digits[al] != am.digits[al]) {
                if (ak.isNeg) {
                    return 1 - 2 * Number(ak.digits[al] > am.digits[al])
                } else {
                    return 1 - 2 * Number(ak.digits[al] < am.digits[al])
                }
            }
        }
        return 0
    }
    function A(ap, ao) {
        var ak = M(ap);
        var an = M(ao);
        var am = ao.isNeg;
        var av, au;
        if (ak < an) {
            if (ap.isNeg) {
                av = U(c);
                av.isNeg = !ao.isNeg;
                ap.isNeg = false;
                ao.isNeg = false;
                au = Y(ao, ap);
                ap.isNeg = true;
                ao.isNeg = am
            } else {
                av = new b();
                au = U(ap)
            }
            return new Array(av, au)
        }
        av = new b();
        au = ap;
        var ar = Math.ceil(an / q) - 1;
        var aq = 0;
        while (ao.digits[ar] < e) {
            ao = w(ao, 1); ++aq; ++an;
            ar = Math.ceil(an / q) - 1
        }
        au = w(au, aq);
        ak += aq;
        var ay = Math.ceil(ak / q) - 1;
        var aD = C(ao, ay - ar);
        while (f(au, aD) != -1) {++av.digits[ay - ar];
            au = Y(au, aD)
        }
        for (var aB = ay; aB > ar; --aB) {
            var at = (aB >= au.digits.length) ? 0 : au.digits[aB];
            var aC = (aB - 1 >= au.digits.length) ? 0 : au.digits[aB - 1];
            var aA = (aB - 2 >= au.digits.length) ? 0 : au.digits[aB - 2];
            var az = (ar >= ao.digits.length) ? 0 : ao.digits[ar];
            var al = (ar - 1 >= ao.digits.length) ? 0 : ao.digits[ar - 1];
            if (at == az) {
                av.digits[aB - ar - 1] = Z
            } else {
                av.digits[aB - ar - 1] = Math.floor((at * V + aC) / az)
            }
            var ax = av.digits[aB - ar - 1] * ((az * V) + al);
            var aw = (at * R) + ((aC * V) + aA);
            while (ax > aw) {--av.digits[aB - ar - 1];
                ax = av.digits[aB - ar - 1] * ((az * V) | al);
                aw = (at * V * V) + ((aC * V) + aA)
            }
            aD = C(ao, aB - ar - 1);
            au = Y(au, l(aD, av.digits[aB - ar - 1]));
            if (au.isNeg) {
                au = g(au, aD); --av.digits[aB - ar - 1]
            }
        }
        au = m(au, aq);
        av.isNeg = ap.isNeg != am;
        if (ap.isNeg) {
            if (am) {
                av = g(av, c)
            } else {
                av = Y(av, c)
            }
            ao = m(ao, aq);
            au = Y(ao, au)
        }
        if (au.digits[0] == 0 && ab(au) == 0) {
            au.isNeg = false
        }
        return new Array(av, au)
    }
    function ae(ak, al) {
        return A(ak, al)[0]
    }
    function D(ak, al) {
        return A(ak, al)[1]
    }
    function v(al, am, ak) {
        return D(aj(al, am), ak)
    }
    function K(al, an) {
        var ak = c;
        var am = al;
        while (true) {
            if ((an & 1) != 0) {
                ak = aj(ak, am)
            }
            an >>= 1;
            if (an == 0) {
                break
            }
            am = aj(am, am)
        }
        return ak
    }
    function J(am, ap, al) {
        var ak = c;
        var an = am;
        var ao = ap;
        while (true) {
            if ((ao.digits[0] & 1) != 0) {
                ak = v(ak, an, al)
            }
            ao = m(ao, 1);
            if (ao.digits[0] == 0 && ab(ao) == 0) {
                break
            }
            an = v(an, an, al)
        }
        return ak
    }
    function a(ak) {
        this.modulus = U(ak);
        this.k = ab(this.modulus) + 1;
        var al = new b();
        al.digits[2 * this.k] = 1;
        this.mu = ae(al, this.modulus);
        this.bkplus1 = new b();
        this.bkplus1.digits[this.k + 1] = 1;
        this.modulo = p;
        this.multiplyMod = P;
        this.powMod = x
    }
    function p(ar) {
        var aq = k(ar, this.k - 1);
        var ao = aj(aq, this.mu);
        var an = k(ao, this.k + 1);
        var am = S(ar, this.k + 1);
        var at = aj(an, this.modulus);
        var al = S(at, this.k + 1);
        var ak = Y(am, al);
        if (ak.isNeg) {
            ak = g(ak, this.bkplus1)
        }
        var ap = f(ak, this.modulus) >= 0;
        while (ap) {
            ak = Y(ak, this.modulus);
            ap = f(ak, this.modulus) >= 0
        }
        return ak
    }
    function P(ak, am) {
        var al = aj(ak, am);
        return this.modulo(al)
    }
    function x(al, ao) {
        var ak = new b();
        ak.digits[0] = 1;
        var am = al;
        var an = ao;
        while (true) {
            if ((an.digits[0] & 1) != 0) {
                ak = this.multiplyMod(ak, am)
            }
            an = m(an, 1);
            if (an.digits[0] == 0 && ab(an) == 0) {
                break
            }
            am = this.multiplyMod(am, am)
        }
        return ak
    }
    function ad(al, am, ak) {
        this.e = ac(al);
        this.d = ac(am);
        this.m = ac(ak);
        this.chunkSize = 2 * ab(this.m);
        this.radix = 16;
        this.barrett = new a(this.m)
    }
    function X(ak) {
        return (ak < 10 ? "0": "") + String(ak)
    }
    function u(at, aw) {
        var ar = new Array();
        var ak = aw.length;
        var ap = 0;
        while (ap < ak) {
            ar[ap] = aw.charCodeAt(ap);
            ap++
        }
        while (ar.length % at.chunkSize != 0) {
            ar[ap++] = 0
        }
        var aq = ar.length;
        var ax = "";
        var ao, an, am;
        for (ap = 0; ap < aq; ap += at.chunkSize) {
            am = new b();
            ao = 0;
            for (an = ap; an < ap + at.chunkSize; ++ao) {
                am.digits[ao] = ar[an++];
                am.digits[ao] += ar[an++] << 8
            }
            var av = at.barrett.powMod(am, at.e);
            var au = at.radix == 16 ? F(av) : T(av, at.radix);
            ax += au + " "
        }
        return ax.substring(0, ax.length - 1)
    }
    function h(ao, ap) {
        var ar = ap.split(" ");
        var ak = "";
        var an, am, aq;
        for (an = 0; an < ar.length; ++an) {
            var al;
            if (ao.radix == 16) {
                al = ac(ar[an])
            } else {
                al = G(ar[an], ao.radix)
            }
            aq = ao.barrett.powMod(al, ao.d);
            for (am = 0; am <= ab(aq); ++am) {
                ak += String.fromCharCode(aq.digits[am] & 255, aq.digits[am] >> 8)
            }
        }
        if (ak.charCodeAt(ak.length - 1) == 0) {
            ak = ak.substring(0, ak.length - 1)
        }
        return ak
    }
    return {
        create: function(al, ak) {
            y(131);
            al = al || "010001";
            ak = ak || "C95316D91A63CEB508E442396A6F6F29EDDDEDAB8FF483EE9B2862DB5E999FA5";
            return new ad(al, "", ak)
        },
        encode: function(ak, al) {
            if (typeof al == "undefined") {
                al = ak;
                ak = this.create()
            }
            return u(ak, al)
        },
        decode: h
    }
})();