//const baseServiceUrl = "http://localhost:8080/trs"; 
const baseServiceUrl = "http://trservice3562.cloudapp.net:8080/trs"; 

var curCountry;
var countryList;
var countrySelectedFromMap = true;
var countryMap = null;

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

$(document).ready(function(){setCurCurrency(parseInt(getCurCurrency()));});

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
	showLoadingScreen();
	$.post(baseServiceUrl + "/geninf",
    {
        lang: getAppLang(),
        country: curCountry.id,
    },
    function(data, status){

		var info = data;
		if(status == 'success' && info.status == 0){
			var giWrapper  = $('#generalInfo table');
			giWrapper.html('');
			info.data.forEach(function(el) {
				var giEl = $('<tr><td class="param">'+HtmlEncode(el.name)+'</td><td class="value">'+(el.value ==null || isNaN(el.value) ?el.value:Math.round((parseFloat(el.value))*10)/10)+'</td></tr>');
				giWrapper.append(giEl);
			});
		}
		hideLoadingScreen();
    });
	
}



function updateFTYearsList(){
	showLoadingScreen();
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
		}else hideLoadingScreen();
    });
	
}

var FTItems;
var donutChart;

function updateFTItems(){
	showLoadingScreen();
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
					{label: "Import", value: FTItems.totalImports},
					{label: "Export", value: FTItems.totalNonOilExports},
					{label: "Re-Export", value: FTItems.totalReExports}
				],
				colors: chartColors,
				resize: true
			});
			donutChart.on('click', function(i, row){
				showActiveFTData(i);
				
			});
			
			$("#donutchart text tspan").first().html("Total trade");
			$("#donutchart text tspan").last().html(FTItems.totalFT);
			try{
				donutChart.select(-1);
			}catch(err){
				
			}
			
			
			
		}
		hideLoadingScreen();
		
		
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
			var item = $("<div class='item item1'><div class='itemhead'><span class='name'>" + HtmlEncode(el.title) + "</span><span class='value'>" + Number(el.value).toFixed(1) +"</span></div><div class='progress'><div class='progress-bar progress-bar-success value" + ind + "' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div></div>");
			panelBody.append(item);
			
	});
	
	itemsToDisplay.forEach(function(el, ind, array) {
			setTimeout(function(){
				$(selector + " .progress-bar.value"+ind).css('width', (el.value*100/totalValue) + "%");
			}, 300);
				
	});
	
	
	
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
			var item = $("<div class='item item1'><div class='itemhead'><span class='name'>" + HtmlEncode(el.title) + "</span><span class='value'>" + Number(el.value).toFixed(1) +"</span></div><div class='progress'><div class='progress-bar progress-bar-success value" + ind + "' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div></div>");
			panelBody.append(item);
			
	});
	
	itemsToDisplay.forEach(function(el, ind, array) {
			setTimeout(function(){
				$(".FTItemsSummary .progress-bar.value"+ind).css('width', (el.value*100/totalValue) + "%");
			}, 300);
				
	});
	
	
}



