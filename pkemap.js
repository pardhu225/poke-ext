var LEGENDS = [ 'Arceus','Articuno','Azelf',
                'Buzzwole',
                'Celebi','Cobalion','Cresselia','Celesteela',
                'Darkrai','Darkrown', 'Deoxys','Dialga','Diancie',
                'Entei',
                'Genesect','Giratina','Groudon','Guzzlord',
                'Ho-oh','Hoopa',
                'Jirachi',
                'Keldeo','Kyogre','Kyurem','Kartana',
                'Landorus','Latias','Latios','Lugia',
                'Manaphy','Meloetta','Mesprit','Mew','Mewtwo','Moltres',
                'Necrozma','Nihilego','Null',
                'Palkia','Phione','Pheromosa',
                'Raikou','Rayquaza','Regice','Regigigas','Regirock','Registeel','Reshiram','Rotom',
                'Shaymin','Suicune','Silvally',
                'Terrakion','Thundurus','Tornadus','Tapu',
                'Uxie',
                'Victini','Virizion','Volcanion',
                'Xerneas','Xurkitree',
                'Yveltal',
                'Zapdos','Zekrom','Zygarde',
                '-o'];
var WANTED_LIST = [
];
var MOVE_LIMIT = 120 + (Math.floor(Math.random()*50)-25);

/* 	1: top
	2: bottom
	3: left
	4: right
	5: top left
	6: bottom left
	7: top right
	8: bottom right
*/
var id,id2=-1;
var moveCount = 0;
function f() {
	if(id2!=-1)
		clearInterval(id2);
	$("title").text("Searching...");
	var pkm = $("#pkmnappear");
	id = setInterval(function(){
		var poke = getPokemon();
		if(poke==="loading")
			return;
		if(poke==="none") {
      if(moveCount>MOVE_LIMIT) {
      	stop();
        window.location.assign("/map/"+(1 + Math.floor(Math.random() * 25)));
      }
      moveCount++;
			moveRandom();
			return;
		}
		if(isRequiredPokemon(poke)) {
			alert(poke+" appeared.");
			console.log(poke+" appeared.");
			id2 = setInterval(function(){
				$("title").text(poke+" appeared.");
				setTimeout(function(){$("title").text("Abbey chutiye!!!")},1000);
			},2000);
			clearInterval(id);
		} else {
		if(moveCount>MOVE_LIMIT){
			stop();
			window.location.assign("/map/"+(1 + Math.floor(Math.random() * 25)));
		}
			moveCount++;
			moveRandom();
		}
	},500);
};

function moveRandom() {
	var arrows,dir;
	var pos = getPos();
  $("#headerad").html("<div>Moves: "+moveCount+"</div>");
	if(pos.x<=2) {
		if($("#arrows img[data-mapmov$='4']").length===1) {
			$("#arrows img[data-mapmov$='4']").click();
			return;
		}
		if(pos.y>2)
			if($("#arrows img[data-mapmov$='7']").length===1) {
				$("#arrows img[data-mapmov$='7']").click();
				return;
			}
		if(pos.y<24)
			if($("#arrows img[data-mapmov$='8']").length===1) {
				$("#arrows img[data-mapmov$='8']").click();
				return;
			}
	}

	if(pos.x>=30) {
		if($("#arrows img[data-mapmov$='3']").length===1) {
			$("#arrows img[data-mapmov$='3']").click();
			return;
		}
		if(pos.y>2)
			if($("#arrows img[data-mapmov$='5']").length===1) {
				$("#arrows img[data-mapmov$='5']").click();
				return;
			}
		if(pos.y<24)
			if($("#arrows img[data-mapmov$='6']").length===1) {
				$("#arrows img[data-mapmov$='6']").click();
				return;
		}
	}

	if(pos.y<=2) {
		if($("#arrows img[data-mapmov$='2']").length===1) {
			$("#arrows img[data-mapmov$='2']").click();
			return;
		}
		if(pos.x>2)
			if($("#arrows img[data-mapmov$='6']").length===1) {
				$("#arrows img[data-mapmov$='6']").click();
				return;
			}
		if(pos.x<30)
			if($("#arrows img[data-mapmov$='8']").length===1) {
				$("#arrows img[data-mapmov$='8']").click();
				return;
			}
	}

	if(pos.y>=24) {
		if($("#arrows img[data-mapmov$='1']").length===1) {
			$("#arrows img[data-mapmov$='1']").click();
			return;
		}
		if(pos.x>2)
			if($("#arrows img[data-mapmov$='5']").length===1) {
				$("#arrows img[data-mapmov$='5']").click();
				return;
			}
		if(pos.x<30)
			if($("#arrows img[data-mapmov$='7']").length===1) {
				$("#arrows img[data-mapmov$='7']").click();
				return;
			}
	}
	while(true) {
		arrows = $("#arrows table tbody tr img[src*='arrow']");
		dir = Math.round(Math.random()*arrows.length);
		if($(arrows[dir]).attr("src") && $(arrows[dir]).attr("src").indexOf("no.gif")===-1)
			break;
	}
	$(arrows[dir]).click();
};

