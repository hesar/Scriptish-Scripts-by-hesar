// ==UserScript==
// @name            eRepublik battle master by hesar (completely rewritten)
// @version         0.91
// @author          hesar
// @id              eRep BM by hesar
// @description     completely rewritten code for new battle page
// @include         http*://*erepublik.com/*/military/battlefield-new/*
// ==/UserScript==

var multiHitRunning = false;
var multiHitCount = 0; //how much to do
var lang = document.evaluate('//meta[@name="language"]',document,null,XPathResult.ANY_UNORDERED_NODE_TYPE,null).singleNodeValue.getAttribute('content');
var currURL		= location.href;			// http://www.erepublik.com/pl/citizen/profile/2622385
var arrURL		= currURL.split('/');	// wersja w tablicy
var BASE_URL	= arrURL[0] + '/' + arrURL[1] + '/' + arrURL[2] + '/' + arrURL[3] + '/';		// http://www.erepublik.com/pl/
var subURL		= currURL.substr(BASE_URL.length);
var defaultMaxFights = 130;


var weaponsFirePower = new Array;
var rank = new Array;

//region weapons fire power
weaponsFirePower['weapon_q1.png'] = 20;
weaponsFirePower['weapon_q2.png'] = 40;
weaponsFirePower['weapon_q3.png'] = 60;
weaponsFirePower['weapon_q4.png'] = 80;
weaponsFirePower['weapon_q5.png'] = 100;
weaponsFirePower['weapon_q6.png'] = 120;
weaponsFirePower['weapon_q7.png'] = 200;
weaponsFirePower['weapon_q10.png'] = 100;
weaponsFirePower['weapon_q10_special.png'] = 100;
//endregion

//region rank array
rank['recruit_0.png'] = 1;
rank['private_0.png'] = 2;
rank['private_1.png'] = 3;
rank['private_2.png'] = 4;
rank['private_3.png'] = 5;
rank['corporal_0.png'] = 6;
rank['corporal_1.png'] = 7;
rank['corporal_2.png'] = 8;
rank['corporal_3.png'] = 9;
rank['sergeant_0.png'] = 10;
rank['sergeant_1.png'] = 11;
rank['sergeant_2.png'] = 12;
rank['sergeant_3.png'] = 13;
rank['lieutenant_0.png'] = 14;
rank['lieutenant_1.png'] = 15;
rank['lieutenant_2.png'] = 16;
rank['lieutenant_3.png'] = 17;
rank['captain_0.png'] = 18;
rank['captain_1.png'] = 19;
rank['captain_2.png'] = 20;
rank['captain_3.png'] = 21;
rank['major_0.png'] = 22;
rank['major_1.png'] = 23;
rank['major_2.png'] = 24;
rank['major_3.png'] = 25;
rank['commander_0.png'] = 26;
rank['commander_1.png'] = 27;
rank['commander_2.png'] = 28;
rank['commander_3.png'] = 29;
rank['lt_colonel_0.png'] = 30;
rank['lt_colonel_1.png'] = 31;
rank['lt_colonel_2.png'] = 32;
rank['lt_colonel_3.png'] = 33;
rank['colonel_0.png'] = 34;
rank['colonel_1.png'] = 35;
rank['colonel_2.png'] = 36;
rank['colonel_3.png'] = 37;
rank['general_0.png'] = 38;
rank['general_1.png'] = 39;
rank['general_2.png'] = 40;
rank['general_3.png'] = 41;
rank['field_marshal_0.png'] = 42;
rank['field_marshal_1.png'] = 43;
rank['field_marshal_2.png'] = 44;
rank['field_marshal_3.png'] = 45;
rank['supreme_marshal_0.png'] = 46;
rank['supreme_marshal_1.png'] = 47;
rank['supreme_marshal_2.png'] = 48;
rank['supreme_marshal_3.png'] = 49;
rank['national_force_0.png'] = 50;
rank['national_force_1.png'] = 51;
rank['national_force_2.png'] = 52;
rank['national_force_3.png'] = 53;
rank['world_class_force_0.png'] = 54;
rank['world_class_force_1.png'] = 55;
rank['world_class_force_2.png'] = 56;
rank['world_class_force_3.png'] = 57;
rank['legendary_force_0.png'] = 58;
rank['legendary_force_1.png'] = 59;
rank['legendary_force_2.png'] = 60;
rank['legendary_force_3.png'] = 61;
rank['god_of_war_0.png'] = 62;
rank['god_of_war_1.png'] = 63;
rank['god_of_war_2.png'] = 64;
rank['god_of_war_3.png'] = 65;
rank['titan_0.png'] = 66;
rank['titan_1.png'] = 67;
rank['titan_2.png'] = 68;
rank['titan_3.png'] = 69;
//endregion

