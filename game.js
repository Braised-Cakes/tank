var oC = document.getElementById('c1');
	var cxt = oC.getContext('2d');
	var oBox = document.getElementById('box');
	var oAudio = document.getElementsByClassName('audio');
	var iBoom = document.getElementById('iBoom');
	var iFrag = document.getElementById('iFrag');
	var iMisc = document.getElementById('iMisc');
	var iTank = document.getElementById('iTank');
	var iTerr = document.getElementById('iTerr');
	var iUI = document.getElementById('iUI');
	var allBrick = [],	//全部砖块
		allTank = [],	//全部坦克数据
		allBullet = [],	//全部子弹
		allSmallBoom = [],	//小的爆炸
		allBigBoom = [],	//大的爆炸
		allHideScore = [],	//敌人消失后产生的分数
		spirit = [],
	 	tank1 = {id:'tank1'},
		tank2 = {id:'tank2'},
		rivers = { tick:0,arr:[]},
		enemy = { tick : 0, created : 0, nowNum : 0, maxNum : 0, allNum : 20, hideNum : 0},
		fixedTime = { is: false,tick:0},
		baseProtect = { is:false},
		game = {status : 0,twoGame:false,tank1Life:3,tank2Life:3,tank1Type:1,tank2Type:1, nowPass : 0, over : false, overTick : 0,overY : 500, toNext : false, toNextTick:0, createdtankNum : 0, tick : 0, w : 538, h : 490, num : 0},
		uiStart = { status : 0};
		map = {w : 416, h : 416, row : 26, column : 26, brickW : 16, brickH : 16, translateX : 36, translateY : 36, base : [636, 637, 662, 663], nearBase : [609, 610, 611, 612, 635, 638, 661, 664]},
		bonus = [0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0],
		mapEditor = {diyMap : [], type : 1, selectorLeft : 450, selectorNum : 6, selectorBorderColor : 'red', selectorBorderWidth : 5, selectorClearWidth : 50, selectorClearHeight : 200, comeGameBorderColor : 'red', comeGameBorderX : 425, comeGameBorderY : 210, comeGameBorderW : 70, comeGameBorderH : 30, comeGameText : "开始游戏", comeGameFont : "16px Arial", comeGameColor : "black", comeGameX : 428, comeGameY : 230},
		uiScore = {status:1},
		score = [0,0,0,0,0],
		uiOver = {};
	//game.status 0:需要进行开始，1游戏中，2分数界面，3OVER
	setInterval(function(){
		if(game.status === 0){
			UIStart();
		}else if(game.status === 1){
			UIGame();
		}else if(game.status === 2){
			UIScore();	
		}else if(game.status === 3){
			UIOver();
		}
	}, 16);
	function getPass(){
		if(uiStart.num<0){
			uiStart.num = 0;	
		}else if(uiStart.num>2){
			uiStart.num = 2;	
		}
		switch(uiStart.num){
			case 0:uiStart.y = 275;game.twoGame = false;break;	
			case 1:uiStart.y = 307;game.twoGame = true;break;	
			case 2:uiStart.y = 339;break;	
		}
	};
	function setPass(){
		switch(uiStart.num){
			case 0:break;	
			case 1:break;	
			case 2:RenderBg();uiStart.status = 999;InitMapEditor();break;	
		}
	}
	document.onkeydown = function(ev){
		var ev = ev||event;
		var key = ev.keyCode;
		if(game.status === 0){
			if((ev.keyCode === 13||ev.keyCode === 32) && uiStart.status === 1){
				uiStart.y = 0;
				RenderUIStart();
				uiStart.status = 2;
				uiStart.y = 275;
				uiStart.num = 0;
			}else if((ev.keyCode === 87 ||ev.keyCode === 38)&& uiStart.status === 2){
				uiStart.num--;getPass();RenderUIStart();
			}else if((ev.keyCode === 83 || ev.keyCode === 40) && uiStart.status === 2){
				uiStart.num++;getPass();RenderUIStart();
			}
			else if((ev.keyCode === 13||ev.keyCode === 32)&& uiStart.status === 2){
				uiStart.status = 3;
				uiStart.y = 0;
				setPass();
			}else if((ev.keyCode === 87 ||ev.keyCode === 38) && uiStart.status === 4){
				if(game.nowPass < mapData.length - 1){	
					game.nowPass++;
				}else{
					game.nowPass = mapData.length - 1;	
				}
			}else if((ev.keyCode === 83 || ev.keyCode === 40) && uiStart.status === 4){
				if(game.nowPass !== 0){
					game.nowPass--;
				}
			}else if((ev.keyCode === 13||ev.keyCode === 32) && uiStart.status === 4){
				uiStart.status = 5;
				uiStart.tick = 0;
			}	
		}else if(game.status === 1){
			if(game.over){
				return;	
			}
			if(tank1.status === 2){
				tank1.bufferDis = 0;
				(key === 87 || key === 83 || key === 65 || key === 68) && (tank1.oldDir = tank1.dir);
				switch(key){
					case 87 : tank1.dir = 't'; tank1.moveT = true; break;
					case 83 : tank1.dir = 'b'; tank1.moveB = true; break;
					case 65 : tank1.dir = 'l'; tank1.moveL = true; break;
					case 68 : tank1.dir = 'r'; tank1.moveR = true; break;
					case 74 : if(tank1.bullet){InitBullet(tank1);tank1.bullet = false;} break;
				}
			}
			if(tank2.status === 2){
				tank2.bufferDis = 0;
				(key === 37 || key === 38 || key === 39 || key === 40) && (tank2.oldDir = tank2.dir);
				switch(key){
					case 38 : tank2.dir = 't'; tank2.moveT = true; break;
					case 40 : tank2.dir = 'b'; tank2.moveB = true; break;
					case 37 : tank2.dir = 'l'; tank2.moveL = true; break;
					case 39 : tank2.dir = 'r'; tank2.moveR = true; break;
					case 13 : if(tank2.bullet){InitBullet(tank2);tank2.bullet = false;} break;
				}
			}
		}
	};
	document.onkeyup = function(ev){
		var ev = ev||event;
		switch(ev.keyCode){
			case 87 : tank1.moveT = false; break;
			case 83 : tank1.moveB = false; break;
			case 65 : tank1.moveL = false; break;
			case 68 : tank1.moveR = false; break;
			case 74 : tank1.bullet = true; break;
			
			case 38 : tank2.moveT = false; break;
			case 40 : tank2.moveB = false; break;
			case 37 : tank2.moveL = false; break;
			case 39 : tank2.moveR = false; break;
			case 13 : tank2.bullet = true; break;
		}
	};
	//声音
	function Sound(src,volume){
		var audio = new Audio();
		audio.className = 'nnn'
		audio.src = 'music/'+src+'.mp3';
		volume && (audio.volume = volume)
		audio.autoplay = true;
	}
	
	//开始界面
	function UIStart(){
		//status==1?开始图像整体上移
		if(uiStart.status === 0){
			game.nowPass = 0;
			uiStart.status = 1;
			uiStart.y = 448;
			uiStart.tick = 0;
		}else if(uiStart.status === 1){
			if(uiStart.y > 0){
				uiStart.y -= 2;
				RenderUIStart();
			}else{
				uiStart.y = 275;
				uiStart.status = 2;
			}
		}
		//status==2?出现小坦克，并且小坦克轮胎时刻变化
		else if(uiStart.status === 2){
			if(uiStart.tick % 4 < 2){
				RenderUIStart();
			}
			uiStart.tick++;
		}
		//status==3?幕布向中间收拢
		else if(uiStart.status === 3){
			if(uiStart.y < game.h / 2){
				uiStart.y += 10;
				RenderUIStart();
			}else{
				uiStart.status = 4;
			}
		}
		//status==4?选关界面
		else if(uiStart.status === 4){
				RenderUIStart();
		}
		//status=5?延迟一段时间
		else if(uiStart.status === 5){
			if(uiStart.tick === 0){
				ReSetData();
				InitMap();	
				Sound('start');
			}
			uiStart.tick++;
			if(uiStart.tick === 10){
				RenderUIStart();
			}else if(uiStart.tick === 100){
				uiStart.status = 6;
				uiStart.y = 208;
			}
		}
		//status==6?幕布向两侧收回
		else if(uiStart.status === 6){
			if(uiStart.y > 0){
				uiStart.y -= 8;
				RenderBg();
				RenderMap();
				RenderUIStart();
			}else{
				game.status = 1;
				game.tank1Life !== 0 && InitTank('tank1');
				if(game.twoGame){
					game.tank2Life !== 0 && InitTank('tank2');
				}
				RenderSideBar();
			}
		}
	};
	//渲染UIStart
	function RenderUIStart(){
		cxt.save();
		if(uiStart.status === 1){
			cxt.clearRect(0,0, game.w, game.h);
			cxt.font = "22px Arial Black";
			cxt.fillStyle = "#fff";
			cxt.fillText("I-         00   HI-20000", 36, uiStart.y + 75);
			cxt.drawImage(iUI, 0, 0, 376, 140, 57, uiStart.y + 110, 376,140);
			cxt.fillText("1 PLAYER", 190, uiStart.y + 300);
			cxt.fillText("2 PLAYERS", 190, uiStart.y + 330);
			cxt.fillText("CONSTRUCTION", 190, uiStart.y + 360);
		}else if(uiStart.status === 2){
			cxt.fillRect(150,275,32,96);
			uiStart.tick % 2 === 0 ? cxt.drawImage(iTank, 1152, 0, 32, 32, 150, uiStart.y, 32, 32) : cxt.drawImage(iTank, 1728, 0, 32, 32, 150, uiStart.y, 32, 32);
		}else if(uiStart.status === 3){
			cxt.clearRect(0, 0, game.w, game.h);
			cxt.fillStyle = '#666';
			cxt.fillRect(0, 0, game.w, uiStart.y);
			cxt.fillRect(0, game.h - uiStart.y, game.w, uiStart.y);
		}else if(uiStart.status === 4){
			cxt.clearRect(0, 0, game.w, game.h);
			cxt.fillStyle = '#666';
			cxt.fillRect(0, 0, game.w, game.h);
			cxt.fillStyle = '#000';
			cxt.font = "22px Arial Black";
			cxt.fillText("STAGE  " + (game.nowPass + 1), 200, 240);
		}else if(uiStart.status === 5){
			cxt.clearRect(0, 0, game.w, game.h);
			cxt.fillStyle = '#666';
			cxt.fillRect(0, 0, game.w, game.h);
			cxt.fillStyle = '#000';
			cxt.font = "22px Arial Black";
			cxt.fillText("STAGE  " + (game.nowPass + 1), 200, 240);
		}else if(uiStart.status === 6){
			cxt.fillStyle = '#666';
			cxt.fillRect(map.translateX, map.translateY, map.w, uiStart.y);
			cxt.fillRect(map.translateX, map.translateY + map.h - uiStart.y, map.w, uiStart.y);
		}
		cxt.restore();
	};
	//游戏界面
	function UIGame(){
		fixedTime.is && FixedTime();
		game.tick++;
		initNpc();
		var arr = GetBrick(5);
		clear();
		RenderSpecifyBrick(arr, 5);
		RenderSpecifyBrick(arr, 1);
		RenderSpecifyBrick(arr, 2);
		Move();
		ChangedRivers();
		SmallBoom();
		BigBoom();
		HideScore();
		Spirit();
		BulletMove();	
		
		game.toNext && ToNextTick();
		game.over && GameOverTipTick();
		baseProtect.is && BaseProtect();
		RenderTank();
		RenderSpecifyBrick(arr, 4);
		RenderBullet();
		RenderSmallBoom();
		RenderBigBoom();
		RenderHideScore();
		RenderSpirit();
		RenderSpecifyBrick(arr, 3);
	};
	
	//重置全部变量
	function ReSetData(){
		allBrick.length = allTank.length = allBullet.length = allSmallBoom.length = allBigBoom.length = allHideScore.length = spirit.length = 0;
		tank1 = { id : 'tank1'};
		rivers = { tick : 0, arr : []};
		enemy = { tick : 0, initFir : 1, initNoFir : 3, created : 0, nowNum : 0, maxNum : 4, allNum : enemyData[game.nowPass].length, hideNum : 0};
		fixedTime = { is : false, tick : 0};
		baseProtect = { is : false};
		game.tick = 0;
		game.createdtankNum = 0;
		game.toNext = false;
		game.toNextTick = 0;
		game.over = false;
		game.overTick = 0;
		game.overY = 500;
		game.num = 0;
		score = [0,0,0,0,0];
	};
	//渲染底色
	function RenderBg(){	
		cxt.save();
		cxt.fillStyle = '#666';
		cxt.fillRect(0, 0, game.w, game.h);
		cxt.restore();
	}
	//渲染侧边栏
	function RenderSideBar(){
		cxt.save();
		cxt.fillStyle = '#666';
		cxt.fillRect(490, 35, 45, 400);
		// 剩余敌军坦克数量
		for(var i = 0; i < enemy.allNum - enemy.created; i++){
			cxt.drawImage(iMisc, 0, 16, 16, 16, i % 2 * 16 + 490, parseInt(i / 2) * 16 + 35, 16, 16);
		}
		// 玩家1的信息
		cxt.fillStyle = '#000';
		cxt.font = '20px impact';
		cxt.fillText('1    P', 495, 260); 
		cxt.drawImage(iMisc, 16, 16, 16, 16, 495, 270, 16, 16);
		cxt.fillText(tank1.life ? tank1.life-1 : 0, 515, 286);
		// 玩家2的信息
		if(game.twoGame){
			cxt.fillStyle = '#000';
			cxt.font = '20px impact';
			cxt.fillText('2    P', 495, 310); 
			cxt.drawImage(iMisc, 16, 16, 16, 16, 495, 320, 16, 16);
			cxt.fillText(tank2.life ? tank2.life-1 : 0, 515, 336);
		}
		//游戏关卡信息
		cxt.drawImage(iMisc, 128, 0, 32, 32, 495, 360, 32, 32);
		cxt.fillText( game.nowPass + 1, 510, 410); 
		cxt.restore();	
	};
	
	
	//初始化地图
	function InitMap(){
		var len = mapData[game.nowPass].length;
		var btn;
		if( mapEditor.diyMap.length !== 0){
			btn = true;
			if(game.nowPass === 0){
				btn = true;	
			}else{
				btn = false;	
			}
		}else{
			btn = false;	
		}
		//设置每个砖块的属性
		for(var i = 0; i < len; i++){
			var stopMove = false, base = false;
			var type = !btn ? mapData[game.nowPass][i] : mapEditor.diyMap[i];
			(type === 1 || type === 2 || type === 4 || type === 6 || type === 7 || type === 8 || type === 9) && (stopMove = true);
			(type === 6 || type === 7 || type === 8 || type === 9) && (base = true);
			var obj = {x : i % map.column * map.brickW, y : parseInt(i / map.row) * map.brickH, w : map.brickW, h : map.brickH, bgX : type * 16, bgY : 0, type : type, stopMove : stopMove, base : base};
			allBrick.push(obj);
			// 河流单独存放在一个数组，因为是动态的砖块
			type === 4 && rivers.arr.push(i);	
		}
		mapEditor.diyMap.length = 0;
	};
	//渲染地图
	function RenderMap(){	
		cxt.save();
		cxt.translate(map.translateX, map.translateY);
		cxt.fillStyle = '#000';
		cxt.fillRect(0, 0, map.w, map.h);
		var len = mapData[game.nowPass].length;
		//type = 0的砖块为黑色，和地图底色一样，无需再次渲染
		for(var i  =0; i < len; i++){
			var obj = allBrick[i];
			obj.type !== 0 && cxt.drawImage(iTerr, obj.bgX, obj.bgY, obj.w, obj.h, obj.x, obj.y, obj.w, obj.h);
		}
		cxt.restore();
	};
	
	//初始化坦克////////////////////////////////////////////////
	function InitTank(id,btn){
		var obj = id === 'npc' ? { id : 'npc'} : id==='tank1' ? tank1 : tank2;
		obj.moveT = obj.moveB = obj.moveL = obj.moveR = false;
		obj.status = 0;	// 0:开始前兆，1:正在前兆，2:正常状态
		obj.w = obj.h = 32;	//宽度高度
		obj.speed = 2;	//移动速度
		obj.tyre = 0;	//轮胎 0————448
		obj.bulletNowLen = 0;	//当前存在的子弹数量
		obj.buffer = false;	//是否缓冲
		obj.bufferDis = 0;	//缓冲距离
		obj.repeatArr = [];
		obj.repeat = false;
		if(obj.id !== 'npc'){
			obj.dir = 't';	//初始方向
			obj.id === 'tank1' && (obj.x = 128, obj.y = 384);
			obj.id === 'tank2' && (obj.x = 256, obj.y = 384);
			obj.id === 'tank1' && (obj.life = !btn ? game.tank1Life : obj.life);
			obj.id === 'tank2' && (obj.life = !btn ? game.tank2Life : obj.life);
			obj.id === 'tank1' && (obj.type = !btn ? game.tank1Type : 1);
			obj.id === 'tank2' && (obj.type = !btn ? game.tank2Type : 1);
			obj.bullet = true;	//true：可以发射子弹，false：不可发射
		}else{
			SetNpcBulletDelay(obj);
			obj.type = enemyData[game.nowPass][enemy.created];//类型，与数据有关
			obj.dir = 'b';//初始方向
			obj.x = parseInt(Math.random() * 3) * 192;//初始x坐标为0,192,384
			obj.y = 0;//初始y坐标
			obj['move' + obj.dir.toUpperCase()] = true;//根据方向，决定运动方向
			
			obj.dirDelay = 0.2;	//碰到障碍物时转弯cd
			obj.dirDelayTick = 0;
			
			obj.bonus = bonus[enemy.created] === 1 ? true : false;
			obj.bonus && (obj.bonusX = 0);
			
			enemy.nowNum++; 
			enemy.created++;
		}
		//obj.id === 'npc' && (obj.num = game.createdtankNum++);
		obj.num = game.num++;
		SetTankAttr(obj);
		SetTankBg(obj);
		!btn && allTank.unshift(obj);
	};
	//设置坦克属性
	function SetTankAttr(obj){
		if(obj.id === 'npc'){
			switch(obj.type){
				case 1 : obj.speed = 1; obj.hp = 1; obj.bgTopX = 256; break;
				case 2 : obj.speed = 2; obj.hp = 1; obj.bgTopX = 320; break;
				case 3 : obj.speed = 1; obj.hp = 1; obj.bgTopX = 384; break;
				case 4 : obj.speed = 1; obj.hp = 4; obj.bgTopX = 448; break;
			};
			obj.bulletSpeed = 4;
			obj.attack = 1;
			obj.bulletMaxLen = 1;
			return;
		}
		switch(obj.type){
			case 1 : obj.attack = 1; obj.bulletMaxLen = 1; obj.bulletSpeed = 4; obj.bgTopX = 0; break;
			case 2 : obj.attack = 1; obj.bulletMaxLen = 1; obj.bulletSpeed = 5; obj.bgTopX = 32; break;
			case 3 : obj.attack = 1; obj.bulletMaxLen = 2; obj.bulletSpeed = 5; obj.bgTopX = 64; break;
			case 4 : obj.attack = 2; obj.bulletMaxLen = 2; obj.bulletSpeed = 5; obj.bgTopX = 96; break;		
		}
		if(obj.id === 'tank2'){
			switch(obj.type){
				case 1 : obj.bgTopX = 128; break;	
				case 2 : obj.bgTopX = 160; break;	
				case 3 : obj.bgTopX = 192; break;	
				case 4 : obj.bgTopX = 224; break;	
			}
		}
	};
	//设置坦克背景
	function SetTankBg(obj){
		var pos = 0;
		switch(obj.dir){
			case 't' : pos = 0; break;
			case 'r' : pos = 1152; break;
			case 'b' : pos = 2304; break;
			case 'l' : pos = 3456; break;	
		}
		obj.bgY = 0;
		obj.bgX = pos + obj.bgTopX + obj.tyre;
		//如果敌方坦克bonus存在，bgX还需要加上obj.bonusX
		obj.bonus && (obj.bgX += obj.bonusX);
	};
	//前兆
	function Omen(obj){
		if(obj.status === 0){
			obj.omenTick = 0;
			obj.status = 1;
			return;
		}
		obj.omenTick++;	
		if(obj.omenTick === 54){
			 // tick = 18为一个周期，3个周期后坦克正式存在
			obj.status = 2;
			for(var i = 0;i<allTank.length;i++){
				var obj2 = allTank[i];
				if(obj.num != obj2.num){
					if(obj.x >=obj2.x+obj2.w||obj.x+obj.w<=obj2.x||obj.y>=obj2.y+obj2.h||obj.y+obj2.h<=obj2.y){
						continue;	
					}else{
						obj.repeat = true;
						obj.repeatArr.push(obj2.num);
					}
				}
			}
			obj.id !== 'npc' ? InitPro(obj, 5) : RenderSideBar();
		}				
	}
	//渲染我的坦克 
	function RenderTank(){
		cxt.save();
		cxt.translate(map.translateX, map.translateY);
		for(var i = 0;i < allTank.length; i++){
			var obj = allTank[i];
			//渲染前兆
			if(obj.status === 1){
				cxt.drawImage(iTank, 4608 + 32 * [parseInt(obj.omenTick % 18 / 6)], 0, obj.w, obj.h, obj.x, obj.y, obj.w, obj.h);
				continue;
			}
			if(obj.status === 2){
			//渲染坦克
				cxt.drawImage(iTank, obj.bgX, obj.bgY, obj.w, obj.h, obj.x, obj.y, obj.w, obj.h);
				//保护层存在的话渲染保护层
				obj.pro && cxt.drawImage(iMisc, obj.proBgX, obj.bgY, obj.w, obj.h, obj.x, obj.y, obj.w, obj.h);
			}
		}
		cxt.restore();
		
	};
	//清除坦克和子弹
	function clear(){
		cxt.save();
		cxt.translate(map.translateX, map.translateY);
		//清除所有坦克
		for(var i = 0; i < allTank.length; i++){
			var obj = allTank[i];
			cxt.fillRect(obj.x, obj.y, obj.w, obj.h);
		}
		//清除所有子弹
		for(var i = 0; i < allBullet.length; i++){
			var obj = allBullet[i];
			cxt.fillRect(obj.x, obj.y, obj.w, obj.h);
		}
		cxt.restore();
	};
	
	
	
	
	
	//坦克移动
	function Move(obj){
		for(var i = 0;i < allTank.length; i++){
			var obj = allTank[i];
			//如果 坦克status=0或=1，进入生成前兆
			if(obj.status === 0 || obj.status === 1){
				Omen(obj);
				continue;
			}
			obj.pro && Protect(obj);
			//摁下方向键或者坦克处于雪地会运动
			if(obj.moveT || obj.moveB || obj.moveL || obj.moveR　|| obj.buffer){
				if(obj.id!=='npc' && game.tick % 50 === 0){
					Sound('move',0.2);	
				}
				var btn = false;
				//方向改变后，需要调整背景图位置，需要进行位置修正
				obj.oldDir !== obj.dir && PosRevise(obj),SetTankBg(obj);
				if(MoveEdgeTest(obj) || MoveBrickTest(obj) || MoveTankTest(obj)){
					btn = true;
				}
				if(BufferTest(obj) && !btn && obj.bufferDis != 54){
					obj.buffer = true;
					obj.bufferDis += obj.speed;
				}else{
					obj.buffer = false;	
					obj.bufferDis = 0;
				}
				////////////////////////////////////////////////////
				//设定：当坦克移动的时候，才会发射子弹
				obj.id === 'npc' && InitBullet(obj);
			
				TyreChange(obj);
				//无论碰到边缘，砖块，还是其他坦克，都会停止
				MoveTankTest2(obj);
				if(btn){
					obj.id === 'npc' && npcMove(obj);
					continue;
				}
				//只有己方坦克才能吃精灵
				obj.id !== 'npc' && MoveSpiritTest(obj);
				switch(obj.dir){
					case 't' : obj.y -= obj.speed; break;
					case 'b' : obj.y += obj.speed; break;
					case 'l' : obj.x -= obj.speed; break;
					case 'r' : obj.x += obj.speed; break;
				};
			}
		}
	}
	//位置修正
	function PosRevise(obj){
		//坦克转弯后，中心点会正对砖块契合处
		if((obj.oldDir === 't' || obj.oldDir === 'b') && (obj.dir === 'l' || obj.dir === 'r')){
			if((obj.y + map.brickH) % map.brickH < map.brickH / 2){
				obj.y = obj.y - obj.y % map.brickH;
			}else{
				obj.y = obj.y + map.brickH - obj.y % map.brickH;
			}
		}else if((obj.oldDir === 'l' || obj.oldDir === 'r') && (obj.dir === 't' || obj.dir === 'b')){
			if((obj.x + map.brickW) % map.brickW > map.brickW / 2){
				obj.x = obj.x + map.brickW - obj.x % map.brickW;
			}else{	
				obj.x = obj.x - obj.x % map.brickW;
			}
		}
	};
	//type=4的敌方坦克移动时bgTopX发生变化
	function Type4TankMove(obj){
		switch(obj.hp){
			case 1 : obj.bgTopX = 448; break;	
			case 2 : obj.bgTopX = obj.bgTopX === 512 ? 544 : 512; break;
			case 3 : obj.bgTopX = obj.bgTopX === 448 ? 544 : 448; break;
			case 4 : obj.bgTopX = obj.bgTopX === 448 ? 512 : 448; break;
		}
		SetTankBg(obj);
	};
	//设置奖励坦克的bonusX
	function SetBonusX(obj){
		obj.bonusX = obj.bonusX === 32 ? 0 : 32;
		SetTankBg(obj);
	}
	//轮胎变化
	function TyreChange(obj){
		if(obj.id === 'npc' && obj.type === 4 && !obj.bonus){
			Type4TankMove(obj);
		}
		//根据坦克速度的不同，坦克轮胎运动的频率也不同
		if(obj.speed === 1 && game.tick % 2 === 0){
			return;	
		}
		if(obj.id === 'npc' && obj.bonus && game.tick % 7 === 1){
			SetBonusX(obj);
		}
		obj.tyre === 0 ? obj.tyre = 576 : obj.tyre = 0;
	};
	//移动的边缘检测
	function MoveEdgeTest(obj){
		if(obj.dir === 't' && obj.y === 0){
			return true;
		}else if(obj.dir === 'b' && obj.y === map.h - obj.h){
			return true;
		}else if(obj.dir === 'l' && obj.x === 0){
			return true;	
		}else if(obj.dir === 'r' && obj.x === map.w - obj.w){
			return true;	
		}
	};
	//移动的砖块检测
	function MoveBrickTest(obj){
		//坦克必须与砖块相邻才会碰撞,否则return
		if(obj.x % map.brickW != 0 || obj.y % map.brickH != 0){
			return false;	
		}
		var obj1, obj2;
		//根据当前方向和位置，找到相邻的2个砖块
		switch(obj.dir){
			case 't' : obj1 = allBrick[(parseInt(obj.y / map.brickH) - 1) * map.row + parseInt(obj.x / map.brickW)];
					   obj2 = allBrick[(parseInt(obj.y / map.brickH) - 1 ) * map.row + parseInt((obj.x + obj.w) / map.brickW) - 1]; break;
			case 'b' : obj1 = allBrick[parseInt((obj.y + obj.h) / map.brickH) * map.row + parseInt(obj.x / map.brickW)];
					   obj2 = allBrick[parseInt((obj.y + obj.h) / map.brickH) * map.row + parseInt((obj.x + obj.w) / map.brickW) - 1]; break;
			case 'l' : obj1 = allBrick[parseInt(obj.y / map.brickH) * map.row + parseInt(obj.x / map.brickW) - 1];
					   obj2 = allBrick[parseInt((obj.y / map.brickH + 1)) * map.row + parseInt(obj.x / map.brickW) - 1]; break;
			case 'r' : obj1 = allBrick[parseInt(obj.y / map.brickH) * map.row + parseInt((obj.x + obj.w) / map.brickW)];
					   obj2 = allBrick[parseInt((obj.y / map.brickH + 1)) * map.row + parseInt((obj.x + obj.w) / map.brickW)]; break;
		};
		//相邻砖块 只要有1个的stopMove存在，便会阻止坦克移动
		if(obj1.stopMove || obj2.stopMove){
				return true;
		}
	};
	//移动的重叠测试
	function MoveTankTest2(obj1){
		var btn = false;
		for(var i = 0; i < obj1.repeatArr.length; i++){
			for(var j = 0; j < allTank.length; j++){
				if(allTank[j].num === obj1.repeatArr[i]){
					var obj2 = allTank[j];
					if(obj1.x>=obj2.x+obj2.w||obj1.x+obj1.w<=obj2.x||obj1.y>=obj2.y+obj2.h||obj1.y+obj1.h<=obj2.y){
						//alert(obj1.repeatArr);
						obj1.repeatArr.splice(i,1);
						//alert(obj1.repeatArr);
					}
				}
			}
			
		}
	}
	//移动的坦克检测
	function MoveTankTest(obj1){
		//前兆状态的坦克不会进行检测
		for(var i = 0; i < allTank.length; i++){
			var obj2 = allTank[i];
			if((obj1.repeat || obj2.repeat ) && obj1.num!=obj2.num){
				for(var j = 0;j<obj1.repeatArr.length;j++){
					if(obj1.repeatArr[j] === obj2.num){
						return;
					}	
				}
				for(var j = 0;j<obj2.repeatArr.length;j++){
					if(obj2.repeatArr[j] === obj1.num){
						return;
					}	
				}	
			}
			if(obj2.status === 2 && obj1.num!= obj2.num){
				if(obj1.dir === 't' && obj1.y > obj2.y && obj1.y <= obj2.y + obj2.h && obj1.x < obj2.x + obj2.w && obj1.x + obj1.w > obj2.x){
					return true;
				}else if(obj1.dir === 'b' && obj1.y + obj1.h >= obj2.y && obj1.y < obj2.y && obj1.x < obj2.x + obj2.w && obj1.x + obj1.w > obj2.x){
					return true;
				}else if(obj1.dir === 'l' && obj1.x <= obj2.x + obj2.h && obj1.x > obj2.x && obj1.y < obj2.y + obj2.h && obj1.y + obj1.h > obj2.y){
					return true;
				}else if(obj1.dir === 'r' && obj1.x + obj1.w >= obj2.x && obj1.x < obj2.x && obj1.y < obj2.y + obj2.h && obj1.y + obj1.h > obj2.y){
					return true;
				}
			}
		}
	};
	//缓冲检测
	function BufferTest(obj){
		var obj1,obj2;
		switch(obj.dir){
			case 't' : obj1 = allBrick[(parseInt((obj.y + 16 -4) / map.brickH)) * map.row + parseInt(obj.x / map.brickW)];
					   obj2 = allBrick[(parseInt((obj.y + 16 -4) / map.brickH)) * map.row + parseInt((obj.x + map.brickW) / map.brickW)]; break;
			case 'b' : obj1 = allBrick[Math.ceil((obj.y + 4) / map.brickH) * map.row + parseInt(obj.x / map.brickW)];
					   obj2 = allBrick[Math.ceil((obj.y + 4) / map.brickH) * map.row + parseInt((obj.x + map.brickW) / map.brickW)]; break;
			case 'l' : obj1 = allBrick[parseInt(obj.y / map.brickH) * map.row + parseInt((obj.x+16 - 4) / map.brickW)];
					   obj2 = allBrick[parseInt((obj.y + map.brickH) / map.brickH) * map.row + parseInt((obj.x+16 - 4) / map.brickW)]; break;
			case 'r' : obj1 = allBrick[parseInt(obj.y / map.brickH) * map.row + Math.ceil((obj.x +4) / map.brickW)];
					   obj2 = allBrick[parseInt((obj.y + map.brickH) / map.brickH) * map.row + Math.ceil((obj.x + 4)/ map.brickW)]; break;
		};
		
		if(obj1.type === 5 && obj2.type === 5){
			return true;
		}
	};
	//初始化坦克的保护罩
	function InitPro(obj,t){
		obj.pro = true;
		obj.proTimes = parseInt(t * 1000 / 16);
		obj.proTick = 0;
	};
	//坦克的保护罩计数器
	function Protect(obj){
		if(obj.proTick < obj.proTimes){
			obj.proTick++;
			//保护罩闪烁频率
			if(obj.proTick % 6 < 3){
				obj.proBgX = 32;
			}else{
				obj.proBgX = 64;
			}
		}else{
			obj.pro = false;	
		}
	};
	
	
	//获取所有的 与 坦克，子弹有重叠的砖块
	function GetBrick(){
		var arr = [];
		//找到与所有坦克有重叠的砖块，，，雪地，草地等
		for(var i = 0; i < allTank.length; i++){
			var obj = allTank[i];	
			var x1 = Math.floor(obj.x / map.brickW) * map.brickW;
			var y1 = Math.floor(obj.y / map.brickH) * map.brickH;
			var x2 = Math.ceil((obj.x + obj.w) / map.brickW) * map.brickW;
			var y2 = Math.ceil((obj.y + obj.h) / map.brickH) * map.brickH;
			for(var j = y1; j < y2; j += map.brickH){
				for(var k = x1; k < x2;k += map.brickW){
					arr.push(parseInt(j / map.brickH) * map.column+parseInt(k / map.brickW));
				}
			}
		}
		//找到与所有子弹有重叠的砖块，雪地，草地，河流等
		for(var i = 0; i < allBullet.length; i++){
			var obj = allBullet[i];	
			var x1 = Math.abs(Math.floor(obj.x / map.brickW) * map.brickW);
			var y1 = Math.abs(Math.floor(obj.y / map.brickH) * map.brickH);
			var x2 = Math.abs(Math.ceil((obj.x + obj.w) / map.brickW) * map.brickW);
			var y2 = Math.abs(Math.ceil((obj.y + obj.h) / map.brickH) * map.brickH);
			for(var j = y1; j < y2; j += map.brickH){
				for(var k = x1; k < x2;k += map.brickW){
					arr.push(parseInt(j / map.brickH) * map.column+parseInt(k / map.brickW));
				}
			}
		}
		arr = ArrDeleteRepeat(arr);
		return arr;
	}
	//渲染指定的砖块  -->> 草地，河流，沙子
	function RenderSpecifyBrick(arr, type){
		//渲染指定type的砖块,---> lawn,rivers,sand
		var len = arr.length;
		cxt.save();
		cxt.translate(map.translateX, map.translateY);
		for(var i = 0; i < len; i++){
			var brick = allBrick[arr[i]];
			brick && brick.type === type && cxt.drawImage(iTerr, brick.bgX, brick.bgY, brick.w, brick.h, brick.x, brick.y, brick.w, brick.h);
		}
		cxt.restore();
	}
	//数组去重	
	function ArrDeleteRepeat(arr){
		arr.sort();
		var newArr = [arr[0]];
		for(var i = 0; i < arr.length - 1; i++){
			if(arr[i + 1] !== newArr[newArr.length -1]){
				newArr.push( arr[i + 1] );
			}
		}
		return newArr;
	};
	//设置敌军子弹的发射间隔
	function SetNpcBulletDelay(obj){
		var delay = [0.3,0.6,1];
		obj.bulletDelay = delay[parseInt(Math.random()*3)];
		obj.bulletTick = 0;	
	}
	//初始化子弹
	function InitBullet(obj){
		//子弹当前数量 = 最大数量时return
		if(obj.bulletNowLen === obj.bulletMaxLen){return}
		//敌军子弹 发射有间隔时间
		if(obj.id !== 'npc'){
			Sound('startBullet');	
		}
		if(obj.id === 'npc' && obj.bulletTick <= parseInt(obj.bulletDelay * 1000 / 16)){
			obj.bulletTick++;
		}else{
			//敌军每次发射子弹后，下一发子弹的间隔随机变化
			obj.id === 'npc' && SetNpcBulletDelay(obj);
			//设置子弹的一些属性，该坦克的当前子弹数量++
			var bgX = 0;
			var x,y;
			switch(obj.dir){
				case 't' : bgX = 0;	x = obj.x + obj.w / 2 - 4; y = obj.y; break;
				case 'r' : bgX = 8; x = obj.x + obj.w - 8; y = obj.y + obj.h / 2 - 4; break;
				case 'b' : bgX = 16; x = obj.x + obj.w / 2 -4; y = obj.y + obj.h - 8; break;
				case 'l' : bgX = 24; x = obj.x + 4; y = obj.y + obj.h / 2 - 4; break;
			} 
			obj.bulletNowLen++;
			allBullet.push({num : obj.num, parent : obj, x : x, y : y, w : 8, h : 8, dir : obj.dir, attack : obj.attack, bgX : bgX, bgY : 0, speed : obj.bulletSpeed});
		}
		
	};
	//子弹的移动
	function BulletMove(){
		for(var i = 0;i<allBullet.length ;i++){
			var bul = allBullet[i];
			//子弹与边缘的碰撞检测
			var Xy = BulletEdgeTest(bul);
			if(Xy){
				BulletHide(bul);
				InitSmallBoom(Xy);
				continue;	
			}
			var btn = BulletBaseTest(bul);
			if(btn){
				BulletHide(bul);
				RenderOverBase();
				InitBigBoom({x:192,y:384});
				game.over = true;
				game.toNext = false;
				continue;	
			}
			//子弹与砖块碰撞
			var Xy = BulletBrickTest(bul);
			if(Xy){
				BulletHide(bul);
				InitSmallBoom(Xy);
				continue;
			}
			//子弹与坦克碰撞
			var opt = BulletTankTest(bul);
			if(opt){
				//敌军坦克的奖励属性会消失，并产生精灵
				if(opt.obj.bonus){
					InitSpirit();
					opt.obj.bonus = false;
					opt.obj.bonusX = 0;	
				}
				//攻击力为2时，敌军无论血量多少都会死亡，为1时，血量--
				opt.attack === 2 ? opt.obj.hp = 0 : opt.obj.hp--;
				BulletHide(bul);
				//敌军死亡
				if(opt.obj.hp === 0 && opt.obj.id === 'npc'){
					score[opt.obj.type-1]++;	
					InitBigBoom(opt.obj, true);
					NpcHide(opt.obj);
				}
				//己方坦克，没有保护层的情况下，被子弹碰撞
				opt.obj.id !== 'npc' && !opt.obj.pro && BulletMe(opt.obj);
				continue;
			}
			//子弹与子弹碰撞，2个子弹都会消失
			var bul2 = BulletBulletTest(bul);
			if(bul2){
				BulletHide(bul);
				BulletHide(bul2);
				continue;	
			}
			switch(bul.dir){
				case 't' : bul.y = bul.y - bul.speed; break;
				case 'b' : bul.y = bul.y + bul.speed; break;
				case 'l' : bul.x = bul.x - bul.speed; break;
				case 'r' : bul.x = bul.x + bul.speed; break;
			};
		}
	};
	//子弹的边缘检测
	function BulletEdgeTest(bul){
		var x = bul.x,
			y = bul.y,
			w = bul.w,
			h = bul.h;
		var btn = false;
		switch(bul.dir){
			case 't' : y <= 0 && ( y = 0, x = x + 4, btn = true); break;
			case 'b' : y >= map.h - h && ( x = x + 4, y = map.w, btn = true); break;
			case 'l' : x <= 0 && ( x = 0, y = y + 4, btn = true); break;
			case 'r' : x >= map.w - w && ( x = map.w, y = y + 4, btn = true); break;
		};
		if(btn){
			return {x : x, y : y}
		}
	};
	//砖块的子弹碰撞检测
	function BulletBrickTest(bul){
		var obj1, obj2, iBtn = false;
		//根据子弹当前方向，位置，找到相邻的2个砖块
		switch(bul.dir){
			case 't' : obj1 = allBrick[(parseInt(bul.y / 16)) * 26 + parseInt(bul.x / 16)];
					   obj2 = allBrick[(parseInt(bul.y / 16)) * 26 + parseInt((bul.x + bul.w) / 16)]; break;
			case 'b' : obj1 = allBrick[parseInt((bul.y + bul.h) / 16) * 26 + parseInt(bul.x / 16)];
					   obj2 = allBrick[parseInt((bul.y + bul.h) / 16) * 26 + parseInt((bul.x + bul.w) / 16)]; break;
			case 'l' : obj1 = allBrick[parseInt(bul.y / 16) * 26 + parseInt(bul.x / 16)];
					   obj2 = allBrick[parseInt((bul.y / 16 + 1)) * 26 + parseInt(bul.x / 16)]; break;
			case 'r' : obj1 = allBrick[parseInt(bul.y / 16) * 26 + parseInt((bul.x + bul.w) / 16)];
					  obj2 = allBrick[parseInt((bul.y / 16 + 1)) * 26 + parseInt((bul.x + bul.w) / 16)]; break;
		}
		//只要碰到1个，就算是碰到了，返回子弹当前方向的伪中心点位置
		if(BulletBrickTest2( obj1, bul)){
			iBtn = true;
		}
		if(BulletBrickTest2( obj2, bul)){
			iBtn = true;
		}
		if(iBtn){
			var x = bul.x;
			var y = bul.y;
			switch(bul.dir){
				case 't' : x = x + 4; y = y; break;
				case 'b' : x = x + 4; y = y + bul.h; break;
				case 'l' : x = x; y = y + 4; break;
				case 'r' : x = x + bul.w; y = y + 4; break;	
			}
			return {x : x, y : y};
		}
	};
	//计算砖块和子弹的碰撞后,改变砖块状态，属性
	function BulletBrickTest2(brick, bul){
		//砖块为铁块，只有最强状态的我方坦克才能消灭
		if(brick.type === 2){
			if(bul.attack === 2){
				brick.w = brick.h = 0;
				brick.type = 0;
				brick.stopMove = false;	
			}
			return true;	
		}
		//普通砖块（有2层），普通坦克1次打1层，最强我方坦克1次打2层
		if(brick.type === 1){
			if(brick.x > bul.x + bul.w || brick.x + brick.w < bul.x || brick.y > bul.y + bul.h || brick.y + brick.h < bul.y){
				return false;	
			}else{
				switch(bul.dir){
					case 't': brick.h -= bul.attack * 8; break;
					case 'b': brick.h -= bul.attack * 8; brick.y += bul.attack * 8; brick.bgY = 8; break;
					case 'l': brick.w -= bul.attack * 8; brick.bgX = 24; break;
					case 'r': brick.w -= bul.attack * 8; brick.x += bul.attack * 8; break;	
				}
			}
			if(brick.h <= 0||brick.w <= 0){
				brick.h = brick.w = 0;
				brick.type = 0;	
				brick.stopMove = false;	
			}
			return true;
		}
	};
	//子弹与坦克进行碰撞的检测
	function BulletTankTest(bul){
		//前兆状态的坦克不会被碰到，敌方坦克的子弹不会被碰到敌方坦克
		for(var i = 0; i < allTank.length; i++){
			var obj = allTank[i];
			if(obj.status === 2 && bul.parent.id != obj.id){
				if(bul.dir === 't' && (bul.x + bul.w >= obj.x && bul.x <= obj.x + obj.w && bul.y <= obj.y + obj.h && bul.y >= obj.y) ){
					return {attack : bul.attack, obj : obj};
				}
				if(bul.dir === 'b' && (bul.x + bul.w >= obj.x && bul.x <= obj.x + obj.w && bul.y <= obj.y + obj.h && bul.y + bul.h >= obj.y)){
					return {attack : bul.attack, obj : obj};
				}
				if(bul.dir === 'l' && (bul.x <= obj.x + obj.w && bul.x + bul.w >= obj.x && bul.y + bul.h >= obj.y && bul.y  <= obj.y + obj.h)){
					return {attack : bul.attack, obj : obj};
				}
				if(bul.dir === 'r' && (bul.x + bul.w >= obj.x && bul.x <= obj.x + obj.w && bul.y + bul.h >= obj.y && bul.y <= obj.y + obj.h)){
					return {attack : bul.attack, obj : obj};
				}
			}
		}
	};
	//子弹击中我
	function BulletMe(obj){
		//最强状态的时候被碰到只会降低1级，否则如果还有生命值的话，坦克重置
		if(obj.type === 4){
			obj.type--;
			SetTankAttr(obj);
			SetTankBg(obj);
			return;
		}
		if(obj.life > 1){
			obj.life--;
			InitBigBoom(obj);
			InitTank(obj.id,true);	
			RenderSideBar();
		}else{
			obj.life = 0;
			obj.status = 3;
			InitBigBoom(obj);
		}
		if((game.twoGame && !tank2.life && !tank1.life) || (!game.twoGame && !tank1.life )){
			game.over = true;
			game.toNext = false;
		}
	};
	//子弹和子弹的碰撞
	function BulletBulletTest(bul){
		//同阵营的子弹不会碰撞
		for(var i = 0; i < allBullet.length; i++){
			var bul2 = allBullet[i];
			if(bul.parent.id != bul2.parent.id){
				if(bul.x + bul.w >= bul2.x &&bul.x<=bul2.x+bul2.w&&bul.y+bul.h>=bul2.y&&bul.y<=bul2.y+bul2.h){
					return bul2;
				}
			}
		};
	};
	//子弹和基地的碰撞
	function BulletBaseTest(bul){
		var obj1,obj2;
		switch(bul.dir){
			case 't' : obj1 = allBrick[(parseInt(bul.y / 16)) * 26+parseInt(bul.x / 16)];
					  obj2 = allBrick[(parseInt(bul.y/16)) * 26+parseInt((bul.x+bul.w)/16)];break;
			case 'b' : obj1 = allBrick[parseInt((bul.y+bul.h)/16)*26+parseInt(bul.x/16)];
					  obj2 = allBrick[parseInt((bul.y+bul.h)/16)*26+parseInt((bul.x+bul.w)/16)];break;
			case 'l' : obj1 = allBrick[parseInt(bul.y/16)*26+parseInt(bul.x/16)];
					  obj2 = allBrick[parseInt((bul.y/16+1))*26 + parseInt(bul.x/16)];break;
			case 'r' : obj1 = allBrick[parseInt(bul.y/16)*26+parseInt((bul.x+bul.w)/16)];
					  obj2 = allBrick[parseInt((bul.y/16+1))*26+parseInt((bul.x+bul.w)/16)];break;
		}
		if(obj1.base||obj2.base){
			return true;
		}
	}
	//渲染破坏的基地
	function RenderOverBase(){
		var bgPosX = [160, 176, 192, 208];
		cxt.save();
		cxt.translate(map.translateX, map.translateY);
		for(var i = 0; i < map.base.length; i++){
			
			var obj = allBrick[map.base[i]];
			cxt.clearRect(obj.x, obj.y, obj.w, obj.h);	
			obj.bgX = bgPosX[i];
			cxt.drawImage(iTerr, obj.bgX, 0, obj.w, obj.h, obj.x, obj.y, obj.w, obj.h);
		}
		cxt.restore();
	};
	//子弹消失
	function BulletHide(obj){
		if(obj.parent.id !== 'npc'){
			Sound('bulletEnd');	
		}
		obj.status = 0;
		if(obj.parent.num === obj.num){
			obj.parent.bulletNowLen--;
		}
		for(var i=0;i<allBullet.length;i++){
			if(allBullet[i].status === 0){
				allBullet.splice(i,1);
			}
		}
	};
	//渲染子弹
	function RenderBullet(){
		cxt.save();
		cxt.translate(map.translateX, map.translateY);
		for(var i = 0;i<allBullet.length; i++){
			var bullet = allBullet[i];
			cxt.drawImage(iMisc, bullet.bgX, bullet.bgY, bullet.w, bullet.h, bullet.x, bullet.y, bullet.w, bullet.h);	
		}
		cxt.restore();
	};
	
	//初始化精灵
	function InitSpirit(){
		//随机精灵类型和坐标
		var type = parseInt(Math.random() * 6);
		var x = parseInt(Math.random() * (416 - 32));	
		var y = parseInt(Math.random() * (416 - 32));
		spirit.push({is : true, x : x, y : y, w : 32, h : 32, type : type, status : 1, bgX : 4896 + type * 32, bgY : 0, tick : 0});
	};
	//精灵
	function Spirit(){
		var arr = [];
		var times = parseInt(10 * 1000 / 16);
		for(var i = 0; i < spirit.length; i++){
			var obj = spirit[i];
			//过时后，重新渲染精灵所在位置
			if(obj.tick > times){
				arr.push(i);
				RenderBoomAfter(obj.x,obj.y);
				continue;
			}
			//精灵会闪烁，status=1:亮，status=2：暗
			if(obj.tick % 48 < 24){
				obj.status = 1;
			}else if(obj.tick % 48 === 24){
				obj.status = 2;
				RenderBoomAfter(obj.x, obj.y);
			}
			obj.tick++;	
		}
		//删除过时的精灵
		for(var i = arr.length - 1; i >= 0; i--){
			spirit.splice(i,1);
		}
	};
	//渲染精灵
	function RenderSpirit(){
		cxt.save();
		cxt.translate(map.translateX, map.translateY);
		for(var i = 0; i < spirit.length;i++){
			var obj = spirit[i];
			obj.status === 1 && cxt.drawImage(iTank, obj.bgX, obj.bgY, obj.w, obj.h, obj.x, obj.y, obj.w, obj.h);
		}
		cxt.restore();
	};
	//精灵的碰撞检测
	function MoveSpiritTest(obj){
		for(var i = 0; i < spirit.length; i++){
			var obj2 = spirit[i];
			if(obj.x < obj2.x + obj2.w && obj.x + obj.w > obj2.x && obj.y < obj2.y + obj2.h && obj.y + obj.h > obj2.y){
				//需要重新渲染当前区域
				obj2.is = false;
				Sound('eat');	
				score[4]++;
				RenderBoomAfter(obj2.x, obj2.y);
				InitHideScore({x:obj2.x,y:obj2.y,type:5})
				//根据精灵type，产生不同效果
				switch(obj2.type){
					case 0 : InitBaseProtect();  break;//基地保护
					case 1 : Stronger(obj); break;//升级
					case 2 : Sound('addLife');AddLife(obj);	 break;//加血
					case 3 : InitPro(obj,10); break;//保护罩
					case 4 : Sound('boom');AllHide();	 break;//地雷
					case 5 : InitFixedTime(); break;//定时
				};
			}
		}
		//删除吃掉的精灵
		for(var i = spirit.length - 1; i >= 0; i--){
			if(!spirit[i].is){
				spirit.splice(i, 1);
			}
		}
	};
	//初始化基地保护
	function InitBaseProtect(){
		baseProtect.is = true;
		baseProtect.tick = 0; 
		baseProtect.status = 1;
		//基地附近的7个砖块，即使曾经受到打击或消失，也会重现，并变成铁块
		for(var i = 0;i < map.nearBase.length; i++){
			var brick = allBrick[map.nearBase[i]];
			brick.w = map.brickW;
			brick.h = map.brickH;
			brick.type = 2;
			brick.bgX = 32;
			brick.bgY = 0;
			brick.x = map.nearBase[i] % map.column * map.brickW;
			brick.y = parseInt(map.nearBase[i] / map.row) * map.brickH;
			brick.stopMove = true;
		 }
		 RenderBaseProtect();
	};
	//基地保护
	function BaseProtect(){
		baseProtect.tick++;
		//基地为铁块
		if(baseProtect.tick <= parseInt(10 * 1000 / 16)){
			RenderBaseProtect();
		}
		//基地保护砖块的样子 铁块木块的来回闪烁（即使是木块的样子，也是铁块）
		else if(baseProtect.tick <= parseInt(13 * 1000 / 16)){
			if(baseProtect.tick % 30 <= 15){
				baseProtect.status = 1;
				RenderBaseProtect();
			}else{
				baseProtect.status = 2;
				RenderBaseProtect();
			}
		}
		//基地保护消失，尚存在的铁块会变成木块
		else{
			baseProtect.status = 0;
			baseProtect.is = false;
			RenderBaseProtect();
		}
	};
	//渲染基地保护
	function RenderBaseProtect(){
		cxt.save();
		cxt.translate(map.translateX, map.translateY);
		for(var i = 0; i < map.nearBase.length; i++){
			var obj = allBrick[map.nearBase[i]];
			if(obj.type != 0){
				if(baseProtect.status === 1){
					obj.bgX = 32;
				}else if(baseProtect.status === 2){
					obj.bgX = 16;
				}else if(baseProtect.status === 0){
					obj.type = 1;
					obj.bgX = 16;
				}
				cxt.drawImage(iTerr, obj.bgX, obj.bgY, obj.w, obj.h, obj.x, obj.y, obj.w, obj.h);
			}
		}
		cxt.restore();
	};
	//坦克升级
	function Stronger(obj){
		//非最强状态都会升级
		obj.type != 4 && (obj.type++,SetTankAttr(obj),SetTankBg(obj));
	}
	//增加生命值，最多为5条命
	function AddLife(obj){
		obj.life++;
		RenderSideBar();
	};
	//敌军全部爆炸
	function AllHide(){
		for(var i = allTank.length - 1; i >= 0; i--){
			var obj = allTank[i];
			if(obj.id === 'npc' && obj.status === 2){
				InitBigBoom(obj);
				NpcHide(obj);
			}
		};
	};
	//初始化定时精灵
	function InitFixedTime(){
		fixedTime.is = true;
		fixedTime.tick = 0;
		fixedTime.times = parseInt(10 * 1000 / 16);
	};
	//定时
	function FixedTime(){
		fixedTime.tick++;
		//敌军被定时，无法移动，无法发射子弹
		if(fixedTime.tick <= fixedTime.times){
			for(var i = 0; i < allTank.length; i++){
				var obj = allTank[i];
				if(obj.id == 'npc'){
					obj.moveB = obj.moveL = obj.moveT = obj.moveR = false;	
				}
			}
		}
		//敌军恢复移动，并根据当前方向开始运动
		else{
			for(var i = 0;i < allTank.length; i++){
				var obj = allTank[i];
				if(obj.id === 'npc'){
					obj['move' + obj.dir.toUpperCase()] = true;
				}
			}
			fixedTime.is = false;
		}
	};
	
	//创建小的爆炸
	function InitSmallBoom(Xy){	
		allSmallBoom.push({status : 1, bgX : 64, bgY : 0, w : 64, h : 64, x : Xy.x - 32, y : Xy.y - 32, tick : 0});
	};
	//小的爆炸
	function SmallBoom(){
		var arr = [];
		for(var i = 0; i < allSmallBoom.length; i++){
			if(allSmallBoom[i].tick != 2){
				allSmallBoom[i].tick++;
			}else{
				arr.push(i);
				RenderBoomAfter(allSmallBoom[i].x,allSmallBoom[i].y);	
			}
		}
		//删除过时的爆炸
		for(var i = arr.length - 1; i >= 0; i--){
			allSmallBoom.splice(arr[i],1);
		}
	};
	//渲染小的爆炸
	function RenderSmallBoom(){
		cxt.save();
		cxt.translate(map.translateX, map.translateY);
		for(var i = 0; i<allSmallBoom.length; i++){
			var boom = allSmallBoom[i];
			cxt.drawImage(iBoom, boom.bgX, boom.bgY, boom.w, boom.h, boom.x, boom.y, boom.w, boom.h);	
		}
		cxt.restore();
	};
	
	
	//创建大的爆炸
	function InitBigBoom(obj,btn){
		allBigBoom.push({status : 1, w : 64, h : 64, x : obj.x - 16, y : obj.y - 16, tick : 0, bgY : 0, bgX : 0, type : obj.type, score : btn ? true : false});
	};
	//大的爆炸
	function BigBoom(){
		var bgX = [0, 64, 128, 192];
		var arr = [];
		for(var i = 0; i < allBigBoom.length; i++){
			var boom = allBigBoom[i];
			boom.tick++;
			boom.bgX = bgX[parseInt(boom.tick /5 )];
			//炸弹将过时，重新渲染当前区域，并且产生死亡分数
			if(boom.tick === 20){
				arr.push(i);
				RenderBoomAfter(boom.x,boom.y);	
				boom.score && InitHideScore({x:boom.x + 16,y:boom.y + 16,type:boom.type});
			}
		}
		//删除过时爆炸
		for(var i = arr.length - 1; i >= 0; i--){
			allSmallBoom.splice(arr[i],1);
		}
	};
	//渲染大的爆炸
	function RenderBigBoom(){
		cxt.save();
		cxt.translate(map.translateX, map.translateY);
		for(var i = 0; i<allBigBoom.length; i++){
			var boom = allBigBoom[i];
			cxt.drawImage(iBoom, boom.bgX, boom.bgY, boom.w, boom.h, boom.x, boom.y, boom.w, boom.h);	
		}
		cxt.restore();
	};
	
	//初始化 坦克消失的分数
	function InitHideScore(opt){
		allHideScore.push({x : opt.x, y : opt.y, w : 32, h : 32, bgX : [4736, 4768, 4800, 4832,4864][opt.type - 1], bgY : 0, tick : 0});	
	};
	//坦克消失的分数
	function HideScore(){
		var arr = [];
		for(var i = 0; i < allHideScore.length; i++){
			var opt = allHideScore[i];
			opt.tick++;
			if(opt.tick === 10){
				arr.push(i);
				RenderBoomAfter(opt.x - 16, opt.y - 16);
			}
		}
		for(var i = arr.length - 1; i >= 0; i--){
			allHideScore.splice(i, 1);
		}
	};
	//渲染 坦克消失后的分数
	function RenderHideScore(){
		cxt.save();
		cxt.translate(map.translateX, map.translateY);
		for(var i = 0; i < allHideScore.length; i++){
			var opt = allHideScore[i];
			cxt.drawImage(iTank, opt.bgX , opt.bgY, opt.w, opt.h, opt.x, opt.y, opt.w, opt.h);
		}
		cxt.restore();
	};
	
	
	//爆炸过后重新渲染当前区域
	function RenderBoomAfter(x, y){
		//一个64*64的区域，渲染所在区域的所有砖块，如果区域超出地图外，渲染外面的底色
		var w = 64;
		var h = 64;
		cxt.save();
		cxt.translate( map.translateX, map.translateY);
		cxt.fillStyle = '#666666';
		cxt.fillRect(x, y, w, h);
		cxt.fillStyle = '#000';
		x <= 0 ? x = 0 : x = x;
		y <= 0 ? y = 0 : y = y;
		x + w >= 416 ? w = 416 - x : w = 64;
		y + h >= 416 ? h = 416 - y : h = 64;
		cxt.fillRect( x, y, w, h);
		x -= x % 16;
		y -= y % 16;
		var initX = x;
		for(var i = 0; i < 5; i++, y += 16){
			x = initX;
			for(var j = 0; j < 5; j++, x += 16){
				var brick = allBrick[y / 16 * 26 + x / 16];
				brick && brick.type != 0 && cxt.drawImage(iTerr, brick.bgX, brick.bgY, brick.w, brick.h, brick.x, brick.y, brick.w, brick.h);
			}
		}
		cxt.restore();
	};
	
	
	//动态变化的河流
	function ChangedRivers(){
		if(rivers.tick != 60){
			rivers.tick++;
			return;
		}
		rivers.bgY = rivers.bgY === 0 ? 16 : 0;
		for(var i = 0; i < rivers.arr.length; i++){
			allBrick[rivers.arr[i]].bgY = rivers.bgY;
		}
		rivers.tick = 0;
		RenderSpecifyBrick(rivers.arr, 4);
	};
	
	
	//初始化敌人
	function initNpc(){
		//敌人存在数量有上限
		if(enemy.nowNum >= enemy.maxNum){
			return;	
		}
		//敌人生成数量有上限
		if(enemy.created === enemy.allNum){
			return;	
		}
		//满足条件开始生成敌军
		enemy.tick++;
		//第一个敌方坦克在开局1秒后产生，后面每个坦克产生间隔为3秒
		if(enemy.created === 0){
			if(enemy.tick === parseInt(1 * 1000 / 16)){
				enemy.tick = 0;	
				InitTank('npc');
			}
			return;	
		}
		if(enemy.tick === parseInt(3 * 1000 / 16)){
			enemy.tick = 0;	
			InitTank('npc');
		}
	};
	//敌人的方向变化计数器
	function npcMoveDelay(obj,dir){
		//敌方坦克碰到障碍物会不会瞬间转弯，会先思考一定时间再转
		obj.dirDelayTick++;
		if(obj.dirDelayTick === parseInt(obj.dirDelay * 1000 / 16)){
			obj.oldDir = obj.dir;
			obj.dir = dir;
			obj.moveB = obj.moveT = obj.moveL = obj.moveR = false;
			obj['move' + dir.toUpperCase()] = true;
			obj.dirDelayTick = 0;
		}
	};
	//敌人的方向变化
	function npcMove(obj){
		//例子：如果当前方向为t，碰到障碍物时，随机方向为b,l,r
		var arr = ['t','b','l','r'];
		var dir = obj.dir;
		for(var i = 0; i < arr.length; i++){
			if( arr[i] === dir ){
				arr.splice( i , 1 );	
			}
		}
		var n = parseInt(Math.random() * 3);
		dir = arr[n];
		npcMoveDelay(obj,dir);
	};
	//敌军消失
	function NpcHide(obj){
		obj.status = 3;
		for(var i = 0; i < allTank.length; i++){
			if(allTank[i].status === obj.status){
				allTank.splice(i,1);
				break;
			}
		}
		enemy.nowNum--;
		enemy.hideNum++;
		//敌军全部消失后，进入下一关
		if(enemy.hideNum === 20){
			game.toNext = true;		
		}
	};
	//全部敌军消失后，延迟一定时间，进入下一关，如果此时我的坦克消失，或者基地被打，会重新开始游戏
	function ToNextTick(){
		game.toNextTick++;
		if(game.toNextTick === parseInt(5 * 1000 / 16)){
			InitUIScore();
		};
	};
	//我方坦克消失，或者基地被打

	//游戏结束提示的计数器
	function GameOverTipTick(){
		game.overTick++;
		if(game.overY >= 220){
			game.overY -= 2;
			RenderGameOverTip();
			return;
		}
		if(game.overTick > parseInt(2.2 * 1000 / 16)){
			InitUIScore();
		}
	};
	//渲染游戏结束的提示
	function RenderGameOverTip(){
		RenderMap();
		cxt.save();
		cxt.translate(map.translateX, map.translateY);
		cxt.fillStyle = '#b53120';
		cxt.font = '22px Arial Black';
		cxt.textAlign = 'center';
		cxt.fillText("G A M E", 208, game.overY - 2 ); 
		cxt.fillText("O V E R", 208, game.overY + 20); 
		cxt.fillStyle ='#666';
		cxt.fillRect(0,416,416,416);
		cxt.restore();
	};
	
	//初始化 计分界面
	function InitUIScore(){
		game.status = 2;
		uiScore.status = 1;
		uiScore.tick1 = 0;
		uiScore.tick2 = 0;
		uiScore.tick3 = 0;
		uiScore.tick4 = 0;
		uiScore.tick5 = 0;
		uiScore.tick = 0;
		uiScore.y = [210, 250, 290, 330];
		uiScore.time = 1;
		RenderUIScore();
	};
	//计分界面
	function UIScore(){
		uiScore.tick == 0 && RenderUIScore();
		uiScore.tick++;
		if(uiScore.tick % 12 != 0){
			return;
		}
		if(uiScore.status === 1 && uiScore.tick1 !== score[0]){
			uiScore.tick1++;
		}else if(uiScore.status === 1 && uiScore.tick1 === score[0]){
			uiScore.status = 2;	
		}else if(uiScore.status === 2 && uiScore.tick2 !== score[1]){
			uiScore.tick2++;
		}else if(uiScore.status === 2 && uiScore.tick2 === score[1]){
			uiScore.status = 3;	
		}else if(uiScore.status === 3 && uiScore.tick3 !== score[2]){
			uiScore.tick3++;
		}else if(uiScore.status === 3 && uiScore.tick3 === score[2]){
			uiScore.status = 4;	
		}else if(uiScore.status === 4 && uiScore.tick4 !== score[3]){
			uiScore.tick4++;
		}else if(uiScore.status === 4 && uiScore.tick4 === score[3]){
			uiScore.status = 5;	
		}else if(uiScore.status === 5 && uiScore.tick5 !== 2){
			uiScore.tick5++;
		}else if(uiScore.status === 5 && uiScore.tick5 === 2){
			uiScore.status = 6;
			//InitUIOver();
		}
		RenderUIScore();
	};
	//渲染计分界面
	function RenderUIScore(){
		cxt.save();
		cxt.fillRect(0, 0, game.w, game.h);
		cxt.fillStyle = '#b53120';
		cxt.font = "22px Arial Black";
		cxt.fillText("HI-SCORE", 100, 50);
		cxt.fillText("1-PLAYER", 50, 130);
		cxt.fillStyle = '#ea9e22';
		cxt.fillText("20000", 300, 50);
		cxt.fillText(score[0] * 100 + score[1] * 200 + score[2] * 300 + score[3] * 400 + score[4] * 500, 110, 160);
		cxt.fillStyle = '#fff';
		cxt.fillText("STAGE   "+(game.nowPass + 1), 190, 90);
		cxt.fillText("PTS", 120, 210);
		cxt.drawImage(iMisc, 96, 0, 16, 16, 230, 195, 16, 16);
		cxt.drawImage(iTank, 256, 0, 32, 32, 250, 185, 32, 32);
		cxt.fillText("PTS", 120, 250);
		cxt.drawImage(iMisc, 96, 0, 16, 16, 230, 235, 16, 16);
		cxt.drawImage(iTank, 320, 0, 32, 32, 250, 225, 32, 32);
		cxt.fillText("PTS", 120, 290);
		cxt.drawImage(iMisc, 96, 0, 16, 16, 230, 275, 16, 16);
		cxt.drawImage(iTank, 384, 0, 32, 32, 250, 265, 32, 32);
		cxt.fillText("PTS", 120, 330);
		cxt.drawImage(iMisc, 96, 0, 16, 16, 230, 315, 16, 16);
		cxt.drawImage(iTank, 448, 0, 32, 32, 250, 305, 32, 32);
		cxt.fillStyle = '#fff';
		cxt.fillRect(192, 361, 128, 3);
		cxt.fillText("TOTAL", 90, 400);
		cxt.fillStyle = '#fff';
		cxt.font = "22px Arial Black";
		cxt.textAlign = 'right';
		for(var i = 0; i < 4; i++){
			uiScore.status > i && cxt.fillText(uiScore['tick' + (i + 1)] * 100, 100, uiScore.y[i]);
			uiScore.status > i && cxt.fillText(uiScore['tick' + (i + 1)], 220, uiScore.y[i]);
		}
		uiScore.status === 5 && cxt.fillText(score[0] + score[1] + score[2] + score[3], 240, 400);
		cxt.restore();
		uiScore.status === 6 && IsGoNext();
	};
	//分数统计完成后，是进入下一关，还是重新开始
	function IsGoNext(){
		if(game.over){
			InitUIOver();
			game.tank1Type = 1;
			game.tank2Type = 1;
			game.tank1Life = 3;
			game.tank2Life = 3;
			game.twoGame = false;
		}else{
			if(game.nowPass != 34){
				game.nowPass++;
				game.status = 0;
				uiStart.status = 5;
				uiStart.tick = 0;	
				game.tank1Type = tank1.type;
				game.tank2Type = tank2.type;
				game.tank1Life = tank1.life;
				game.tank2Life = tank2.life;
			}else{
				game.status = 0;
				uiStart.status = 0;	
				game.tank1Type = 1;
				game.tank2Type = 1;
				game.tank1Life = 3;
				game.tank2Life = 3;
				game.twoGame = false;
			}
		}
	};
	
	//InitUIOver
	function InitUIOver(){
		game.status = 3;
		uiOver.tick = 0;
		Sound('lower');
	};
	//UIOver
	function UIOver(){
		RenderUIOver();
		if(uiOver.tick <= parseInt(2 * 1000 / 16)){
			uiOver.tick++;
		}else{
			game.status = 0;
			uiStart.status = 0;
		}
	};
	//渲染UIOver
	function RenderUIOver(){
		cxt.save();
		cxt.fillStyle = '#000';
		cxt.fillRect(0, 0, game.w, game.h);
		cxt.drawImage(iUI, 0, 155, 376, 165, 140, 160, 376, 165);
		cxt.restore();
	};
	
	
	//地图编辑器
	function InitMapEditor(){
		mapEditor.is = true;	//mapEditor is or no
		mapEditor.selectorTop = [];	 
		for(var i = 0; i < mapEditor.selectorNum; i++){	
			mapEditor.selectorTop.push(10 + i * 30); 
		}
		for(var i = 0; i < map.row * map.column; i++){
			mapEditor.diyMap.push(0);
		}
		for(var i = 0, type = mapEditor.selectorNum; i < map.base.length; i++){
			mapEditor.diyMap[map.base[i]] = type++;
		}
		for(var i = 0; i < map.nearBase.length; i++){
			mapEditor.diyMap[map.nearBase[i]] = 1;
		}
		RenderMapEditor();
		oC.addEventListener('mousedown',MapEditorMouseDown,false);
	};
	function RenderMapEditor(){
		cxt.save();
		cxt.translate(map.translateX, map.translateY);
		cxt.fillRect(0, 0, map.w, map.h);
		//set selectors,default selector set border
		for(var i = 0; i < mapEditor.selectorNum; i++){	
			if(mapEditor.type == i){
				cxt.fillStyle = mapEditor.selectorBorderColor;
				cxt.fillRect(mapEditor.selectorLeft - mapEditor.selectorBorderWidth, mapEditor.selectorTop[i] - mapEditor.selectorBorderWidth, map.brickW + mapEditor.selectorBorderWidth * 2, map.brickH + mapEditor.selectorBorderWidth * 2);
			}
			cxt.drawImage(iTerr, i * 16, 0, map.brickW, map.brickH, mapEditor.selectorLeft,  mapEditor.selectorTop[i], map.brickW, map.brickH);	
		}
		
		//set map
		for(var i = 0; i < mapEditor.diyMap.length; i++){
			cxt.drawImage(iTerr, 16 * mapEditor.diyMap[i], 0, map.brickW, map.brickH, i % map.column * map.brickW, parseInt(i / map.row) * map.brickH, map.brickW, map.brickH);	
		}
		cxt.fillStyle = mapEditor.comeGameBorderColor;
		cxt.fillRect(mapEditor.comeGameBorderX, mapEditor.comeGameBorderY, mapEditor.comeGameBorderW, mapEditor.comeGameBorderH);
		cxt.font = mapEditor.comeGameFont;		
		cxt.fillStyle = '#000';
		cxt.fillText(mapEditor.comeGameText, mapEditor.comeGameX, mapEditor.comeGameY);
		cxt.restore();
	};
	function MapEditorMousePosTest(x, y){
		//map outside can't set
		if(x <= 0 || x >= map.w || y <= 0 || y >= map.h){
			return;	
		}
		//tank1 pos can't set
	/*	if(x >= 128 && x <= map.tank1InitX + map.brickW * 2 && y >= 384 && y <= map.tank1InitY + map.brickH * 2){
			return;	
		}
		//tank2 pos can't set
		if(x >= map.tank2InitX && x <= map.tank2InitX + map.brickW * 2 && y >= map.tank2InitY && y <= map.tank2InitY + map.brickH * 2){
			return;	
		}*/
		//base pos can't set
		for(var i = 0; i < map.base.length; i++){
			if(parseInt(y / map.brickH) * map.row + parseInt(x / map.brickW) == map.base[i]){
				return;	
			}
		}
		//enemy pos can't set
		/*for(var i = 0; i < map.enemyInitX.length; i++){
			if(x >= map.enemyInitX[i] && x <= map.enemyInitX[i] + map.brickW * 2 && y >= map.enemyInitY && y <= map.enemyInitY + map.brickH * 2){
				return;	
			}
		}*/
		//baseNear pos can set brick1 and brick2
		for(var i = 0; i < map.nearBase.length; i++){
			if(parseInt(y / map.brickH) * map.row + parseInt(x / map.brickW) == map.nearBase[i] && (mapEditor.type != 1 && mapEditor.type != 2)){
				return;	
			}	
		}
		mapEditor.diyMap[parseInt(y / map.brickH) * map.row + parseInt(x / map.brickW)] = mapEditor.type;
		RenderMapEditorBrick(x, y);
	};
	function RenderMapEditorBrick(x, y){
		cxt.save();
		cxt.translate(map.translateX, map.translateY);
		cxt.drawImage(iTerr, 16 * mapEditor.type, 0, map.brickW, map.brickH, parseInt(x / map.brickW) * map.brickW, parseInt(y / map.brickH) * map.brickH, map.brickW, map.brickH);
		cxt.restore();
	};
	function MapEditorSelectorChange(x, y){
		for(var i = 0; i < mapEditor.selectorNum; i++){
			if(x >= mapEditor.selectorLeft - mapEditor.selectorBorderWidth && x <= mapEditor.selectorLeft + map.brickW + mapEditor.selectorBorderWidth && y >= mapEditor.selectorTop[i] - mapEditor.selectorBorderWidth && y <= mapEditor.selectorTop[i] + map.brickH + mapEditor.selectorBorderWidth){
				mapEditor.type = i;
				cxt.save();
				cxt.translate(map.translateX, map.translateY);
				cxt.fillStyle = '#666';
				cxt.fillRect(mapEditor.selectorLeft - mapEditor.selectorBorderWidth, mapEditor.selectorTop[0] - mapEditor.selectorBorderWidth, mapEditor.selectorClearWidth, mapEditor.selectorClearHeight);
				cxt.fillStyle = mapEditor.selectorBorderColor;
				cxt.fillRect(mapEditor.selectorLeft - mapEditor.selectorBorderWidth, mapEditor.selectorTop[i] - mapEditor.selectorBorderWidth, map.brickW + mapEditor.selectorBorderWidth * 2, map.brickH + mapEditor.selectorBorderWidth * 2);
				for(var j = 0; j < mapEditor.selectorNum; j++){
					cxt.drawImage(iTerr, 16 * j, 0, map.brickW, map.brickH, mapEditor.selectorLeft, mapEditor.selectorTop[j], map.brickW, map.brickH);
				}
				cxt.restore();
			}
		}
	};
	function MapEditorComeGame(x, y){
		if(x >= mapEditor.comeGameBorderX && x <= mapEditor.comeGameBorderX + mapEditor.comeGameBorderW && y >= mapEditor.comeGameBorderY && y <= mapEditor.comeGameBorderY + mapEditor.comeGameBorderH){
			game.nowPass = 0;
			uiStart.status = 0;
			uiStart.tick = 0;
			oC.removeEventListener('mousedown', MapEditorMouseDown, false);
		}
	};
	function MapEditorMouseDown(ev){
		var x = ev.clientX - oBox.offsetLeft - oC.offsetLeft - map.translateX ;
		var y = ev.clientY - oBox.offsetTop - oC.offsetTop - map.translateY;
		MapEditorSelectorChange(x, y);
		MapEditorComeGame(x, y);
		MapEditorMousePosTest(x, y);
		document.onmousemove = function(ev){
			var ev = ev||event;
			var x = ev.clientX - oBox.offsetLeft - oC.offsetLeft - map.translateX ;
			var y = ev.clientY - oBox.offsetTop - oC.offsetTop - map.translateY;
			MapEditorMousePosTest(x,y);
		};
		document.onmouseup = function(){
			document.onmousemove = null;
			document.onmouseup = null;
		};
	};