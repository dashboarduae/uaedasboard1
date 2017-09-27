//const baseServiceUrl = "http://localhost:8080/trs"; 
const baseServiceUrl = "http://trservice3562.cloudapp.net:8080/trs"; 

var curCountry;
var countryList;
var countrySelectedFromMap = true;
var countryMap = null;


$(document).ready(function(){
	setCurCurrency(parseInt(getCurCurrency()));
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

function setValuesFormats(val){
	var value = new Number(val);
	if(value == 0) return '0.0';
	if(value<0.1){
		return value.toPrecision(1);
	}
	if(value<1){
		return value.toFixed(2);
	}
	if(value<1000){
		return value.toFixed(1);
	}
	
	return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
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
		cur = 0;
	}
	return cur;
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
		year = "";
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
		//console.log( "current_lang: " + current_lang );
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
		window.localStorage.setItem("appCurCountry", curCountry);
	}
	
	countrySelectedFromMap = fromMap;
}

function updateMap(){
	if(!countrySelectedFromMap ) {
		try{
			countryMap.clearSelectedRegions()
			countryMap.setSelectedRegions(curCountry.iso2);
			$('#vector_world_map').vectorMap('set', 'focus',curCountry.iso2);
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
			console.log(info.data);
			console.log(curCountry);
			
			$(".GICountryTitle .flag img").attr('src', '');
			var image = new Image();

			image.onload = function() {
				$(".GICountryTitle .flag img").attr('src', image.src);
			}
			image.onerror = function() {
				// image did not load
				$(".GICountryTitle .flag img").attr('src', 'img/flags/_defFlag.jpg');
			}

			image.src = 'img/flags/' + curCountry.name + '.jpg';
			
			$(".GICountryTitle .name").text(curCountry.name);
			
			$(".GICountryTitle .capital .value").text('-');
			
			var giWrapper  = $('#generalInfo table');
			giWrapper.html('');
			info.data.forEach(function(el) {
				var giEl = $('<tr><td class="param">'+HtmlEncode(el.name)+'</td><td class="value">'+(el.value ==null || isNaN(el.value) ?el.value:setValuesFormats(el.value))+'</td></tr>');
				giWrapper.append(giEl);
				
				if(el.name == 'Capital') $(".GICountryTitle .capital .value").text(el.value);
				
				if(el.name == 'Population, in Millions') $(".GICountryTitle .population .value").text(Math.round(el.value) + ' Millions');
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

function updateFTItems(){
	//showLoadingScreen();
	$.post(baseServiceUrl + "/gettradeitems",
    {
        lang: getAppLang(),
        country: curCountry.id,
		year:getCurYear(),
		limit: 5,
		currency:getCurCurrency()
    },
    function(info, status){
		
		if(status == 'success' && info.status == 0){
			FTItems = info.data;
			//console.log(FTItems);
			
			$('#donutchart').html('');
			donutChart = Morris.Donut({
				element: 'donutchart',
				data: [
					{label: "Import", value: setValuesFormats(FTItems.totalImports)},
					{label: "Export", value: setValuesFormats(FTItems.totalNonOilExports)},
					{label: "Re-Export", value: setValuesFormats(FTItems.totalReExports)}
				],
				colors: chartColors,
				resize: true
			});
			donutChart.on('click', function(i, row){
				showActiveFTData(i);
				
			});
			
			$("#donutchart text tspan").first().html("Total trade");
			$("#donutchart text tspan").last().html(setValuesFormats(FTItems.totalFT));
			try{
				donutChart.select(-1);
			}catch(err){
				
			}
			
			
			
		}
		//hideLoadingScreen();
		
		
		showActiveFTData(-1);
		
		updateCategoriesData(0, ".FTItemsCategories .Import");
		updateCategoriesData(1, ".FTItemsCategories .Export");
		updateCategoriesData(2, ".FTItemsCategories .ReExport");
		setSameHeight(".FTItemsCategories .panel-body");
    });
	
}

var chartColors = ['#95B75D', '#1caf9a', '#FEA223'];

function updateCategoriesData(index, selector){
	var panelBody = $( selector + " .panel-body");
	panelBody.html("");
	
	var itemsToDisplay;
	var totalValue;
	var chartLabel;
	var chartId;
	
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
			break;
		case 1: 
			itemsToDisplay = FTItems.nonOilExportsItems;
			totalValue = FTItems.totalNonOilExports;
			chartLabel = "Export";
			chartId = "chartExport";
			break;
		case 2: 
			itemsToDisplay = FTItems.reExportsItems;
			totalValue = FTItems.totalReExports;
			chartLabel = "ReExport";
			chartId = "chartReExport";
			break;
	}
	
	itemsToDisplay.forEach(function(el, ind, array) {
			var item = $("<div class='item item1'><div class='itemhead'><span class='name' >" + HtmlEncode(el.title) + "</span><span class='value'><span class=\"fa fa-question\" data-toggle=\"popover\" data-placement=\"top\" data-content=\""+HtmlEncode(el.title)+"\"></span>" + setValuesFormats(el.value) +"</span></div><div class='progress'><div class='progress-bar progress-bar-success value" + ind + "' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div></div>");
			panelBody.append(item);
			
	});
	
	
	itemsToDisplay.forEach(function(el, ind, array) {
			setTimeout(function(){
				$(selector + " .progress-bar.value"+ind).css('width', (el.value*100/totalValue) + "%");
			}, 300);
				
	});
	$('[data-toggle="popover"]').popover(); 
	$('#' + chartId + " svg").html("");
	
// Create the donut pie chart and insert it onto the page
nv.addGraph(function() {
  var donutChart = nv.models.pieChart()
  		.x(function(d) {
        return d.label
      })
  		.y(function(d) {
        return d.value
      })
  		.showLabels(true)
  		.showLegend(false)
  		.labelThreshold(.05)
  		.labelType("key")
  		.color([chartColors[index], "#ddd"])
  		.tooltipContent(
        function(key, y, e, graph) { return 'Custom tooltip string' }
      ) // This is for when I turn on tooltips
  		.tooltips(false)
  		.donut(true)
  		.donutRatio(0.55);
  
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
            .text(totalValue)
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
    .call(donutChart)
    .call(centerText());
    
  return donutChart;
});


}

function setSameHeight(selector){
	$(selector).css('height', 'auto');
	var maxHeight = Math.max.apply(null, $(selector).map(function (){
		return $(this).height();
	}).get());
	$(selector).height(maxHeight);
}

function showActiveFTData(index){

	$(".FTItemsSummary .panel-title").hide();
	$(".FTItemsSummary .panel-title.title"+index).show();
	var panelBody = $(".FTItemsSummary .panel-body");
	panelBody.html("");
	
	var tiSize = FTItems.totalItems.length;
	
	var itemsToDisplay;
	var totalValue;
	
	switch(index){
		case -1: 
			itemsToDisplay = FTItems.totalItems;
			totalValue = FTItems.totalFT;
			break;
		case 0: ;
			itemsToDisplay = FTItems.importsItems;
			totalValue = FTItems.totalImports;
			break;
		case 1: 
			itemsToDisplay = FTItems.nonOilExportsItems;
			totalValue = FTItems.totalNonOilExports;
			break;
		case 2: 
			itemsToDisplay = FTItems.reExportsItems;
			totalValue = FTItems.totalReExports;
			break;
	}
	
	itemsToDisplay.forEach(function(el, ind, array) {
			var item = $("<div class='item item1'><div class='itemhead' ><span class='name' >" + HtmlEncode(el.title) + "</span><span class='value'><span class=\"fa fa-question\" data-toggle=\"popover\" data-placement=\"top\" data-content=\""+HtmlEncode(el.title)+"\"></span>" + setValuesFormats(el.value) +"</span></div><div class='progress'><div class='progress-bar progress-bar-success value" + ind + "' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div></div>");
			panelBody.append(item);
			
	});
	
	itemsToDisplay.forEach(function(el, ind, array) {
			setTimeout(function(){
				$(".FTItemsSummary .progress-bar.value"+ind).css('width', (el.value*100/totalValue) + "%");
			}, 300);
				
	});
	
	$('[data-toggle="popover"]').popover();
}



function getActiveYearRange(){
	var yearFrom = window.localStorage.getItem('appYearFrom');
	if(yearFrom == undefined) {
		yearFrom = "2000";
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
				yearSlider.noUiSlider.on('change', function(){
					var activeYears = yearSlider.noUiSlider.get();
					setActiveYearRange(activeYears[0],activeYears[1]);
					updateFTBalanceInfo();
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
			}
			
		}
    });

	
}

function updateYearRangeFTGrowth(){
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
				updateFTGrowthInfo();
				yearSlider.noUiSlider.on('change', function(){
					var activeYears = yearSlider.noUiSlider.get();
					setActiveYearRange(activeYears[0],activeYears[1]);
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
			console.log(info.data);
			FTVolumeData = info.data;
			$(".FTV .tab-pane.categoryInfo").html("");
			
			for(var i=0;i<3;i++) showFTCategoryInfo(i);
			
			//hideLoadingScreen();
		};
    })
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
			panelBody += '<span>Import</span>';
			panelBody += '<span class="pull-right">' + setValuesFormats(category.imports) + '</span>';
			
			panelBody += "<div class='progress'><div class='progress-bar progress-bar-success valueImport" + index + "' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div>";
			
			panelBody += '<span>Export</span>';
			panelBody += '<span class="pull-right">' + setValuesFormats(category.nonOilExports) + '</span>';
			
			panelBody += "<div class='progress'><div class='progress-bar progress-bar-success valueExport" + index + "' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div>";
			
			panelBody += '<span>Re-Export</span>';
			panelBody += '<span class="pull-right">' + setValuesFormats(category.reExports) + '</span>';
			
			panelBody += "<div class='progress'><div class='progress-bar progress-bar-success valueReExport" + index + "' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div>";
			
			panelBody += '</div>';
			var panel = '<div class="panel panel-default"><div class="panel-heading"><span class="panel-title">'+el.year +'</span><span class="panel-title pull-right">' + setValuesFormats(value) + '</span></div>' +panelBody+ '</div>';
			
			setTimeout(function(){
				$(".FTV .progress-bar.valueImport"+index).css('width', (category.imports*100/value) + "%");
				$(".FTV .progress-bar.valueExport"+index).css('width', (category.nonOilExports*100/value) + "%");
				$(".FTV .progress-bar.valueReExport"+index).css('width', (category.reExports*100/value) + "%");
			}, 300);
			
			$('.FTV .categoryInfo.cat'+index).prepend($(panel));
	});
}

