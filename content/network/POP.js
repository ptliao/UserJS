var Socket = gw.require('Socket');
var socket = Socket({
	host: 'pop.qq.com',
	port: 110
}).open().async({
	start: function () {
		console.log('start');
	},
	stop: function () {
		console.log('stop');
	},
	receiveData: function (date, socket) {
		console.log(date);
	}
});

start
bug.user.js (第 40 行)
+OK QQMail POP3 Server v1.0 Service Ready(QQMail v2.0)
bug.user.js (第 46 行)
>>> socket.write('USER '+userName+'\r\n');
15
+OK
bug.user.js (第 46 行)
>>> socket.write('PASS '+password+'\r\n');
20
+OK
bug.user.js (第 46 行)
>>> socket.write('STAT\r\n');
6
+OK 64 1233703
bug.user.js (第 46 行)
>>> socket.write('LIST\r\n');
6
+OK
bug.user.js (第 46 行)
1 5082 2 18287 3 18299 4 18298 5 11839 6 10802 7 18420 8 13447 9 18521 10 13189 11 13836 12 13843 13 10567 14 9264 15 9264 16 9265 17 5224 18 16190 19 12280 20 13482 21 45689 22 13336 23 18411 24 18354 25 18386 26 18241 27 18351 28 18484 29 16186 30 13317 31 16189 32 13756 33 16187 34 13824 35 13254 36 13378 37 13378 38 13593 39 13593 40 13378 41 13409 42 13592 43 13378 44 13380 45 13592 46 35761 47 13281 48 16186 49 16187 50 37345 51 37016 52 37970 53 7161 54 10931 55 36048 56 125163 57 121339 58 18684 59 10592 60 1793 61 321 62 494 63 502 64 40894 .
bug.user.js (第 46 行)
>>> socket.write('UIDL\r\n');
6
+OK
bug.user.js (第 46 行)
1 ZC1422-LeKTz5IGWw~0Q0YJzG9CJ25 2 ZC2822-5inkTxK7lMB7Pzp1TBnkS25 3 ZC4122-EN~ohttx9aEaSUwDMvffH25 4 ZC1022-ZarS8q8FSh6lOz5xjOnmW25 5 ZC0423-Iu22I371QBSoRUAPgL7dK25 6 ZC2923-QI8jH0LmQRWpHxpV8OAjP25 7 ZC0326-GtXzVgu5Gk7xfHk2WKP2M25 8 ZC1026-WJdRHUCm0IREa24h7iXLH25 9 ZC3626-SoU0bDHfz5tbJyJtgCKaL25 10 ZC0228-7yBqG0YWG0~NPjt0T~dpf25 11 ZC2728-ikUlXQB0qv49SE0CvfnJV25 12 ZC2728-I~yMuOWR9qJhKSxj_GVzO25 13 ZC0231-_DNM4r~w7rp9PTh3xMlZV25 14 ZC0602-tnmIi9bU4bV8Pjt0uvLrW26 15 ZC1202-Gda1OGVtrvozBAFOginlE26 16 ZC2102-PPMGKnd9CV2UIyZpBfyaN26 17 ZC1702-5in_TxIcksYPen8w4fYZI26 18 ZC4003-YK~A2ofzF0OIc3Y5u_FNG26 19 ZC2804-k1yFZTgqCl6SRkMM7t3OQ26 20 ZC0608-sH86QB0Kms4fNzJ9aSacd26 21 ZC0608-SoWEFUjUgNQFCg9AJflmB26 22 ZC4108-O_SPFElBey_9bWgnWM5cL26 23 ZC0209-Bcq4vOFt7rpocnc4qplHQ26 24 ZC1509-v3ADXgOPcCT2GB1SKfwFM26 25 ZC3609-mlVDSRSFkcUXGRxT0u5GY26 26 ZC2409-ikVSnsNSRRHDDQhHVpG4I26 27 ZC2409-4yw7eSS1SR3Pcnc4AjpZO26 28 ZC4109-unUpVQifIHSmfHk273tJb26 29 ZC3809-9TqzXAHVHkqYRkMMLVzJa26 30 ZC2809-jEN8OGWAsOQ2RUAPE2BdA26 31 ZC2809-cL~AHEGkRRHDNjN8ni5KP26 32 ZC2809-5CsUxpt~UQXXUFUaEJuCD26 33 ZC4009-V5g8aTTfgtYEAwZJKGeGN26 34 ZC3009-CMdi5bhTaT3vb2olFbx3X26 35 ZC3009-OfZTZDnSLXmrAAVKyP2PX26 36 ZC3009-IO92Yj_Ir_spd3I99m3IP26 37 ZC3709-mFcvG0ZFofUmV1IdBrvSZ26 38 ZC3709-om0VRxoZfCj7Oz5xSaqQT26 39 ZC3709-v3AILXBzFUGSEBVaAljLC26 40 ZC2409-U5zl0YyP~698f3o1MUfKK26 41 ZC2409-DsG4kczPhNADDQhHwKLTJ26 42 ZC0609-PvGL
bug.user.js (第 46 行)
NWhrPWm6Z2ItWleOB26 43 ZC0609-Bcqw4L2~QRXGJSBvganfB26 44 ZC0609-ywR~FUhL_qp5JiNs4OIQU26 45 ZC0609-5CtQLnNwdyPwWVwTvbGYX26 46 ZC4009-3hHqs~7rRhLBPjt04kQ2W26 47 ZC2409-lVp7ZzokSx_MNTB_lO1gc26 48 ZC2409-5ikIgt_BzZlKPDl2RLAEY26 49 ZC1509-0R7UOmdV9qJxERRbJrACG26 50 ZC0409-CMeG5bjIsOQ3BQBPAYloU26 51 ZC0110-I~wwfyJYue05HhtUfeGhW26 52 ZC2011-kl1qFUhc0oZTICVqMvbLM26 53 ZC3713-nVI5Kne6x5NEUFUar3xPa26 54 ZC1613-oW7QjtMtit4JGRxTlsZHB26 55 ZC2715-KuWcBViXpfErCg9AQ1tWP26 56 ZC2316-ToEiThO6NmK5Oz5xhXZOJ26 57 ZC1118-yQZP2YTUrPgmaG0i4p81U26 58 ZC0120-Jerb_qPsRBDxMDV69QnAJ26 59 ZC2420-4S5g5Lkv34tqCg9ARFguZ26 60 ZC1221-q2RPmcQVh9MxdHE~PH4xI26 61 ZC1721-cb4VBViMBFCyJSBv3F3zD26 62 ZC1421-ywRQxZhO14NheH0yhS8AF26 63 ZC1021-KeaKs~42diLAJSBvCxttQ26 64 ZC1521-xgn1PmO7PGiKKC1iezSIT26 .
bug.user.js (第 46 行)
>>> socket.write('RETR 1\r\n');
8
+OK
bug.user.js (第 46 行)
Received: from app2oplinux06 (unknown [172.16.202.16]) by cmgsmtp02 (Coremail) with SMTP id hKwQrJC7z+nxjrtPU4VJAA--.103S4; Tue, 22 May 2012 21:04:53 +0800 (CST) MIME-Version: 1.0 From: fetion_pc2@139.com To: <754488567@139.com> Date: 22 May 2012 21:04:07 +0800 Subject: =?utf-8?B?6aOe5L+hMjAxMiDmmajmm6bniYjogZTpgJrjgIHnlLXkv6Hl?= =?utf-8?B?pb3lj4vmg7PliqDlsLHliqA=?= Content-Type: text/html; charset=utf-8 Content-Transfer-Encoding: base64 X-OP_RICHINFO_MAILTYPE: 0 Message-ID: <609a36f6-b15a-4d8a-9f66-ec4b51a6d5f3> x-buss-id: 1384 x-acc-id: 1385 x-cat-id: 305000000 x-dest-days: 0 x-folder-id: 1 X-CM-TRANSID:hKwQrJC7z+nxjrtPU4VJAA--.103S4 X-Coremail-Antispam: 1UD129KBjDUn29KB7ZKAUJUUUUU529EdanIXcx71UUUUU7v73 VFW2AGmfu7bjvjm3AaLaJ3UjIYCTnIWjp_UUU5K7k042IEOx8S6IIYrwAYjxAI6xAIw28I cVW8Ww4lb7IF0VCFIxCj07C26xCIbckI1I0E14v7M7k042IEIxkG67AtM7k0a2IF6w4kM7 kC6x804xWl1xkIjI8I6I8E6xAIw20EY4v20xvaj40_Wr0E3s1ln4vEF2I2jVACjxCF4IxY O2xFxVAqrcv_JFW8Gr1kMc8Ij28IcVCI42IY67xGrVAGz7A0rwAqx4xG6cxCj2AI64AKrs I_XF1l5I8CrVAvF7xS0VCYjI8vzVWUXwAqx4xG64x03VAFz4kmzcxKxVAvF2CEx7xS67AK xVWUtwAqx4xG6xAIxVCFxsxG0wAqx4xG6I8Ex7xG6cxCeVC2j2CE14v26r1DMcIj6x8Erc xFaVAv8VWrMcIj6I8E87Iv67AKxVWUJVW8JwACjcxG0xvEwIxGrwACY4xI67k04243AVAY r7xKoxWlFcxC0VAYjxAxZF0Ew4CEw7xC0wACY4xI6c02F40Ez4kGawAKzx0Yzs0v6xACxx 1lw4CE7480Y4vE14AKx2xKxVC2ax8xM4kE6xkIj40Ew7xC0wCjc4CqaVCFI7km07C267AK xwCF04k20xvY0x0EwIxGrwCF04k20xvE74AGY7Cv6cx26r43MxCIbckI1I0E14v26rWUJr 0E3s0q3wCFI7vE84CIb48I67vvx24l4IxY624lx4CE17CEb7AF67AKxVWUJVWUXwCIc40Y 0x0EwIxGrwCE64xvF2IEb7IF0Fy7YxBIdaVFxhVjvjDU0xZFpf9x0zRUUUUUUUUU= X-CM-SenderInfo: qryyiiirrylkyu6rjmoofrz/ X-QQ-Popagent-Recv: YJDke/NVRGxs/q0PufR5rWdMb/zQESa2 X-QQ-mid: popa17t1337693297t882t11840 PGh0bWw+DQoNCjxoZWFkPg0KPG1ldGEgaHR0cC1lcXVpdj0iQ29udGVudC1UeXBl IiBjb250ZW50PSJ0ZXh0L2h0bWw7IGNoYXJzZXQ9Z2IyMzEyIiAvPg0KPHRpdGxl PuaXoOagh+mimDwvdGl0bGU+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KDQpi b2R5e2JhY2tncm91bmQtY29sb3I6ICNmZmY7bWFyZ2luLWxlZnQ6MHB4O21hcmdp bi10b3A6IDBweDttYXJnaW4tcmlnaHQ6IDBweDttYXJnaW4tYm90dG9tOiAwcHg7 fQ0KaW1ne2Rpc3BsYXk6YmxvY2s7Ym9yZGVyOjB9DQphe2JvcmRlcjowfQ0KLnRj e3dpZHRoOjY1MHB4O21hcmdpbjowIGF1dG87fQ0KdGR7dGV4dC1hbGlnbjpjZW50 ZXI7Zm9udC1zaXplOjEycHg7Zm9udC1mYW1pbHk65a6L5L2TO30NCnRkIGF7Y29s b3I6IzA1MGJmZTsgdGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZTt9DQoNCjwvc3R5 bGU+DQo8L2hlYWQ+DQo8Ym9keSBiZ2NvbG9yPSIjRUFFREVGIiBsZWZ0bWFyZ2lu PSIwIiB0b3BtYXJnaW49IjAiIG1hcmdpbndpZHRoPSIwIiBtYXJnaW5oZWlnaHQ9 IjAiIHN0eWxlPSJtYXJnaW46MDsgcGFkZGluZzowOyI+DQo8aW1nIHN0eWxlPSJ3 aWR0aDoxcHg7IGhlaWdodDoxcHgiIHNyYz0iaHR0cDovLzIyMS4xMzAuNDUuMjE1 L2VkbXdzL09wZW5Db3VudC5hc2h4P289MEdocGZmUG9QamszczV0V3dSb3hBSW1o cjlBekglMmJDbUZxQnFpQzdya2JtWG9pVjh2cUNPd0lmWEltN0ZZbHRFNGZKYW81 TVB5OVZkc2FpaWl4cE8zQSUzZCUzZCIgLz4NCjx0YWJsZSB3aWR0aD0iNjUwIiBo ZWlnaHQ9IjgwMCIgYm9yZGVyPSIwIiBhbGlnbj0iY2VudGVyIiBjZWxscGFkZGlu Zz0iMCIgY2
bug.user.js (第 46 行)
VsbHNwYWNpbmc9IjAiIGNsYXNzPSJ0YyI+DQoJPHRyPg0KCQk8dGQg c3R5bGU9InRleHQtYWxpZ246cmlnaHQ7aGVpZ2h0OjE2cHg7bGluZS1oZWlnaHQ6 MTZweCI+5aaC5p6c5pys6YKu5Lu25LiN6IO95q2j5bi45pi+56S677yMPGEgaHJl Zj0iaHR0cDovL2ZlaXhpbi4xMDA4Ni5jbi9kb3dubG9hZC9wY2NsaWVudC8iIHRh cmdldD0iX2JsYW5rIj7or7fngrnlh7vov5nph4w8L2E+PC90ZD4NCgk8L3RyPg0K CTx0cj4NCgkJPHRkPjxpbWcgc3JjPSJodHRwOi8vaW1nbC5mZXRpb25waWMuY29t L2ZpbGVzL3RvcGljLzUzMC9pbWcxLmpwZyIgYm9yZGVyPSIwIiB1c2VtYXA9IiNN YXAiIC8+PC90ZD4NCgk8L3RyPg0KCTx0cj4NCgkJPHRkPjxhIGhyZWY9Imh0dHA6 Ly9mZWl4aW4uMTAwODYuY24vZG93bmxvYWQvcGNjbGllbnQvIiB0YXJnZXQ9Il9i bGFuayI+PGltZyBzcmM9Imh0dHA6Ly9pbWdsLmZldGlvbnBpYy5jb20vZmlsZXMv dG9waWMvNTMwL2ltZzIuanBnIiAvPjwvYT48L3RkPg0KCTwvdHI+DQoJPHRyPg0K CQk8dGQ+PGEgaHJlZj0iaHR0cDovL2ZlaXhpbi4xMDA4Ni5jbi9kb3dubG9hZC9w Y2NsaWVudC8iIHRhcmdldD0iX2JsYW5rIj48aW1nIHNyYz0iaHR0cDovL2ltZ2wu ZmV0aW9ucGljLmNvbS9maWxlcy90b3BpYy81MzAvaW1nMy5qcGciIC8+PC9hPjwv dGQ+DQoJPC90cj4NCgk8dHI+DQoJCTx0ZD48YSBocmVmPSJodHRwOi8vZmVpeGlu LjEwMDg2LmNuL2Rvd25sb2FkL3BjY2xpZW50LyIgdGFyZ2V0PSJfYmxhbmsiPjxp bWcgc3JjPSJodHRwOi8vaW1nbC5mZXRpb25waWMuY29tL2ZpbGVzL3RvcGljLzUz MC9pbWc0LmpwZyIgLz48L2E+PC90ZD4NCgk8L3RyPg0KCTx0cj4NCgkJPHRkPjxh IGhyZWY9Imh0dHA6Ly9mZWl4aW4uMTAwODYuY24vZG93bmxvYWQvcGNjbGllbnQv IiB0YXJnZXQ9Il9ibGFuayI+PGltZyBzcmM9Imh0dHA6Ly9pbWdsLmZldGlvbnBp Yy5jb20vZmlsZXMvdG9waWMvNTMwL2ltZzUuanBnIiAvPjwvYT48L3RkPg0KCTwv dHI+DQoJPHRyPg0KCQk8dGQ+PGEgaHJlZj0iaHR0cDovL2ZlaXhpbi4xMDA4Ni5j
bug.user.js (第 46 行)
bi9kb3dubG9hZC9wY2NsaWVudC8iIHRhcmdldD0iX2JsYW5rIj48aW1nIHNyYz0i aHR0cDovL2ltZ2wuZmV0aW9ucGljLmNvbS9maWxlcy90b3BpYy81MzAvaW1nNi5q cGciIC8+PC9hPjwvdGQ+DQo8L3RyPg0KICAgIDx0cj48dGQgaGVpZ2h0PSIxNiI+ 5aaC5p6c5oKo5LiN5oS/5oSP5YaN5pS25Yiw5q2k57G76YKu5Lu277yM6K+3PGEg aHJlZj0iaHR0cDovLzIyMS4xMzAuNDUuMjE1L2VkbXdzL1VuU3Vic2NyaWJlLmFz aHg/dT0wR2hwZmZQb1BqbFd3eEZtJTJmZCUyYm91Nm9QZ2hIZnZQQXdodlZIN240 bUN2VFEwME1mJTJmeHRIdGxDQWt4UWt0dUl0VlMwQlE2b2FxZUtldEdodFc1UHRl USUzZCUzZCI+54K55Ye76L+Z6YeMPC9hPumAgOiuojwvdGQ+PC90cj4NCjwvdGFi bGU+DQoNCg0KPG1hcCBuYW1lPSJNYXAiPg0KICA8YXJlYSBzaGFwZT0icmVjdCIg Y29vcmRzPSI0MzgsNDMsNjA1LDEwMSIgaHJlZj0iaHR0cDovL2ZlaXhpbi4xMDA4 Ni5jbi9kb3dubG9hZC9wY2NsaWVudC8iIHRhcmdldD0iX2JsYW5rIi8+DQo8L21h cD4NCjwvYm9keT4NCjwvaHRtbD4= 