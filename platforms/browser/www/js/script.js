const baseServiceUrl = "http://localhost:8080/trs"; 
//const baseServiceUrl = "http://trservice3562.cloudapp.net:8080/trs"; 

var curCountry;
var countryList;
var countrySelectedFromMap = true;
var countryMap = null;

$(document).ready(function(){
	setCurCurrency(parseInt(getCurCurrency()));
	setFTItemsLimit(getFTItemsLimit());
	$(".page-container .bottom_menu .menu_item").click(function(){
		if($(this).hasClass("active")){
			$(".page-content-wrap .bsubmenuwrapper").css({opacity: 0});
			$(".page-content-wrap .bsubmenuwrapper .bsubmenu").hide();
			$(".page-container .bottom_menu .menu_item").removeClass("active");
		}else{
			$(".page-container .bottom_menu .menu_item").removeClass("active");
			$(this).addClass("active");
			$(".page-content-wrap .bsubmenuwrapper").css({opacity: 0});
			$(".page-content-wrap .bsubmenuwrapper .bsubmenu").hide();
			$("#" + $(this).data('submenu')).show();
			$(".page-content-wrap .bsubmenuwrapper").animate({
				opacity: 1,
			  }, 500, function() {
				// Animation complete.
			});
		}
		
	});
	
	
	
});


function compareCountry(a,b) {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

function setValuesFormats(val){
	
	var value = new Number(val);

	if(value == 0) return '0.0';
	if(value > 0){
		if(value<0.1 ){
			return value.toPrecision(1);
		}
		if(value<1){
			return value.toFixed(2);
		}
		if(value<1000){
			return value.toFixed(1);
		}
		return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}else{
		if(value<=-1000) return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		
		if(value<=-1){
			return value.toFixed(0);
		}
		if(value<=-0.1 ){
			return value.toFixed(1)
		}
		return value.toPrecision(1);
	}
}

function HtmlEncode(s)
{
  var el = document.createElement("div");
  el.innerText = el.textContent = s;
  s = el.innerHTML;
  return s;
}

function getCurCurrency(){
	var cur = window.localStorage.getItem('appCurCurrency');
	if(cur == undefined) {
		cur = 1;
	}
	return parseInt(cur);
}

function setCurCurrency(currency){
	window.localStorage.setItem('appCurCurrency', currency);
	var title = "AED Millions ";
	switch(currency){
		case 0: title = "AED Millions ";
			break;
		case 1: title = "USD Millions ";
			break;
		case 2: title = "AED Billions ";
			break;
		case 3: title = "USD Billions ";
			break;
	}
	$("#currency_select #active_value").html(HtmlEncode(title) + " <span class=\"caret\"></span>");
	return currency;
}



function getCurYear(){
	var year = window.localStorage.getItem('appCurYear');
	if(year == undefined) {
		year = "2016";
	}
	return year;
}

function setCurYear(curYear){
	window.localStorage.setItem('appCurYear', curYear);
	return curYear;
}

function getAppLang(){
	
	var lang = window.localStorage.getItem('appLang');
	if(lang == undefined) {
		//var lang = navigator.language.split("-");
		//var current_lang = (lang[0]);
		lang = "EN";
	}
	return lang;
}

function switchAppLang(){
	window.localStorage.setItem('appLang', getAppLang() == "EN"? "AR":"EN");
}



function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }
  return obj;
}


function showLoadingScreen(){
	$('#loadingscreen').show();
}

function hideLoadingScreen(){
	$('#loadingscreen').hide();
}



function getCountryFromList(cid){
	var res = null;
	countryList.data.forEach(function(el) {
			if(el.id == cid){
				res = el;
			}
	});

	return res;
}

function getCountryFromListName(name){
	var res = null;
	countryList.data.forEach(function(el) {
			if(el.name== name){
				res = el;
			}
	});

	return res;
}

function getCountryFromListISO2(ciso2){
	var res = null;
	countryList.data.forEach(function(el) {
			if(el.iso2 == ciso2){
				res = el;
			}
	});
	
	return res;
}