var balanceGraph;
function updateFTBalanceInfo(){
	var years = getActiveYearRange();
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
			
			var showData = new Array();
			info.data.forEach(function(el, i) {
				if(el.year >= years[0] && el.year <= years[1])
					showData.push(el);
			});
			
			$('#lineChart').html('');
			balanceGraph = Morris.Line({
				element: 'lineChart',
				data: showData,
				xkey: 'year',
				ykeys: ['value'],
				labels: ['Trade Balance'],
				yLabelFormat:function (y) { return setValuesFormats(y); },
				fillOpacity: 0.6,
				  hideHover: 'auto',
				  behaveLikeLine: true,
				  resize: true,
				  pointFillColors:['#ffffff'],
				  pointStrokeColors: ['black'],
				  lineColors:['gray']
			});
			//hideLoadingScreen();
		};
    })
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
			console.log(info.data);
			var years = getActiveYearRange();
			
			var showData = new Array();
			info.data.forEach(function(el, i) {
				if(i>0 && el.year >= years[0] && el.year <= years[1]){
					var newEl = {year:'', value:0};
					newEl.year = el.year;
					newEl.value = Math.round((el.value - info.data[i-1].value)/info.data[i-1].value*100);
					showData.push(newEl);
				}
					
			});
			
			$('#lineChart').html('');
			balanceGraph = Morris.Line({
				element: 'lineChart',
				data: showData,
				xkey: 'year',
				ykeys: ['value'],
				labels: ['Trade Growth'],
				fillOpacity: 0.6,
				yLabelFormat:function (y) { return y.toString() + '%'; },
				  hideHover: 'auto',
				  behaveLikeLine: true,
				  resize: true,
				  pointFillColors:['#ffffff'],
				  pointStrokeColors: ['black'],
				  lineColors:['gray']
			});
			//hideLoadingScreen();
		};
    })
}
