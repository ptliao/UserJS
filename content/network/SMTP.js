var Socket = gw.require('Socket');
var socket = Socket({
	host: 'smtp.qq.com',
	port: 25
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

bug.user.js (第 43 行)
start
bug.user.js (第 40 行)
220 smtp.qq.com Esmtp QQ Mail Server
bug.user.js (第 46 行)
>>> socket.write('HELO smtp.qq.com\r\n');
18
250 smtp.qq.com
bug.user.js (第 46 行)
>>> socket.write('AUTH LOGIN\r\n');
12
334 VXNlcm5hbWU6
bug.user.js (第 46 行)
>>> socket.write(base64(userName)+'\r\n');
14
334 UGFzc3dvcmQ6
bug.user.js (第 46 行)
>>> socket.write(base64(password)+'\r\n');//base64编码
22
235 Authentication successful
bug.user.js (第 46 行)
>>> socket.write('MAIL FROM: 89415119@qq.com\r\n');
28
250 Ok
bug.user.js (第 46 行)
>>> socket.write('RCPT TO: 89415119@qq.com\r\n');
26
250 Ok
bug.user.js (第 46 行)
>>> socket.write('DATA\r\n');
6
354 End data with <CR><LF>.<CR><LF>
bug.user.js (第 46 行)
>>> socket.write('Date: 2 Nov 81 22:33:44\r\n');
25
>>> socket.write('From: John Q. Public <JQP@MIT-AI.ARPA>\r\n');
40
>>> socket.write('To: Jones@BBN-Vax.ARPA\r\n');
24
>>> socket.write('Subject: Mail System Problem<JQP@MIT-AI.ARPA>\r\n');
47
>>> socket.write('\r\n');
2
>>> socket.write('Sorry JOE, your message to SAM@HOSTZ.ARPA lost.\r\n');
49
>>> socket.write('HOSTZ.ARPA said this:\r\n');
23
>>> socket.write('"550 No Such User"\r\n');
20
>>> socket.write('.\r\n');
3
250 Ok: queued as
bug.user.js (第 46 行)
stop
bug.user.js (第 43 行)