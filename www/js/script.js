//const baseServiceUrl = "http://localhost:8080/trs"; 
//const baseServiceUrl = "http://trservice.us-east-1.elasticbeanstalk.com";
const baseServiceUrl = "http://trservicetest.us-east-1.elasticbeanstalk.com"
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

function setValuesFormatsInt(val){
	
	var value = new Number(val);

	if(value == 0) return '0';
	if(value > 0){

		return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
	var title = tr("AED Millions");
	switch(currency){
		case 0: title = tr("AED Millions");
			break;
		case 1: title = tr("USD Millions");
			break;
		case 2: title = tr("AED Billions");
			break;
		case 3: title = tr("USD Billions");
			break;
	}
	$("#currency_select #active_value").html(title + " <span class=\"caret\"></span>");
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
	location.reload();
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
		$('#country_select2 .chosen-select').val(HtmlEncode(curCountry.name)).trigger('change.select2');
		window.localStorage.setItem("appCurCountry", curCountry.id);
		
	}
	if(id == -1 ){
		curCountry = {id:-1, name:''};
		window.localStorage.setItem("appCurCountry", -1);
	}
	countrySelectedFromMap = fromMap;
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

			image.src = 'img/flags/' + curCountry.id + '.png';
			
			$(".GICountryTitle .name").text(curCountry.name);
			
			$(".GICountryTitle .capital .value").text('-');
			
			var giWrapper  = $('#generalInfo table');
			giWrapper.html('');
			info.data.forEach(function(el) {
				var addElement = true;
				
				if(el.weight == 1) {
					$(".GICountryTitle .capital .value").text(el.value);
					addElement = false;
				}
				
				if(el.weight == 3) {
					$(".GICountryTitle .population .value").text(setValuesFormatsInt(Math.round(parseFloat(el.value.replace(/[^\d\.]/g,'') ))) + ' ' + tr('Millions'));
					addElement = false;
				}
				if(addElement){
					var title = HtmlEncode(el.name);
					var value = (el.value ==null || isNaN(el.value) ?el.value:setValuesFormats(el.value));
					var giEl = getAppLang() !='AR' ? '<tr><td class="param">'+title+'</td><td class="value">'+value+'</td></tr>' : '<tr><td class="value">'+value+'</td><td class="param">'+title+'</td></tr>'
					giWrapper.append($(giEl));
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
		$('#item_count #active_value').html(limit + " <span class=\"caret\"></span>");
		return limit;
	}
	
	if(limit == -1) {
		window.localStorage.setItem('FTItemsLimit', limit);
		$('#item_count #active_value').html(tr('All') + " <span class=\"caret\"></span>");
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
			setSameHeight(".FTItemsCategories .FTItems  .name .full");
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
					{label: tr("Import"), value: FTItems.totalImports},
					{label: tr("Non-Oil Export"), value: FTItems.totalNonOilExports},
					{label: tr("Re-Export"), value: FTItems.totalReExports}
				],
				colors: chartColors,
				resize: true,
				formatter: function (value, data) { return setValuesFormats(value); }
			});
			donutChart.on('click', function(i, row){
				showActiveFTData(i);
				
			});
			
			$("#donutchart text tspan").first().html(tr("Total"));
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
			chartLabel = tr("Import");
			chartId = "chartImport";
			progressBarClass = "valueImport";
			break;
		case 1: 
			itemsToDisplay = FTItems.nonOilExportsItems;
			totalValue = FTItems.totalNonOilExports;
			chartLabel = tr("Export");
			chartId = "chartExport";
			progressBarClass = "valueExport";
			break;
		case 2: 
			itemsToDisplay = FTItems.reExportsItems;
			totalValue = FTItems.totalReExports;
			chartLabel = tr("Re-Export");
			chartId = "chartReExport";
			progressBarClass = "valueReExport";
			break;
	}
	
	itemsToDisplay.forEach(function(el, ind, array) {
			var string = el.title
			var length = 27;
			var trimmedString = string.length > length ? 
								string.substring(0, length - 3) + "..." : 
								string;
		
			var item = $("<div class='item item1'><div class='itemhead'><div class='progress'><div class='progress-bar progress-bar-success " + progressBarClass + " value"  + ind + "' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div><div class='value'>" + setValuesFormats(el.value) +"</div></div><div class='name' ><div class='full'>" + HtmlEncode(string) + "</div><div class='short'>"  + HtmlEncode(trimmedString) + "</div></div></div>");
			$(item).click(function(){
				$('.FTItems .item .name').toggleClass('expand');
				setSameHeight(".FTItemsCategories .FTItems  .name .full");
			});
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
    .transition().duration(1200)
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
	
	var panelBody = $(".FTItemsSummary .front .panel-body");
	panelBody.html("");
	
	var tiSize = FTItems.totalItems.length;
	
	var itemsToDisplay;
	var totalValue;
	var progressBarClass;
	
	if(activeFTItemsIndex == index) index = -1;
	
	$(".FTItemsSummary").hide();
	$(".FTItemsSummary .front .panel-title").hide();
	$(".FTItemsSummary .front .panel-title.title"+index).show();
	
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
			var string = el.title
			var length = 40;
			var trimmedString = string.length > length ? 
								string.substring(0, length - 3) + "..." : 
								string;
								
			var item = $("<div class='item item1'><div class='itemhead'><div class='progress'><div class='progress-bar progress-bar-success " + progressBarClass + " value"  + ind + "' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div><div class='value'>" + setValuesFormats(el.value) +"</div></div><div class='name' ><div class='full'>" + HtmlEncode(string) + "</div><div class='short'>"  + HtmlEncode(trimmedString) + "</div></div></div>");
			$(item).click(function(){
				$('.FTItems .item .name').toggleClass('expand');
				setSameHeight(".FTItemsSummary .panel-body");
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
	//$(selector).flip('toggle');
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
					direction: getAppLang('EN')? 'ltr':'rtl',
					tooltips: true,
					format: wNumb({
						decimals: 0
					}),
					range: {
						'min': minYear,
						'max': maxYear
					}
				});
				
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
				
			}
			var activeYears = yearSlider.noUiSlider.get();
				setActiveYearRange(activeYears[0],activeYears[1]);
				updateFTVolumeInfo();
			
		}
    });

	
}


