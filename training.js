var localStorage = {};
var id ;
var battles=110;
var bc = 0;
var WAIT_TIME = 14100;
var EXP = 0, MONEY = 0;
var CLOCK = 500;

$("#headerad").html("");
var head = document.getElementById("headerad");
head.innerHTML = "";

getObj = ["EXP", "MONEY"];

function clearStorage() {
	var setObj = {};
	setObj["EXP"] = 0;
	setObj["MONEY"] = 0;
	chrome.storage.local.set(setObj);
}

chrome.storage.local.get(getObj, function(result) {
    if(!result["EXP"]) {
    	alert('Exp not found');
    	document.getElementById("headerad").innerHTML += ("<div id='exp'>Experience gained: 0</div>");
    } else {
    	document.getElementById("headerad").innerHTML += ("<div id='exp'>Experience gained: "+(result['EXP']/1000)+"k</div>");
    }

    if(!result["MONEY"]) {
    	alert('Exp found');
    	document.getElementById("headerad").innerHTML += ("<div id='money'>Money gained: 0</div>");
    } else {
    	document.getElementById("headerad").innerHTML += ("<div id='money'>Money gained: "+(result['MONEY']/1000)+"k</div>");
    }
});

/*Helper functions */
var getHP = function() {
	var str = $($("form[action^='/battle.php'] table tbody tr")[1]).find("strong").html();
	return Number(str.substring(str.indexOf(">")+1,str.length));
}

var selectAttack = function(num) {
	if(num<1 || num>4)
		throw new TypeError("Only between 1 and 4, Illegal argument: "+num);
	$($("form[action^='/battle.php']")[1]).find("input[type=radio]")[num-1].checked="checked";
}

var useHealingItem = function(num) {
	var form = $("#itemForm");
	var inputs = form.find("input[type=radio]");
	if(typeof(num)==="undefined") {
		if(!inputs[0].disabled) {
			inputs[0].checked = true;
			form.trigger("submit");
			return;
		}
		if(!inputs[1].disabled) {
			inputs[1].checked = true;
			form.trigger("submit");
			return;
		}
		if(!inputs[2].disabled) {
			inputs[2].checked = true;
			form.trigger("submit");
			return;
		}
		throw new TypeError("No healing item is available.");
	} else {
		if(num<1 || num>3)
			throw new TypeError("Not a valid option for selecting a healing item: "+num);
		if(!inputs[num-1].disabled) {
			inputs[num-1].checked = true;
			form.trigger("submit");
			return;
		}
		throw new TypeError("Healing item not available: "+num);
	}
};


var attack = function() {
	$("input.button-small")[2].dispatchEvent(new MouseEvent("click"));
};

var cont = function() {
	//$("input[value='Continue...']").trigger("click");
	($("input.button-maroon")[1]).dispatchEvent(new MouseEvent("click"));
};

var selectPokemon = function() {
	console.log('Triggering submit of select pokemon');
	($('input.button-small')[1]).dispatchEvent(new MouseEvent("click"));
};

var isLoading = function() {
	return $("#loading").css("visibility") === "visible";
};

var getStatus = function() {
	if($('.errorMsg').length>0)
		return 'err';
	if($($('ul.menu-container li a')[0]).length===1)
		return "won";
	switch($("form").length) {
		case 2: return "select pokemon";
		case 5: return "attack";
		case 3: return "pokemon down";
	}
};

var getDeadPokemon = function() {
	var b = $("input[type=radio]");
	var a = 0;
	for(i=0;i<b.length;i++)
	    if($(b[i]).attr("disabled")==="disabled")
	        a++;
	return a;
};

var stop = function() {
	clearInterval(id);
};

var run = function() {
	var rem = 999;
	id = setInterval(function(){
		if(!isLoading()) {
			var a;
			console.log('Getting status: '+(a=getStatus()));
			switch(a) {
				case "select pokemon":
				rem = remEnemyPokemon();
				console.log('Remaining enemy pokemon: '+rem);
				if(getDeadPokemon()===5){
					alert('gonna die');
					stop();
					return;
				}
				console.log('Selecting pokemon...');
				selectPokemon();
				break;

				case "attack":
				/*if(getHP()<=40) {
					useHealingItem(1);
					attack();
				}
				else*/
				console.log('Attacking...');
				attack();
				break;

				case "pokemon down":
				var d = new Date();
				if(typeof(localStorage.last)==='undefined'){
					console.log('Cont() in 1');
					cont();
				}
				else
					if(rem===1 && d.getTime() - localStorage.last > WAIT_TIME) {
						console.log('Cont() in 2');
						cont();
					}
				else
					if(rem!==1) {
						console.log('Cont() in 3');
						cont();
					}
				/*if(d.getTime() - localStorage.last > WAIT_TIME){
					cont();
				}*/
				break;

				case "won":
				var d = new Date();
				if(typeof(localStorage.last)==='undefined'){
					localStorage.last = d.getTime();
					stop();
					($('ul.menu-container li a')[0]).dispatchEvent(new MouseEvent("click"));
					setTimeout(run,2000);
					// $($('ul.menu-container li a')[0]).trigger('click');
					$("title").html(" BC: "+(++bc));
				}
				else
					localStorage.last = d.getTime();
					stop();
					($('ul.menu-container li a')[0]).dispatchEvent(new MouseEvent("click"));
					setTimeout(run,2000);
					// $($('ul.menu-container li a')[0]).trigger('click');
					$("title").html(" BC: "+(++bc));
				var da = new Date();
				console.log(da.getMinutes()+"m "+da.getSeconds()+'s');
				if(battles===bc)stop();
				var str = $('form p')[1].innerHTML;
			    var patt1 = /[0-9]+/g;
			    while(str.indexOf(",")!==-1)
			    	str = str.replace(",","");
			    str = str.replace(str.slice(str.indexOf("<"), str.lastIndexOf(">")+1), "")
			    var result = str.match(patt1);
			    MONEY += parseInt(result[1]);
			    EXP += parseInt(result[0]);
			    chrome.storage.local.get('EXP', function (result) {
					var setObj = {};
			        if(!result["EXP"]) {
			        	setObj["EXP"] = EXP;
			        	chrome.storage.local.set(setObj);
			        } else {
			        	setObj["EXP"] = result["EXP"] + EXP;
			        	chrome.storage.local.set(setObj);
			        }
			    });
			    chrome.storage.local.get('MONEY', function (result) {
					var setObj = {};
			        if(!result["MONEY"]) {
			        	setObj["MONEY"] = MONEY;
			        	chrome.storage.local.set(setObj);
			        } else {
			        	setObj["MONEY"] = result["MONEY"] + MONEY;
			        	chrome.storage.local.set(setObj);
			        }
			    });

				break;
				case 'err':
				alert('Error has occured');
				stop();
			}
		}
	},CLOCK);
};

var remEnemyPokemon = function() {
	if(getStatus()!=='select pokemon')
		return 'ERROR';
	return($($('.pokemonList')[1]).find('strong').length - ($($('.pokemonList')[1]).find('s').length/2));
};

run();