/*
@description: get user level from new battle page
@return userLevel:int
 */
function getUserLevel() {
    var userLevel = parseInt($j(".user_level b").text() , 10);
    return userLevel;
}
/*
@description: calculate damage basing on rank, strength, weapon, number of fights, and bonus
@return  damage (rounded down)
 */
function dmgCalc(militaryRank, strength, weaponPower, fights, bonus) {

	var rankKoef	= (militaryRank - 1)/20 + 0.3;
	var strKoef		= (strength / 10) + 40;
	var weaponKoef	= 1 + weaponPower/100;
	var multiplier = 1; //additional 10% for user over level 100
    if(getUserLevel() > 100) multipilier = 1.10;
	return Math.floor(rankKoef * strKoef * weaponKoef * fights * bonus * multiplier);

}
/*
@description: function for modifying all css styles after all is loaded
 */
function fixStyles() {
    $j('.player_holder').css('top','0');
    /*
     styling for all added html elements
     */
    var styles =
        '<style type="text/css"> ' +
        'div.BHTable { margin-top:-130px; width: 230px; height: 85px; border: 1px solid #777; border-radius: 5px; padding: 6px; background-color: #333;position:relative; } ' +
        'table.BHTable { margin: 0; padding: 2px; width: 100%; font-size: 10px; text-align: left; } ' +
        'table.BHTable tr { height: 10px; line-height: 12px; color: yellow; } ' +
        '#myStatBoxL, #myStatBoxR, #myOverBox { color: #fff; } ' +
        '#myStatBoxL a, #myStatBoxR a, #myOverBox a { color: #abc; } ' +
        '#multihit_start, #hospitals_get, #battlelog_clear {margin-top: 0px; margin-left: 0px; margin-bottom: 0px; position: relative;}' +
        '.pCurrentHit {color: #ffffff;text-shadow: #014471;float: left;display: block;height: 25px;font-size: 12px;line-height: 25px;padding-top: 0pt;padding-right: 5px;padding-bottom: 0pt;padding-left: 5px;background-image: url("/images/modules/pvp/influence_right.png?1321873582");background-position: right center;font-weight: bold; }' +
        '#BHTableL {margin-left: 100px; }' +
        '#BHTableR {margin-right: 100px; }' +
        '#CHTable {}' +
        '</style>';

    $j('head').append(styles);
}
/*
add html to bh windows
 */
function bhStats(att, def) {
    /*
     adding html elements to DOM
     */

    $j('div#BHTableL').remove();
    $j('div#BHTableL').html(
        $j("#console_left").html('<div id="BHTableL" style="margin-top:130px;">' +
        '<div class="BHTable" style="float:left"><table class="BHTable"><tr><th>Citizen</th><th>Kills</th><th>Influence</th></tr>' +
        att +
        '</table></div>')
    );
    $j('div#BHTableR').remove();
    $j('div#BHTableR').html(
        $j("#console_right").html('<div id="BHTableR" style="margin-top:130px;">' +
        '<div class="BHTable" style="float:right"><table class="BHTable"><tr><th>Citizen</th><th>Kills</th><th>Influence</th></tr>' +
        def +
        '</table></div>')
    );
}
/*
add html to CH window
 */
function chStats(hist) {

    $j('#CHTable').remove();
    $j('.drop_protect').append(
        '<div id="CHTable">' +
        '<div class="BHTable" style="margin: 101px 0 0 -74px;"><table class="BHTable"><tr><th>Citizen (CH rank)</th><th>Kills</th><th>Influence</th></tr>' + hist + '</table></div>' +
        '</div>'
    );

}

/*
add multihit block to content div
 */
function addMultiHitBlock() {
    $j('div#content').append(
        '<div id="MHP" style="position:relative;width:836px;float:left;clear:both;padding:3px;margin:5px 0;font-weight:bold;color:#000;text-align:center;">' +
        '<strong>MultiHIT:&nbsp;</strong>' +
        '<input id="multihit_count" type="text" size="3" maxlength="3" value="1" /><button id="multihit_start">HIT!</button>' +
        '&nbsp;&nbsp;<input type="checkbox" id="multihit_food" name="multihit_food" checked="checked"><label for="multihit_food">&nbsp;Eat food when needed</label>' +
        '&nbsp;&nbsp;<input type="checkbox" id="multihit_bazooka" name="multihit_bazooka" checked="checked"><label for="multihit_bazooka">&nbsp;Not use Bazooka</label><br />' +
        '<input type="checkbox" id="multihit_energy" name="multihit_energy"><label for="multihit_energy">&nbsp;Use EnergyBars if no more food</label>' +
        '<div id="multihit_message" style="padding:2px;color:#ff0000"></div></div>' +
        '</div><br />'
    );

}
/*
logging function
 */