function updateYearRangeACV(){
	yearSlider = document.getElementById('year_range_select');
	updateACVTitle();
	$(".FTV .categoryInfo").html("");
	$.post(baseServiceUrl + "/acvyears",
    {
        lang: getAppLang(),
        country: curCountry.id,
    },
    function(info, status){
		var activeRange = getActiveYearRange();
		var minYear = activeRange[0];
		var maxYear = activeRange[1];
		if(status == 'success' && info.status == 0 && info.data[0].minYear > 0){
			
			minYear = info.data[0].minYear;
			maxYear = info.data[0].maxYear;
			
			if(minYear == maxYear) maxYear++;
			activeRange[0] = Number.parseInt(activeRange[0]);
			activeRange[1] = Number.parseInt(activeRange[1]);
			if(activeRange[0] == activeRange[1]) {activeRange[0] = minYear; activeRange[1] = maxYear;}
			activeRange[0] = (Number.parseInt(activeRange[0]) > minYear ? activeRange[0]:minYear);
			activeRange[1] = (Number.parseInt(activeRange[1]) > maxYear ? activeRange[1]:maxYear);
			
			
			
		}else{
			
		}
		console.log(activeRange);console.log(minYear);console.log(maxYear);
		if(yearSlider.noUiSlider == undefined){
				noUiSlider.create(yearSlider, {
					start: activeRange,
					connect: true,
					behaviour: 'tap-drag', 
					step: 1,
					direction: getAppLang('EN')? 'ltr':'rtl',
					tooltips: true,
					format: wNumb({
						decimals: 0
					}),
					range: {
						'min': minYear,
						'max': maxYear
					}
				});
				var activeYears = yearSlider.noUiSlider.get();
				setActiveYearRange(activeYears[0],activeYears[1]);
				updateACVInfo();
				yearSlider.noUiSlider.on('change', function(){
					var activeYears = yearSlider.noUiSlider.get();
					setActiveYearRange(activeYears[0],activeYears[1]);
					updateACVInfo();
				});
			}else{
				//yearSlider.noUiSlider.set([(Number.parseInt(activeRange[0]) > minYear ? activeRange[0]:minYear), (Number.parseInt(activeRange[1]) > maxYear ? activeRange[1]:maxYear)]);
				
				yearSlider.noUiSlider.updateOptions({
					start: activeRange,
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
				var activeYears = yearSlider.noUiSlider.get();
				setActiveYearRange(activeYears[0],activeYears[1]);
				updateACVInfo();
			}
    });

	
}

function updateACVInfo(){
	var years = getActiveYearRange();
	updateACVTitle();
	$('.FTV .categoryInfo').html("");
	$.post(baseServiceUrl + "/acv",
    {
        lang: getAppLang(),
        country: curCountry.id,
		subject: 'Bilateral Agreements',
		from:years[0],
		to:years[1]
    },
    function(info, status){
		
		if(status == 'success' && info.status == 0){
			console.log(info.data)
			var dataLength = info.data.length;
			for(var i = 0; i < dataLength; i++){
				var panelBody = '<div class="panel-body"><div class="FTVItem">'+ HtmlEncode(info.data[i].explain) +'</div></div>';
				
				var panel = '<div class="panel panel-default"><div class="panel-heading"><span class="panel-title">'+HtmlEncode(info.data[i].date) +'</span></div>' +panelBody+ '</div>';
				
				
				$('.FTV .categoryInfo.cat0').prepend($(panel));
			}
		};
    });
	$.post(baseServiceUrl + "/acv",
    {
        lang: getAppLang(),
        country: curCountry.id,
		subject: 'Joint Economic Committees',
		from:years[0],
		to:years[1]
    },
    function(info, status){
		
		if(status == 'success' && info.status == 0){
			console.log(info.data)
			var dataLength = info.data.length;
			for(var i = 0; i < dataLength; i++){
				var panelBody = '<div class="panel-body"><div class="FTVItem">'+ HtmlEncode(info.data[i].explain) +'</div></div>';
				
				var panel = '<div class="panel panel-default"><div class="panel-heading"><span class="panel-title">'+HtmlEncode(info.data[i].date) +'</span></div>' +panelBody+ '</div>';
				
				
				$('.FTV .categoryInfo.cat1').prepend($(panel));
			}
		};
    });
	$.post(baseServiceUrl + "/acv",
    {
        lang: getAppLang(),
        country: curCountry.id,
		subject: 'Delegations and Visits',
		from:years[0],
		to:years[1]
    },
    function(info, status){
		
		if(status == 'success' && info.status == 0){
			console.log(info.data)
			var dataLength = info.data.length;
			for(var i = 0; i < dataLength; i++){
				var panelBody = '<div class="panel-body"><div class="FTVItem">'+ HtmlEncode(info.data[i].explain) +'</div></div>';
				
				var panel = '<div class="panel panel-default"><div class="panel-heading"><span class="panel-title">'+HtmlEncode(info.data[i].date) +'</span></div>' +panelBody+ '</div>';
				
				
				$('.FTV .categoryInfo.cat2').prepend($(panel));
			}
		};
    });
	
}

function updateACVTitle(){
	$(".FTVTitle .flag img").attr('src', '');
			var image = new Image();

			image.onload = function() {
				$(".FTVTitle .flag img").attr('src', image.src);
			}
			image.onerror = function() {
				// image did not load
				$(".FTVTitle .flag img").attr('src', 'img/flags/_defFlag.png');
			}

			image.src = 'img/flags/' + curCountry.id + '.png';
	
	
	var years = getActiveYearRange();
	var lang = getAppLang();
	if(lang == 'EN')
		$('.FTVTitle .value.FTVText').html('<span class="inlineYearFrom"></span> to <span class="inlineYearTo"></span>');
	else
		$('.FTVTitle .value.FTVText').html('<span class="inlineYearFrom"></span> حتى <span class="inlineYearTo"></span>');
	
	$('.inlineYearFrom').text(years[0]);
	$('.inlineYearTo').text(years[1]);
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
					direction: getAppLang('EN')? 'ltr':'rtl',
					tooltips: true,
					format: wNumb({
						decimals: 0
					}),
					range: {
						'min': minYear,
						'max': maxYear
					}
				});
				
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
			}
			var activeYears = yearSlider.noUiSlider.get();
			setActiveYearRange(activeYears[0],activeYears[1]);
			updateFTBalanceInfo();
			updateFTGrowthInfo();
			
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

			image.src = 'img/flags/' + curCountry.id + '.png';
	
	
	var years = getActiveYearRange();
	var lang = getAppLang();
	if(lang == 'EN')
		$('.FTVTitle .value.FTVText').html('<span class="inlineYearFrom"></span> to <span class="inlineYearTo"></span> (in <span class="inlineCurrency"></span>)');
	else
		$('.FTVTitle .value.FTVText').html('<span class="inlineYearFrom"></span> حتى <span class="inlineYearTo"></span> (<span class="inlineCurrency"></span>)');
	
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
	$('.inlineCurrency').text(tr(currString));
}

