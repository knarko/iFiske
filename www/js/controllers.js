AREAS =
{
	2: {
		"ID": 2,
		"c1": "46",
		"c2": "0",
		"car": "0",
		"eng": "0",
		"hcp": "0",
		"kw": "",
		"lat": "58.500870",
		"lng": "15.724869",
		"m1": "279",
		"m2": "282",
		"m3": "0",
		"map": "",
		"mod": "1396014299",
		"note": "",
		"pnt": "0",
		"wsc": "1",
		"zoom": "10",

		"t": "Roxen",
		"d": "Roxen Ã¤r en sjÃ¶ pÃ¥ c:a 10.000 ha belÃ¤gen i centrala ÃstergÃ¶tland. SjÃ¶n genomstrÃ¶mmas av Motala StrÃ¶m pÃ¥ vÃ¤gen frÃ¥n VÃ¤ttern till BrÃ¥viken. ↵↵Roxen Ã¤r en relativt grund sjÃ¶ med max djup pÃ¥ c:a 7 meter och med ett medeldjup pÃ¥ ca 4,7 meter. SjÃ¶n Ã¤r en typisk nÃ¤ringsrik slÃ¤ttsjÃ¶ vilket Ã¥terspeglas av det mycket rika fÃ¥gellivet. ↵↵I vÃ¤ster har sjÃ¶n en bredd pÃ¥ cirka 6 kilometer och dÃ¤r stÃ¶mmar Motala strÃ¶m, SvartÃ¥n samt StÃ¥ngÃ¥n ut i sjÃ¶n. I Ã¶ster avsmalnar Roxen till en lÃ¥ngstrÃ¤ckt vik. I dessÃ¶stligaste Ã¤nde, vid Norsholm, fortsÃ¤tter sedan Motala strÃ¶m norrut mot sjÃ¶n Glan.↵↵Genom mÃ¥lmedvetet arbete till stÃ¶d fÃ¶r fÃ¶ryngring under mÃ¥nga Ã¥r har sjÃ¶n 24 olika arter fisk med sÃ¤llsynta arter som asp tillsammans med gÃ¤dda, abborre, gÃ¶s, Ã¥l osv. FÃ¶r nÃ¤rvarnade pÃ¥gÃ¥r arbete att fÃ¶rbÃ¤ttra lekomrÃ¥den fÃ¶r nors och gÃ¶s tillsammans med Tekniska Verken som driver kraftverk uppstrÃ¶ms sjÃ¶n. Den rÃ¶dlistade fiskarten asp finns i sjÃ¶systemet.↵↵BÃ¥tramper:↵Kungsbro - Kontakta Anders tel: 0706-06 06 61↵Idingstad SÃ¤teri - Kontakta Lars-Owe tel: 013-71 274 ↵BÃ¥t finns att hyra i Kungsbro (MotalastrÃ¶ms mynning) av Anders 0706-06 06 61",

		"img": "http://www.ifiske.se/photos/2/Sun_ray_in_the_woods_1920_x_1200_widescreen.jpg",


		"region_name": "Östergötland",

		image: {
			"background-image": "url(http://www.ifiske.se/photos/2/Sun_ray_in_the_woods_1920_x_1200_widescreen.jpg)"
		},
	},
	7: {
		ID: 7,
		c1: "46",
		c2: "0",
		car: "1",
		d: "This is a lake that doesn't exist.<br><br>It is a demo of iFiske only.",
		eng: "0",
		hcp: "0",
		kw: "",
		lat: "58.406029",
		lng: "15.582733",
		m1: "279",
		m2: "0",
		m3: "0",
		map: "/pdf/1/",
		mod: "1400664378",
		note: "",
		pnt: "0",
		t: "Demosjön",
		wsc: "1",
		zoom: "10"
	}
}

angular.module('ifiske.controllers', [])

.controller('AreasCtrl', function($scope) {
	$scope.items = AREAS;
})

.controller('AreaDetailCtrl', function($scope, $stateParams) {
	$scope.area = AREAS[$stateParams.id];
})

.controller('LoginCtrl', function($scope) {
});