function getReport(str) {
  str = str.toLowerCase();
  var report = {};
  report["isNonnormal"] = (str.indexOf("shiny ") +
                          str.indexOf("dark ") +
                          str.indexOf("metallic ") +
                          str.indexOf("shadow ") +
                          str.indexOf("mystic ")) !==-5;
  report["isLegend"] = false;
  LEGENDS.forEach(function(curr){
    if(str.indexOf(curr.toLowerCase())!==-1) {
      report["isLegend"] = true;
    }
  });

  report["isUnique"] = (str.indexOf("pb.gif")===-1);
  return report;
}

function isInWantedList(str) {
  str=str.toLowerCase();
  var ret = false;
  WANTED_LIST.forEach(function(curr){
    if(str.indexOf(curr.toLowerCase())!==-1) {
      ret = true;
    }
  });
  return ret;
}
var isRequiredPokemon = function(str) {
  console.log(str);
	var report = getReport(str);
  if(report.isLegend) {
    if(report.isUnique) {
      return true;
    }
    if(report.isNonnormal) {
      return true;
    }
  } else {
    if(isInWantedList(str) && report.isNonnormal) {
      return true;
    }
  }
  return false;
}

var stop = function() {
	clearInterval(id);
	id=-1;
};

//verified
var getPos = function() {
	var i = 0;
	var arrows = $("#arrows table tbody tr img[src*='arrow']");
	for(;$(arrows[i]).attr("src").indexOf("no.gif")!==-1;i++);
	var str = $(arrows[i]).attr("data-mapmov");
	var arr = str.split(",");
	var ret = {
		x:Number(arr[0]),
		y:Number(arr[1]),
	};
	switch(Number(arr[2])) {
		case 1: ret.y++; break;
		case 2: ret.y--; break;
		case 3: ret.x++; break;
		case 4: ret.x--; break;
		case 5: ret.x++; ret.y++; break;
		case 6: ret.x++; ret.y--; break;
		case 7: ret.x--; ret.y++; break;
		case 8: ret.x--; ret.y--; break;
	}
	return ret;
};

//Verified
function getPokemon() {
	var pkm = $("#pkmnappear");
	if(pkm[0].innerHTML==="<b>No wild Pokémon appeared.</b><br><i>Keep moving around to find one.</i>")
		return "none";
	if(pkm[0].innerHTML==="<p class=\"large\">Searching for Pokémon...</p><p>Please wait...</p>")
		return "loading";

	return pkm[0].innerHTML.substring(pkm[0].innerHTML.indexOf("Wild ")+5,pkm[0].innerHTML.indexOf(" appeared."));
}

//Verified
function getLevel() {
	var pok = getPokemon();
	if(pok==="none" || pok==="loading") return -1;

	var str = $($("#pkmnappear form p")[1]).html();
	str = str.substring(7,str.indexOf("<"));
	return Number(str);
}

f();