function setActiveCountry(id, fromMap){
	var res = getCountryFromList(id);
	if(res != null) {
		curCountry = res;
		$('#country_select #active_value').html(HtmlEncode(curCountry.name) + " <span class=\"caret\"></span>");
		$('.inlineCountryTitle').html(HtmlEncode(curCountry.name));
		window.localStorage.setItem("appCurCountry", curCountry.id);
		
	}
	if(id == -1 ){
		curCountry = {id:-1, name:''};
		window.localStorage.setItem("appCurCountry", -1);
	}
	countrySelectedFromMap = fromMap;
}

function updateMap(){
	if(!countrySelectedFromMap ) {
		try{/*
			countryMap.clearSelectedRegions()
			countryMap.setSelectedRegions(curCountry.iso2);
			$('#vector_world_map').vectorMap('set', 'focus',curCountry.iso2);*/
		}catch(err){
			
		}
		
	}
	
	countrySelectedFromMap = true;
	
}

function updateGeneralInformation(){
	//showLoadingScreen();
	$.post(baseServiceUrl + "/geninf",
    {
        lang: getAppLang(),
        country: curCountry.id,
    },
    function(data, status){

		var info = data;
		
		if(status == 'success' && info.status == 0){
			
			$(".GICountryTitle .flag img").attr('src', '');
			var image = new Image();

			image.onload = function() {
				$(".GICountryTitle .flag img").attr('src', image.src);
			}
			image.onerror = function() {
				// image did not load
				$(".GICountryTitle .flag img").attr('src', 'img/flags/_defFlag.png');
			}

			image.src = 'img/flags/' + curCountry.name + '.png';
			
			$(".GICountryTitle .name").text(curCountry.name);
			
			$(".GICountryTitle .capital .value").text('-');
			
			var giWrapper  = $('#generalInfo table');
			giWrapper.html('');
			info.data.forEach(function(el) {
				var addElement = true;
				
				if(el.name == 'Capital') {
					$(".GICountryTitle .capital .value").text(el.value);
					addElement = false;
				}
				
				if(el.name == 'Population, in Millions') {
					$(".GICountryTitle .population .value").text(Math.round(el.value) + ' Millions');
					addElement = false;
				}
				if(addElement){
					var giEl = $('<tr><td class="param">'+HtmlEncode(el.name)+'</td><td class="value">'+(el.value ==null || isNaN(el.value) ?el.value:setValuesFormats(el.value))+'</td></tr>');
					giWrapper.append(giEl);
				}
				
				

			});
		}
		//hideLoadingScreen();
    });
	
}



function updateFTYearsList(){
	//showLoadingScreen();
	$.post(baseServiceUrl + "/getftiyears",
    {
        lang: getAppLang(),
        country: curCountry.id,
    },
    function(info, status){
		
		if(status == 'success' && info.status == 0){
			var yearSelectTitle  = $('#year_select #active_value');yearSelectTitle.html("");
			var curYear = getCurYear();
			if($.inArray(curYear, info.data) == -1) curYear = setCurYear(info.data[0]);
			yearSelectTitle.html(HtmlEncode(curYear) + " <span class=\"caret\"></span>");
			var yearSelect  = $('#year_select .dropdown-menu');
			yearSelect.html('');
			info.data.forEach(function(el) {
				var yearEl = $("<li><a href=\"#\" onClick=\"setCurYear($(this).text());$('#year_select #active_value').html(HtmlEncode(getCurYear()) + ' <span class=\\'caret\\'></span>');updateFTItems();\" >" + HtmlEncode(el) + "</a></li>" );
				yearSelect.append(yearEl);
			});
			updateFTItems();
		};
    });
	
}

var FTItems;
var donutChart;

function getFTItemsLimit(){
	var limit = window.localStorage.getItem('FTItemsLimit');
	if(limit == undefined) {
		limit = "5";
	}
	return limit;
}

function setFTItemsLimit(limit){
	
	if(isNormalInteger(limit)){
		window.localStorage.setItem('FTItemsLimit', limit);
		$('#item_count input').val(limit);
		return limit;
	}
	return getFTItemsLimit();
	
}