function updateInvestmentFactsTitle(){
	$(".FTVTitle .flag img").attr('src', '');
			var image = new Image();

			image.onload = function() {
				$(".FTVTitle .flag img").attr('src', image.src);
			}
			image.onerror = function() {
				// image did not load
				$(".FTVTitle .flag img").attr('src', 'img/flags/_defFlag.png');
			}

			image.src = 'img/flags/' + curCountry.id + '.png';
			
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
	$('.inlineCurrency').text(tr(currString));
}

function updateInvestmentFactsInfo(){
	updateInvestmentFactsTitle();
	$(".inflowFDIValue").text("0");$(".inflowFDIPeriod").text("");
	console.log("curCountry.id");
	console.log(curCountry.id);
	$.post(baseServiceUrl + "/inflowfdi",
    {
        lang: getAppLang(),
        country: curCountry.id,
		currency:getCurCurrency()
    },
    function(info, status){
		
		if(status == 'success' && info.status == 0){
			console.log("INFlow");
			console.log(info.data);
			$(".inflowFDIPeriod").text("("+info.data[0].period+")");
			$(".inflowFDIValue").text(setValuesFormats(info.data[0].value));
		}
    });
	
	
	$(".outflowFDIValue").text("0");$(".outflowFDIPeriod").text("");
	$.post(baseServiceUrl + "/outflowfdi",
    {
        lang: getAppLang(),
        country: curCountry.id,
		currency:getCurCurrency()
    },
    function(info, status){
		
		if(status == 'success' && info.status == 0){
			console.log("OUTFlow");
			console.log(info.data);
			$(".outflowFDIPeriod").text("("+info.data[0].period+")");
			$(".outflowFDIValue").text(setValuesFormats(info.data[0].value));
		}
    });
	$(".compCount, .agenCount, .tmCount").text("0");
	$.post(baseServiceUrl + "/act",
    {
        lang: getAppLang(),
        country: curCountry.id,
    },
    function(info, status){
		
		if(status == 'success' && info.status == 0){
			console.log("ACT");
			console.log(info.data);
			$(".agenCount").text(setValuesFormatsInt(info.data[0].agencies));
			$(".compCount").text(setValuesFormatsInt(info.data[0].companies));
			$(".tmCount").text(setValuesFormatsInt(info.data[0].trademark));
		}
    });
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

			image.src = 'img/flags/' + curCountry.id + '.png';
	var lang = getAppLang();
	if(lang == 'EN')
		$('.FTVTitle .value.FTIText').html('<span class="inlineYear"></span>  (in <span class="inlineCurrency"></span>), top items');
	else
		$('.FTVTitle .value.FTIText').html('<span class="inlineYear"></span>  (<span class="inlineCurrency"></span>)');
	
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
	$('.inlineCurrency').text(tr(currString));
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
			panelBody += '<span>' + tr('Import') + '</span>';
			panelBody += '<span class="pull-right">' + setValuesFormats(category.imports) + '</span>';
			

			panelBody += "<div class='progress'><div  class='progress-bar progress-bar-success valueImport" + index + " year" + el.year + "' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div>";
			panelBody += '</div>';
			
			panelBody += '<div class="FTVItem">';
			panelBody += '<span>' + tr('Non-Oil Export') + '</span>';
			panelBody += '<span class="pull-right">' + setValuesFormats(category.nonOilExports) + '</span>';
			
			panelBody += "<div class='progress'><div  class='progress-bar progress-bar-success valueExport" + index + " year" + el.year + "' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div>";
			panelBody += '</div>';
			
			panelBody += '<div class="FTVItem">';
			panelBody += '<span>' + tr('Re-Export') + '</span>';
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
			
			showBalanceData = [];
			
			info.data.forEach(function(el, i) {
				if(el.year >= years[0] && el.year <= years[1]){
					var newEl = {label:'',y:0,x:0,color:"#b0c986"};
					newEl.label = el.year;
					newEl.x = parseInt(el.year);
					newEl.y = Math.abs(el.value)< 1000?parseFloat(setValuesFormats(el.value)):Math.round(el.value);
					newEl.color = el.value > 0 ? "#b0c986":"#f44040";
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

	  
	  var chart = new CanvasJS.Chart("balanceChart", {
				title: {
					text: ""
				},
				axisX: {
					interval: showBalanceData.length<7?1:2,
					valueFormatString: "#0.#",
				},
				animationEnabled: true,
				animationDuration: 1500,
				data: [{
					type: "stackedColumn",
					dataPoints: showBalanceData,
					toolTipContent:"<div style='text-align:center;'>{label}</br>{y}",
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
	$('#growthChart').html('');
			var showData =  [];
			info.data.forEach(function(el, i) {
				if(i>0 && el.year >= years[0] && el.year <= years[1]){
					var newEl = {x:0, y:0, label:''};
					newEl.x = parseInt(el.year);
					newEl.label = el.year;
					newEl.y = Math.round((el.value - info.data[i-1].value)/info.data[i-1].value*100);
					showData.push(newEl);
				}
					
			});
			var chart = new CanvasJS.Chart("growthChart", {
				title: {
					text: ""
				},
				axisX: {
					interval: showData.length<7?1:2,
					valueFormatString: "#0.#",
					minimum: showData[0].x,
					maximum: showData[showData.length-1].x
				},
				axisY: {
					         
					suffix: "%",
					interlacedColor: "#F5F5F5",
					gridColor: "transparent",
					tickColor: "transparent",
					valueFormatString: "#0.#",
				},
				theme: "theme2",
				animationEnabled: true,
				animationDuration: 1500,
				

				data: [{
					type: "area",color: "#7fdfd1",
					toolTipContent: "<div style='text-align:center;'>{label}</br>{y}%</div>",
					lineThickness: 2,
					dataPoints: showData
				}]
			});
			chart.render();
			
			
			//hideLoadingScreen();
		};
    })
}


function tr(string){
	var stringsLength = appStrings.length;
	for(var i = 0;i<stringsLength;i++){
		if(appStrings[i][0] === string){
			if(getAppLang() == 'AR'){
				return appStrings[i][1];
			}
		}
	}
	return string;
}

function updateMap(){
	if(!countrySelectedFromMap ) {
		try{
			countryMap.clearSelectedRegions()
			countryMap.setSelectedRegions(curCountry.iso2);
			countrySelectedFromMap = false;
			
		}catch(err){
			
		}
		
	}
	$('#vector_world_map').vectorMap('set', 'focus',curCountry.iso2);
	countrySelectedFromMap = true;
}