function log(text) {
    unsafeWindow.console.log(text);
}

// we start here
function GM_wait() {
	if (typeof unsafeWindow.jQuery18305124430421532034 == 'undefined') {
	    window.setTimeout(GM_wait, 100);
	 }
	else {$j = unsafeWindow.jQuery.noConflict(true);letsJQuery();}

}
GM_wait();

// Main()
function letsJQuery() {

	unsafeWindow.jQuery.fx.off = true;
	// remove idle timer
	$j(document).ready(function() {
		clearInterval(unsafeWindow.globalSleepInterval);
		unsafeWindow.shootLockout = 1;
	});






    $j(document).ajaxSuccess(function(e, res, opt) {
log("ajax called");
        var top5LeftSide = 0;
        var top5RightSide = 0;
        var top5LeftSideKills = 0;
        var top5RightSideKills = 0;
        var top5CHLeftSide =0;
        var top5CHLeftSideKills =0;
        if (opt.url.indexOf('/battle-stats/') > -1 && unsafeWindow.SERVER_DATA.onlySpectator != 1) {

            var att = unsafeWindow.SERVER_DATA.invaderId;
            var def = unsafeWindow.SERVER_DATA.defenderId;

            if (unsafeWindow.SERVER_DATA.mustInvert) {

                att = unsafeWindow.SERVER_DATA.defenderId;
                def = unsafeWindow.SERVER_DATA.invaderId;

            }

            //var bh = $j.parseJSON(res.responseText);
            var zone = unsafeWindow.SERVER_DATA.zoneId;
            var countryId = unsafeWindow.SERVER_DATA.countryId;

            var division = unsafeWindow.SERVER_DATA.division;
            var bh = eval("(" + res.responseText + ")");

            var history = bh['stats']['overall'][0][countryId];

            var top5HIST = '';

            for ( var i = 0; i < history.length; i++ ) {

                top5HIST = top5HIST+'<tr><td><a target="_blank" href="http://www.erepublik.com/'+lang+'/citizen/profile/'+bh.fightersData[history[i].citizen_id].id+'">'+bh.fightersData[history[i].citizen_id].name+'</a></td><td>'+history[i].kills+'</td><td align=right><strong>'+number_format (history[i].damage, 0, '', ' ')+'</strong></td></tr>';
                top5CHLeftSide += parseInt(history[i].damage,10);
                top5CHLeftSideKills += parseInt(history[i].kills,10)
            }
            top5HIST = top5HIST+'<tr style="color:yellow;"><td>Suma influ TOP5:</td><td>'+top5CHLeftSideKills+'</td><td align=right>' + number_format (top5CHLeftSide, 0, '', ' ') + '</td></tr>';
            chStats(top5HIST);

            var top5ABH = '';
            var top5DBH = '';
            var aBH = '';
            var dBH = '';
            if (typeof bh['stats']['current'] == 'undefined') {return;}
            if (typeof bh['stats']['current'][zone] == 'undefined') {return;}

            if (typeof bh['stats']['current'][zone][division][att] != 'undefined') {

                var attID = bh['stats']['current'][zone][division][att][0];

                for ( var i = 0; i < bh['stats']['current'][zone][division][att].length; i++ ) {

                    top5ABH = top5ABH+'<tr><td><a target="_blank" href="http://www.erepublik.com/'+lang+'/citizen/profile/'+bh.fightersData[bh['stats']['current'][zone][division][att][i].citizen_id].id+'">'+bh.fightersData[bh['stats']['current'][zone][division][att][i].citizen_id].name+'</a></td><td>'+bh['stats']['current'][zone][division][att][i].kills+'</td><td align=right><strong>'+number_format (bh['stats']['current'][zone][division][att][i].damage, 0, '', ' ')+'</strong></td></tr>';
                    top5LeftSide += parseInt(bh['stats']['current'][zone][division][att][i].damage,10);
                    top5LeftSideKills += parseInt(bh['stats']['current'][zone][division][att][i].kills,10);

                }

            }
            top5ABH = top5ABH+'<tr style="color:yellow;"><td>Suma influ TOP5:</td><td>'+top5LeftSideKills+'</td><td align=right>' + number_format (top5LeftSide, 0, '', ' ') + '</td></tr>';
            if (typeof bh['stats']['current'][zone][division][def] != 'undefined') {

                var defID = bh['stats']['current'][zone][division][def][0];

                for ( i = 0; i < bh['stats']['current'][zone][division][def].length; i++ ) {

                    top5DBH = top5DBH+'<tr><td><a target="_blank" href="http://www.erepublik.com/'+lang+'/citizen/profile/'+bh.fightersData[bh['stats']['current'][zone][division][def][i].citizen_id].id+'">'+bh.fightersData[bh['stats']['current'][zone][division][def][i].citizen_id].name+'</a></td><td>'+bh['stats']['current'][zone][division][def][i].kills+'</td><td align=right><strong>'+number_format (bh['stats']['current'][zone][division][def][i].damage, 0, '', ' ')+'</strong></td></tr>';
                    top5RightSide +=  parseInt(bh['stats']['current'][zone][division][def][i].damage,10);
                    top5RightSideKills +=  parseInt(bh['stats']['current'][zone][division][def][i].kills,10);
                }

            }
            top5DBH = top5DBH+'<tr style="color:yellow;"><td>Suma influ TOP5:</td><td>'+top5RightSideKills+'</td><td align=right>' + number_format (top5RightSide, 0, '', ' ') + '</td></tr>';


            if (unsafeWindow.SERVER_DATA.mustInvert == false)
                bhStats(top5DBH, top5ABH);
            else
                bhStats(top5ABH, top5DBH);

        }

    });
    addMultiHitBlock();




    $j('button#multihit_start').click(function() {
        if(multiHitRunning) {
            multiHitRunning = false;
            $j('button#multihit_start').html('<strong>HIT</strong>');
        }
        else {
            multiHitRunning = true;
            unsafeWindow.jQuery.fn.multiHIT(); //just call multi hit and it does all magic
        }
    });
//fix styling for battle window
    fixStyles();
} //end of main function