function isNormalInteger(str) {
    return str >>> 0 === parseFloat(str);
}

function updateFTItems(){
	//showLoadingScreen();
	$.post(baseServiceUrl + "/gettradeitems",
    {
        lang: getAppLang(),
        country: curCountry.id,
		year:getCurYear(),
		limit: getFTItemsLimit(),
		currency:getCurCurrency()
    },
    function(info, status){
		
		if(status == 'success' && info.status == 0){
			FTItems = info.data;
			updateFTItemsTitle();
			
			
			
			showActiveFTData(-1);
		
			updateCategoriesData(0, ".FTItemsCategories .Import");
			updateCategoriesData(1, ".FTItemsCategories .Export");
			updateCategoriesData(2, ".FTItemsCategories .ReExport");
			setSameHeight(".FTItemsCategories .panel-body");
			setSameHeight(".FTItemsSummary .panel-body");
		}
		//hideLoadingScreen();
		
		
		
    });
	
}

function initDonutChart(index){
	$('#donutchart').html('');
			donutChart = Morris.Donut({
				element: 'donutchart',
				data: [
					{label: "Import", value: FTItems.totalImports},
					{label: "Non-Oil Export", value: FTItems.totalNonOilExports},
					{label: "Re-Export", value: FTItems.totalReExports}
				],
				colors: chartColors,
				resize: true,
				formatter: function (value, data) { return setValuesFormats(value); }
			});
			donutChart.on('click', function(i, row){
				showActiveFTData(i);
				
			});
			
			$("#donutchart text tspan").first().html("Total");
			$("#donutchart text tspan").last().html(setValuesFormats(FTItems.totalFT));
			try{
				donutChart.select(index);
			}catch(err){
				
			}
			
}

var chartColors = ['#E04B4A', '#1CAF9A', '#95B75D'];

function updateCategoriesData(index, selector){
	var panelBody = $( selector + " .panel-body");
	panelBody.html("");
	
	var itemsToDisplay;
	var totalValue;
	var chartLabel;
	var chartId;
	var progressBarClass;
	
	switch(index){
		case -1: 
			itemsToDisplay = FTItems.totalItems;
			totalValue = FTItems.totalFT;
			chartLabel = "";
			break;
		case 0: ;
			itemsToDisplay = FTItems.importsItems;
			totalValue = FTItems.totalImports;
			chartLabel = "Import";
			chartId = "chartImport";
			progressBarClass = "valueImport";
			break;
		case 1: 
			itemsToDisplay = FTItems.nonOilExportsItems;
			totalValue = FTItems.totalNonOilExports;
			chartLabel = "Export";
			chartId = "chartExport";
			progressBarClass = "valueExport";
			break;
		case 2: 
			itemsToDisplay = FTItems.reExportsItems;
			totalValue = FTItems.totalReExports;
			chartLabel = "Re-Export";
			chartId = "chartReExport";
			progressBarClass = "valueReExport";
			break;
	}
	
	itemsToDisplay.forEach(function(el, ind, array) {
			var item = $("<div class='item item1'><div class='itemhead'><span class='name' >" + HtmlEncode(el.title) + "<span class='toggleTitles'>&nbsp;>>>&nbsp;</span></span><span class='value'>" + setValuesFormats(el.value) +"</span></div><div class='progress'><div class='progress-bar progress-bar-success " + progressBarClass + " value"  + ind + "' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div></div>");
			panelBody.append(item);
			
	});
	
	
	itemsToDisplay.forEach(function(el, ind, array) {
			setTimeout(function(){
				$(selector + " .progress-bar.value"+ind).css('width', (el.value*100/totalValue) + "%");
			}, 300);
				
	});
	$('#' + chartId + " svg").html("");
	
// Create the donut pie chart and insert it onto the page
nv.addGraph(function() {
  var dntChart = nv.models.pieChart()
  		.x(function(d) {
        return d.label
      })
  		.y(function(d) {
        return d.value
      })
  		.showLabels(false)
  		.showLegend(false)
  		.labelThreshold(.05)
  		.labelType("key")
  		.color([chartColors[index], "#ddd"])
  		.tooltips(false)
  		.donut(true)
  		.donutRatio(0.60);
  
  	// Insert text into the center of the donut
  	function centerText() {
			return function() {
        var svg = d3.select("#" + chartId +" svg");

    		var donut = svg.selectAll("g.nv-slice").filter(
          function (d, i) {
            return i == 0;
          }
        );
        
        // Insert first line of text into middle of donut pie chart
        donut.insert("text", "g")
            .text(chartLabel)
            .attr("class", "middle")
            .attr("text-anchor", "middle")
        		.attr("dy", "-.55em")
        		.style("fill", "#000");
        // Insert second line of text into middle of donut pie chart
        donut.insert("text", "g")
            .text(setValuesFormats(totalValue))
            .attr("class", "middle")
            .attr("text-anchor", "middle")
        		.attr("dy", ".85em")
        		.style("fill", "#000");
      }
    }
  
  // Put the donut pie chart together
  d3.select("#" + chartId +" svg")
    .datum([
    {
      "label": "",
      "value": totalValue
    },
    {
      "label": "",
      "value": FTItems.totalFT - totalValue
    }])
    .transition().duration(300)
    .call(dntChart)
    .call(centerText());
    
  return dntChart;
});


}

function setSameHeight(selector){
	$(selector).css('height', 'auto');
	var maxHeight = Math.max.apply(null, $(selector).map(function (){
		return $(this).height();
	}).get());
	$(selector).height(maxHeight);
}

var activeFTItemsIndex = -1;

function showActiveFTData(index){
	$(".FTItemsSummary").hide();
	$(".FTItemsSummary .front .panel-title").hide();
	$(".FTItemsSummary .front .panel-title.title"+index).show();
	var panelBody = $(".FTItemsSummary .front .panel-body");
	panelBody.html("");
	
	var tiSize = FTItems.totalItems.length;
	
	var itemsToDisplay;
	var totalValue;
	var progressBarClass;
	
	if(activeFTItemsIndex == index) index = -1;
	$('#donutlegend li').removeClass('active');
	initDonutChart(index);
	
	switch(index){
		case -1: 
			itemsToDisplay = FTItems.totalItems;
			totalValue = FTItems.totalFT;
			progressBarClass = "valueTotal";
			break;
		case 0: ;
			itemsToDisplay = FTItems.importsItems;
			totalValue = FTItems.totalImports;
			progressBarClass = "valueImport";
			$('#donutlegend li:eq(0)').addClass('active');
			break;
		case 1: 
			itemsToDisplay = FTItems.nonOilExportsItems;
			totalValue = FTItems.totalNonOilExports;
			progressBarClass = "valueExport";
			$('#donutlegend li:eq(1)').addClass('active');
			break;
		case 2: 
			itemsToDisplay = FTItems.reExportsItems;
			totalValue = FTItems.totalReExports;
			progressBarClass = "valueReExport";
			$('#donutlegend li:eq(2)').addClass('active');
			break;
	}
	itemsToDisplay.forEach(function(el, ind, array) {
			var item = $("<div class='item item1'><div class='itemhead' ><span class='name' >" + HtmlEncode(el.title) + "<span class='toggleTitles'>&nbsp;>>>&nbsp;</span></span><span class='value'>" + setValuesFormats(el.value) +"</span></div><div class='progress'><div class='progress-bar progress-bar-success " + progressBarClass + " value" + ind + "' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div></div>");
			$(item).find('.toggleTitles').click(function(){
				showFTIFullText(".FTItemsSummary.flipBlock" ,HtmlEncode(el.title));
			});
			panelBody.append(item);
			
	});
	
	itemsToDisplay.forEach(function(el, ind, array) {
			setTimeout(function(){
				$(".FTItemsSummary .progress-bar.value"+ind).css('width', (el.value*100/totalValue) + "%");
			}, 300);
				
	});
	activeFTItemsIndex = index;
	$(".FTItemsSummary").show();
}

function showFTIFullText(selector, text){
	$(selector).find(".back .panel-body").text(text);
	$(selector).flip('toggle');
}