/*
register plugin
 */
unsafeWindow.jQuery.fn.multiHIT = function() {
        //first we check if we can hit and we need to hit
        multiHitCount = $j('input#multihit_count').val(); //how many hits left?

        if (multiHitCount > 0 && !unsafeWindow.globalStop) {

            //we still hit so we need to check if we have enough health or we can eat
            if(unsafeWindow.SERVER_DATA.health < 10 && $j('#multihit_food').is(':checked') == true && unsafeWindow.food_remaining > 10){
                log("we can eat");
                unsafeWindow.energy.eatFood();
                setTimeout($j.fn.multiHIT,1001);
                return;
            }

            log("start we can hit!");
            $j('button#multihit_start').html('<strong>STOP!</strong>');
        }
        else //we end this hitting session
        {   log("stopping");
            $j('button#multihit_start').html('HIT!');
            multiHitRunning = false;
            $j('input#multihit_count').val(1);
            return;
        } //achieved 0

        //now it's fine to shoot

        if( multiHitRunning && unsafeWindow.ERPK.canFire()) {
            unsafeWindow.shoot();
            $j('input#multihit_count').val(multiHitCount = multiHitCount - 1);
            setTimeout($j.fn.multiHIT,1001);

        }
}


function number_format (number, decimals, dec_point, thousands_sep) {
  // http://kevin.vanzonneveld.net
  // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +     bugfix by: Michael White (http://getsprink.com)
  // +     bugfix by: Benjamin Lupton
  // +     bugfix by: Allan Jensen (http://www.winternet.no)
  // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +     bugfix by: Howard Yeend
  // +    revised by: Luke Smith (http://lucassmith.name)
  // +     bugfix by: Diogo Resende
  // +     bugfix by: Rival
  // +      input by: Kheang Hok Chin (http://www.distantia.ca/)
  // +   improved by: davook
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Jay Klehr
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Amir Habibi (http://www.residence-mixte.com/)
  // +     bugfix by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Theriault
  // +      input by: Amirouche
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // *     example 1: number_format(1234.56);
  // *     returns 1: '1,235'
  // *     example 2: number_format(1234.56, 2, ',', ' ');
  // *     returns 2: '1 234,56'
  // *     example 3: number_format(1234.5678, 2, '.', '');
  // *     returns 3: '1234.57'
  // *     example 4: number_format(67, 2, ',', '.');
  // *     returns 4: '67,00'
  // *     example 5: number_format(1000);
  // *     returns 5: '1,000'
  // *     example 6: number_format(67.311, 2);
  // *     returns 6: '67.31'
  // *     example 7: number_format(1000.55, 1);
  // *     returns 7: '1,000.6'
  // *     example 8: number_format(67000, 5, ',', '.');
  // *     returns 8: '67.000,00000'
  // *     example 9: number_format(0.9, 0);
  // *     returns 9: '1'
  // *    example 10: number_format('1.20', 2);
  // *    returns 10: '1.20'
  // *    example 11: number_format('1.20', 4);
  // *    returns 11: '1.2000'
  // *    example 12: number_format('1.2000', 3);
  // *    returns 12: '1.200'
  // *    example 13: number_format('1 000,50', 2, '.', ' ');
  // *    returns 13: '100 050.00'
  // Strip all characters but numerical ones.
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