function getActiveYearRange(){
	var yearFrom = window.localStorage.getItem('appYearFrom');
	if(yearFrom == undefined) {
		yearFrom = "2014";
	}
	
	var yearTo = window.localStorage.getItem('appYearTo');
	if(yearTo == undefined) {
		yearTo = "2016";
	}
	return [yearFrom, yearTo];
}

function setActiveYearRange(yearFrom, yearTo){
	window.localStorage.setItem('appYearFrom', yearFrom);
	window.localStorage.setItem('appYearTo', yearTo);
}


var yearSlider = null;
function updateYearRangeFTVolume(){
	yearSlider = document.getElementById('year_range_select');
	
	$.post(baseServiceUrl + "/getftiyears",
    {
        lang: getAppLang(),
        country: curCountry.id,
    },
    function(info, status){
		
		if(status == 'success' && info.status == 0){
			var activeRange = getActiveYearRange();
			var minYear = Number.parseInt(info.data[0], 10);
			var maxYear = Number.parseInt(info.data[info.data.length - 1], 10);
			
			if(yearSlider.noUiSlider == undefined){
				noUiSlider.create(yearSlider, {
					start: [(Number.parseInt(activeRange[0]) > minYear ? activeRange[0]:minYear), (Number.parseInt(activeRange[1]) > maxYear ? activeRange[1]:maxYear)],
					connect: true,
					behaviour: 'tap-drag', 
					step: 1,
					tooltips: true,
					format: wNumb({
						decimals: 0
					}),
					range: {
						'min': minYear,
						'max': maxYear
					}
				});
				updateFTVolumeInfo();
				yearSlider.noUiSlider.on('change', function(){
					var activeYears = yearSlider.noUiSlider.get();
					setActiveYearRange(activeYears[0],activeYears[1]);
					updateFTVolumeInfo();
				});
			}else{
				//yearSlider.noUiSlider.set([(Number.parseInt(activeRange[0]) > minYear ? activeRange[0]:minYear), (Number.parseInt(activeRange[1]) > maxYear ? activeRange[1]:maxYear)]);
				
				yearSlider.noUiSlider.updateOptions({
					start: [(Number.parseInt(activeRange[0]) > minYear ? activeRange[0]:minYear), (Number.parseInt(activeRange[1]) > maxYear ? activeRange[1]:maxYear)],
					connect: true,
					behaviour: 'tap-drag', 
					step: 1,
					tooltips: true,
					format: wNumb({
						decimals: 0
					}),
					range: {
						'min': minYear,
						'max': maxYear
					}
				});
				updateFTVolumeInfo();
			}
			
		}
    });

	
}

function updateYearRangeFTBalance(){
	yearSlider = document.getElementById('year_range_select');
	
	$.post(baseServiceUrl + "/getftiyears",
    {
        lang: getAppLang(),
        country: curCountry.id,
    },
    function(info, status){
		
		if(status == 'success' && info.status == 0){
			var activeRange = getActiveYearRange();
			var minYear = Number.parseInt(info.data[0], 10);
			var maxYear = Number.parseInt(info.data[info.data.length - 1], 10);
			
			if(yearSlider.noUiSlider == undefined){
				noUiSlider.create(yearSlider, {
					start: [(Number.parseInt(activeRange[0]) > minYear ? activeRange[0]:minYear), (Number.parseInt(activeRange[1]) > maxYear ? activeRange[1]:maxYear)],
					connect: true,
					behaviour: 'tap-drag', 
					step: 1,
					tooltips: true,
					format: wNumb({
						decimals: 0
					}),
					range: {
						'min': minYear,
						'max': maxYear
					}
				});
				updateFTBalanceInfo();
				updateFTGrowthInfo();
				yearSlider.noUiSlider.on('change', function(){
					var activeYears = yearSlider.noUiSlider.get();
					setActiveYearRange(activeYears[0],activeYears[1]);
					updateFTBalanceInfo();
					updateFTGrowthInfo();
				});
			}else{
				//yearSlider.noUiSlider.set([(Number.parseInt(activeRange[0]) > minYear ? activeRange[0]:minYear), (Number.parseInt(activeRange[1]) > maxYear ? activeRange[1]:maxYear)]);
				
				yearSlider.noUiSlider.updateOptions({
					start: [(Number.parseInt(activeRange[0]) > minYear ? activeRange[0]:minYear), (Number.parseInt(activeRange[1]) > maxYear ? activeRange[1]:maxYear)],
					connect: true,
					behaviour: 'tap-drag', 
					step: 1,
					tooltips: true,
					format: wNumb({
						decimals: 0
					}),
					range: {
						'min': minYear,
						'max': maxYear
					}
				});
				updateFTBalanceInfo();
				updateFTGrowthInfo();
			}
			
		}
    });

	
}


var FTVolumeData;

function updateFTVolumeInfo(){
	var years = getActiveYearRange();
	$.post(baseServiceUrl + "/gettradesummary",
    {
        lang: getAppLang(),
        country: curCountry.id,
		from:years[0],
		to:years[1],
		currency:getCurCurrency()
    },
    function(info, status){
		
		if(status == 'success' && info.status == 0){
			updateFTVolumeTitle();
			FTVolumeData = info.data;
			$(".FTV .tab-pane.categoryInfo").html("");
			
			for(var i=0;i<3;i++) showFTCategoryInfo(i);
			
			//hideLoadingScreen();
		};
    })
}

function updateFTVolumeTitle(){
	$(".FTVTitle .flag img").attr('src', '');
			var image = new Image();

			image.onload = function() {
				$(".FTVTitle .flag img").attr('src', image.src);
			}
			image.onerror = function() {
				// image did not load
				$(".FTVTitle .flag img").attr('src', 'img/flags/_defFlag.png');
			}

			image.src = 'img/flags/' + curCountry.name + '.png';
	
	
	var years = getActiveYearRange();
	$('.inlineYearFrom').text(years[0]);
	$('.inlineYearTo').text(years[1]);
	
	var currString = "";
	var curr = getCurCurrency();
	switch(curr){
		case 0:
		currString = "AED Millions";
			break;
		case 1:
		currString = "USD Millions";
			break;
		case 2:
		currString = "AED Billions";
			break;
		case 3:
		currString = "USD Billions";
			break;
	}
	$('.inlineCurrency').text(currString);
}

function updateFTItemsTitle(){
	$(".FTVTitle .flag img").attr('src', '');
			var image = new Image();

			image.onload = function() {
				$(".FTVTitle .flag img").attr('src', image.src);
			}
			image.onerror = function() {
				// image did not load
				$(".FTVTitle .flag img").attr('src', 'img/flags/_defFlag.png');
			}

			image.src = 'img/flags/' + curCountry.name + '.png';
	
	
	var year = getCurYear()
	$('.inlineYear').text(year);
	
	var currString = "";
	var curr = getCurCurrency();
	switch(curr){
		case 0:
		currString = "AED Millions";
			break;
		case 1:
		currString = "USD Millions";
			break;
		case 2:
		currString = "AED Billions";
			break;
		case 3:
		currString = "USD Billions";
			break;
	}
	$('.inlineCurrency').text(currString);
}

function showFTCategoryInfo(index){
	FTVolumeData.forEach(function(el, i) {
		
			var value = 0;
			var category;
			
			switch(index){
				case 0:value = el.value;
					category = el.totalTrade;
					break;
				case 1:value = el.derectTrade.nonOilExports + el.derectTrade.reExports + el.derectTrade.imports;
					category = el.derectTrade;
					break;
				case 2:value = el.freeZonesTrade.nonOilExports + el.freeZonesTrade.reExports + el.freeZonesTrade.imports;
					category = el.freeZonesTrade;
					break;
			}
			
			var panelBody = '<div class="panel-body">';
			
			panelBody += '<div class="FTVItem">';
			panelBody += '<span>Import</span>';
			panelBody += '<span class="pull-right">' + setValuesFormats(category.imports) + '</span>';
			

			panelBody += "<div class='progress'><div  class='progress-bar progress-bar-success valueImport" + index + " year" + el.year + "' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div>";
			panelBody += '</div>';
			
			panelBody += '<div class="FTVItem">';
			panelBody += '<span>Non-Oil Export</span>';
			panelBody += '<span class="pull-right">' + setValuesFormats(category.nonOilExports) + '</span>';
			
			panelBody += "<div class='progress'><div  class='progress-bar progress-bar-success valueExport" + index + " year" + el.year + "' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div>";
			panelBody += '</div>';
			
			panelBody += '<div class="FTVItem">';
			panelBody += '<span>Re-Export</span>';
			panelBody += '<span class="pull-right">' + setValuesFormats(category.reExports) + '</span>';
			
			panelBody += "<div class='progress'><div class='progress-bar progress-bar-success valueReExport" + index + " year" + el.year + "' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div>";
			panelBody += '</div>';
			
			panelBody += '</div>';
			var panel = '<div class="panel panel-default"><div class="panel-heading"><span class="panel-title">'+el.year +'</span><span class="panel-title pull-right">' + setValuesFormats(value) + '</span></div>' +panelBody+ '</div>';
			
			
			$('.FTV .categoryInfo.cat'+index).prepend($(panel));
			
			if(value > 0){
				setTimeout(function(){
					$(".FTV .progress-bar.valueImport"+index+".year"+el.year).css('width', (category.imports*100/value) + "%");
					$(".FTV .progress-bar.valueExport"+index+".year"+el.year).css('width', (category.nonOilExports*100/value) + "%");
					$(".FTV .progress-bar.valueReExport"+index+".year"+el.year).css('width', (category.reExports*100/value) + "%");
				}, 300);
			}
	});
}

var balanceGraph;
var showBalanceData= [];
function updateFTBalanceInfo(){
	var years = getActiveYearRange();
	updateFTVolumeTitle();
	$.post(baseServiceUrl + "/getftbalance",
    {
        lang: getAppLang(),
        country: curCountry.id,
		from:years[0],
		to:years[1],
		currency:getCurCurrency()
    },
    function(info, status){
		
		if(status == 'success' && info.status == 0){
			
			var years = getActiveYearRange();
			/*showBalanceData = [{key:'', values: []}];
			
			info.data.forEach(function(el, i) {
				if(el.year >= years[0] && el.year <= years[1]){
					var newEl = {label:'', value:0};
					newEl.label = el.year;
					newEl.value = el.value;
					showBalanceData[0].values.push(newEl);
				}
					
			});
			*/
			/*
			showBalanceData = [['Year','', { role: 'style' }, {role: 'tooltip'}]];
			
			info.data.forEach(function(el, i) {
				if(el.year >= years[0] && el.year <= years[1]){
					var newEl = [];
					newEl.push(parseInt(el.year));
					newEl.push(el.value);
					newEl.push(el.value < 0 ? "#E04B4A":"#95B75D");
					newEl.push("" + el.year + "\u000D\u000A" + setValuesFormats(el.value) + "");
					showBalanceData.push(newEl);
				}
					
			});
			
			google.charts.load('current', {packages: ['corechart', 'bar'], callback: showBalanceChart});
			*/
			
			showBalanceData = [];
			
			info.data.forEach(function(el, i) {
				if(el.year >= years[0] && el.year <= years[1]){
					var newEl = {x:0,y:0};
					newEl.x=parseInt(el.year);
					newEl.y=el.value;
					showBalanceData.push(newEl);
				}
					
			});
			showBalanceChart();
			//hideLoadingScreen();
		};
    })
}

function showBalanceChart(){
	$('#balanceChart svg').html('');
		/*	nv.addGraph(function() {

			  var chart = nv.models.discreteBarChart()
				  .x(function(d) { return d.label })    //Specify the data accessors.
				  .y(function(d) { return d.value })
				  .valueFormat(function(d) { return setValuesFormats(d)})
				  .staggerLabels(false)    //Too many bars and not enough room? Try staggering labels.
				  .tooltips(true)        //Don't show tooltips
				  .showValues(false)       //...instead, show the bar value right on top of each bar.
				  .transitionDuration(3500);
				
				chart.xAxis.tickValues(function(d) {
					var dataset = ['0000', '', '', '1234'];

					return dataset;
				});
			  balanceGraph = d3.select('#balanceChart svg')
				  .datum(showBalanceData).transition().duration(3000)
				  .call(chart);
				d3.selectAll("rect.discreteBar")
				.style("fill", function(d, i){
					return d.value < 0 ? "#E04B4A":"#95B75D";
				});			
			  nv.utils.windowResize(chart.update);

			  return chart;
			});
	*/
	
	/*
	 var data = google.visualization.arrayToDataTable(showBalanceData);
		var chartTiks = [];
		var chartWidth = $('#balanceChart svg').width()*0.6;
		var maxTicksCount = Math.floor(chartWidth/30);
		var everyNYear = Math.ceil((showBalanceData.length - 1)/maxTicksCount);
		for(var i = 1;i< showBalanceData.length; i++){
			if(i%everyNYear == 1) chartTiks.push(showBalanceData[i][0]);
		}
      var options = {
        title: '',
		legend: {position: 'none'},
		animation: {
                duration: 3000,
                startup: true //This is the new option
            },
		hAxis: {
			viewWindowMode:'pretty',
			format: '',
			ticks: chartTiks
		}
      };

      var materialChart = new google.visualization.ColumnChart(document.getElementById('balanceChart'));
      materialChart.draw(data, options);
	  */
	  
	  var chart = new CanvasJS.Chart("balanceChart", {
				title: {
					text: ""
				},
				axisX: {
					interval: 1,
					valueFormatString: "#0.#",
				},
				animationEnabled: true,
				animationDuration: 3000,
				data: [{
					type: "stackedColumn",
					dataPoints: showBalanceData,
				}]
			});
			chart.render();
}

function updateFTGrowthInfo(){
	var years = getActiveYearRange();
	$.post(baseServiceUrl + "/getfttotal",
    {
        lang: getAppLang(),
        country: curCountry.id,
		from:years[0],
		to:years[1],
		currency:getCurCurrency()
    },
    function(info, status){
		
		if(status == 'success' && info.status == 0){
			
			var years = getActiveYearRange();
/*
			var showData =  new Array();
			info.data.forEach(function(el, i) {
				if(i>0 && el.year >= years[0] && el.year <= years[1]){
					var newEl = {label:'', value:0};
					newEl.year = el.year;
					newEl.value = Math.round((el.value - info.data[i-1].value)/info.data[i-1].value*100);
					showData.push(newEl);
				}
					
			});
			$('#growthChart').html('');
			balanceGraph = Morris.Area({
				element: 'growthChart',
				data: showData,
				xkey: 'year',
				ykeys: ['value'],
				labels: ['Growth'],
				yLabelFormat:function (y) { return Math.round(y) + "%"; },
				fillOpacity: 0.6,
				hideHover: 'auto',
				behaveLikeLine: true,
				resize: true,
				pointFillColors:['#39c3b0'],
				pointStrokeColors: ['#39c3b0'],
				lineColors:['#1caf9a'],
				formatter: function (value, data) { return Math.round(value) + "%"; }
			});
*/			$('#growthChart').html('');
			var showData =  [];
			info.data.forEach(function(el, i) {
				if(i>0 && el.year >= years[0] && el.year <= years[1]){
					var newEl = {x:0, y:0};
					newEl.x = parseInt(el.year);
					newEl.y = Math.round((el.value - info.data[i-1].value)/info.data[i-1].value*100);
					showData.push(newEl);
				}
					
			});
			var chart = new CanvasJS.Chart("growthChart", {
				title: {
					text: ""
				},
				axisX: {
					interval: 1,
					valueFormatString: "#0.#",
				},
				axisY: {
					valueFormatString: "#0.#",
				},
				animationEnabled: true,
				animationDuration: 3000,

				data: [{
					type: "area",
					dataPoints: showData
				}]
			});
			chart.render();
			//hideLoadingScreen();
		};
    })
}
