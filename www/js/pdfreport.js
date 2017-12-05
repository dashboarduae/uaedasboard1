var pdf;
var pdfOutput;
var appLang;

var docDefinition;

var pdfCatFiter = 287;

var pdfInternals;
var pdfPageSize;
var pdfPageWidth;
var pdfPageHeight;


var logoLoaded = false;
var logoLoadedDataURLImage;
var imgLogo  = new Image();

var sectionHeaderLoaded = false;
var sectionHeaderLoadedDataURLImage;
var sectionHeader  = new Image();

var tvIconLoaded = false;
var tvIconDataURLImage;
var imgTVIcon  = new Image();

var ftiIconLoaded = false;
var ftiIconDataURLImage;
var imgFTIIcon  = new Image();

var flagLoaded = false;
var flagLoadedDataURLImage;
var imgFlag  = new Image();

var giLoaded = false;
var giLoadedDataURLImage;
var imgGI  = new Image();

var agrLoaded = false;
var agrLoadedDataURLImage;
var imgAgr  = new Image();

var ifIconLoaded = false;
var ifIconDataURLImage;
var imgIFIcon  = new Image();

var inflowIconLoaded = false;
var inflowIconDataURLImage;
var imgInflowIcon  = new Image();

var outflowIconLoaded = false;
var outflowIconDataURLImage;
var imgOutflowIcon  = new Image();

var tradeGrowthIconLoaded = false;
var tradeGrowthIconDataURLImage;
var imgTrageGrowthIcon  = new Image();




var reportDataLoaded = false;
var reportData;

var curCountryLoaded = false;

var chartBalanceLoaded = false;
var chartBalanceDataURLImage;

var chartGrowthDataURLImage;
var chartGrowthLoaded = false;

var donutChart0Rendered = false;
var donutChart1Rendered = false;
var donutChart2Rendered = false;

var mapIsReady = false;
var mapDataURLImage;

var loadingDialog;


var maxReportProgress;
var currentProgess;

$(document).ready(function(){	
	$(document.body).addClass('lng'+ getAppLang());
	loadingDialog = $("#loadingReport");

	$.ajaxSetup({
			type: 'POST',
			timeout: 5000,
			error: function(xhr) {
				alert(tr('Please check internet is not connection'));
			}
	});
	$('#loadingReport').circleProgress({
		value: 0,
		size: $('#loadingReport').width(),
		startAngle:-Math.PI/2,
		animation:false,
		fill:"#b78a35",
		insertMode:'append',
	});
	$('.reportFiter input[type="checkbox"]').change(function() {
		if($(this).is(":checked")) {
            pdfCatFiter = pdfCatFiter | $(this).data('category');
        }else{
			pdfCatFiter = pdfCatFiter & ~($(this).data('category'));
		}
		
	});
	hideReportGeneratingWindow();
	$.post(baseServiceUrl + "/list",
		{
			lang: getAppLang(),
			dataType: 'jsonp',
		},
		function(data, status){
			countryList  = data;
			if(status == 'success' && countryList.status === 0) {
				
				var menu  = $('#country_select .dropdown-menu');
				menu.html('');
				countryList.data.sort(compareCountry);
				for(var i = 0;i<countryList.data.length; i++){
					var country = $('<li><a href="#" onClick="setActiveCountry(' + countryList.data[i].id + ', false);">' + HtmlEncode(countryList.data[i].name) + '</a></li>');
					menu.append(country);
					
					
					var country2 = $('<option onClick="setActiveCountry(' + countryList.data[i].id + ', false);"></option>');
					country2.text(HtmlEncode(countryList.data[i].name));
					$('#country_select2 .chosen-select').append(country2);
				}
				
				var cntrySelect = $('#country_select2 .chosen-select').select2();
				$('#country_select2 .chosen-select').on('select2:open', function (e) {
					$('.select2-search--dropdown').show();
					$('.select2-search input').prop('focus',false);
				});
				$('#country_select2 .chosen-select').on('select2:select', function (e) {
					var cCountry = getCountryFromListName(cntrySelect.val());
					setActiveCountry(cCountry.id, false);
				});
				
				var curC = window.localStorage.getItem('appCurCountry');
				if(curC == undefined) {
					curC = -1;
				}					
				setActiveCountry(curC, false);	
				curCountryLoaded = true;
			}
	});
	
});

var showData = [];

function reLoadData(){
	appLang = getAppLang();
	
	showReportGeneratingWindow();
	reportDataLoaded = flagLoaded = giLoaded = agrLoaded = ifIconLoaded = inflowIconLoaded = outflowIconLoaded = tradeGrowthIconLoaded =
	chartBalanceLoaded = chartGrowthLoaded = tvIconLoaded = ftiIconLoaded = donutChart0Rendered = donutChart1Rendered = donutChart2Rendered =
	mapIsReady = false;
	showBalanceData = [];
	showData = [];
	
	maxReportProgress = 20+5;
	currentProgess = 0;
	if(pdfCatFiter & 1) maxReportProgress += 10;
	if(pdfCatFiter & 2) maxReportProgress += 10;
	if(pdfCatFiter & 4)  maxReportProgress += 10;
	if(pdfCatFiter & 24) maxReportProgress += 10;
	if(pdfCatFiter & 256) maxReportProgress += 10;
	if(pdfCatFiter & 32) maxReportProgress += 10;
	if(pdfCatFiter & 64) maxReportProgress += 10;
	if(pdfCatFiter & 128) maxReportProgress += 10;
	
	var years = getActiveYearRange();
	$.post(baseServiceUrl + "/pdfreport",
				{
					lang: appLang,
					country: curCountry.id,
					catfilter: pdfCatFiter,
					from:years[0],
					to:years[1],
					year:getCurYear(),
					limit:getFTItemsLimit(),
					currency:getCurCurrency()
				},
				function(data, status){

					var info = data;
					
					if(status == 'success' && info.status == 0){
						reportData = info.data;
						console.log(reportData);
						
						reportDataLoaded = true;
						
						if(pdfCatFiter & 1){
							$('#vector_world_map').html("");
							countryMap = new jvm.WorldMap({container: $('#vector_world_map'),
                                map: 'world_mill_en', 
                                backgroundColor: '#B3D1FF',                                      
                                regionsSelectable: true,
								regionsSelectableOne: true,
                                regionStyle: {selected: {fill: '#1b1e24'},
                                                initial: {fill: '#FFFFFF'}},
                                });
							setTimeout(
								function(){
									countryMap.clearSelectedRegions()
									countryMap.setSelectedRegions(curCountry.iso2);
									$('#vector_world_map').vectorMap('set', 'focus',curCountry.iso2);
									
									mapIsReady = true;
									
								}, 
							100);
							
						}else{
							mapIsReady = true;
						}
						
						if((pdfCatFiter & 24 )!= 0){
							var years = getActiveYearRange();
								
							reportData.ftBalance.forEach(function(el, i) {
									if(el.year >= years[0] && el.year <= years[1]){
										var newEl = {label:'',y:0,x:0,color:"#b0c986"};
										newEl.label = el.year;
										newEl.x = parseInt(el.year);
										newEl.y = Math.abs(el.value)< 1000?parseFloat(setValuesFormats(el.value)):Math.round(el.value);
										newEl.color = el.value > 0 ? "#b0c986":"#f44040";
										showBalanceData.push(newEl);
									}
										
								});
						
							showReportBalanceChart();
							
							
							$('#balanceChart canvas:last-of-type').remove();
							chartBalanceDataURLImage = document.querySelector('#balanceChart canvas').toDataURL("image/jpeg");
							chartBalanceLoaded = true;
							
							showData =  [];
							reportData.ftTotal.forEach(function(el, i) {
								if(i>0 && el.year >= years[0] && el.year <= years[1]){
									var newEl = {x:0, y:0, label:''};
									newEl.x = parseInt(el.year);
									newEl.label = el.year;
									newEl.y = Math.round((el.value - reportData.ftTotal[i-1].value)/reportData.ftTotal[i-1].value*100);
									showData.push(newEl);
								}
									
							});
							
							showReportGrowthChart();
							
							$('#growthChart canvas:last-of-type').remove();
							chartGrowthDataURLImage = document.querySelector('#growthChart canvas').toDataURL("image/jpeg");
							chartGrowthLoaded = true;
							
						}else{
							chartGrowthLoaded = chartBalanceLoaded = true
						}
						
						if((pdfCatFiter & 4 )!= 0){
							drawDonutChart(0);
							drawDonutChart(1);
							drawDonutChart(2);
						}else{
							donutChart0Rendered = donutChart1Rendered = donutChart2Rendered = true;
						}
						
					}
				});
	loadResurces();
}


function loadResurces(){
	imgLogo.onload = function() {
		var canvas = document.createElement('canvas');
            canvas.width = imgLogo.width;
            canvas.height = imgLogo.height;

            var context = canvas.getContext('2d');
            context.drawImage(imgLogo, 0, 0);
			context.fillStyle = '#ffffff'; 

            logoLoadedDataURLImage = canvas.toDataURL('image/jpeg');
			logoLoaded = true;
			
	};	
	imgLogo.src = (appLang == "EN" ? "img/pdf/logo.png" : "img/pdf/logo_ar.png");
	
	
	sectionHeader.onload = function() {
		var canvas = document.createElement('canvas');
            canvas.width = sectionHeader.width;
            canvas.height = sectionHeader.height;

            var context = canvas.getContext('2d');
            context.drawImage(sectionHeader, 0, 0);

            sectionHeaderLoadedDataURLImage = canvas.toDataURL('image/jpeg');
			sectionHeaderLoaded = true;
			
	};	
	sectionHeader.src = (appLang == "EN" ? "img/pdf/sectionheder.png": "img/pdf/sectionheder_ar.png");
	
	imgFlag.onload = function() {
		var canvas = document.createElement('canvas');
            canvas.width = imgFlag.width;
            canvas.height = imgFlag.height;

            var context = canvas.getContext('2d');
            context.drawImage(imgFlag, 0, 0); 

            flagLoadedDataURLImage = canvas.toDataURL('image/png');
			flagLoaded = true;
			
	};	
	imgFlag.src = "img/flags/" + curCountry.id + ".png";
	
	imgGI.onload = function() {
		var canvas = document.createElement('canvas');
            canvas.width = imgGI.width;
            canvas.height = imgGI.height;

            var context = canvas.getContext('2d');
            context.drawImage(imgGI, 0, 0);

            giLoadedDataURLImage = canvas.toDataURL('image/png');
			giLoaded = true;
			
	};	
	imgGI.src = "img/pdf/giicon.png";
	
	imgAgr.onload = function() {
		var canvas = document.createElement('canvas');
            canvas.width = imgAgr.width;
            canvas.height = imgAgr.height;

            var context = canvas.getContext('2d');
            context.drawImage(imgAgr, 0, 0);

            agrLoadedDataURLImage = canvas.toDataURL('image/png');
			agrLoaded  = true;
			
	};	
	imgAgr.src = "img/pdf/agricon.png";
	
	imgIFIcon.onload = function() {
		var canvas = document.createElement('canvas');
            canvas.width = imgIFIcon.width;
            canvas.height = imgIFIcon.height;

            var context = canvas.getContext('2d');
            context.drawImage(imgIFIcon, 0, 0);

            ifIconDataURLImage  = canvas.toDataURL('image/png');
			ifIconLoaded  = true;
			
	};	
	imgIFIcon.src = "img/pdf/ificon.png";
	
	imgInflowIcon.onload = function() {
		var canvas = document.createElement('canvas');
            canvas.width = imgInflowIcon.width;
            canvas.height = imgInflowIcon.height;

            var context = canvas.getContext('2d');
            context.drawImage(imgInflowIcon, 0, 0);

            inflowIconDataURLImage = canvas.toDataURL('image/png');
			inflowIconLoaded  = true;
			
	};	
	imgInflowIcon.src = "img/pdf/inflowicon.png";
	
	imgOutflowIcon.onload = function() {
		var canvas = document.createElement('canvas');
            canvas.width = imgOutflowIcon.width;
            canvas.height = imgOutflowIcon.height;

            var context = canvas.getContext('2d');
            context.drawImage(imgOutflowIcon, 0, 0);

            outflowIconDataURLImage = canvas.toDataURL('image/png');
			outflowIconLoaded  = true;
			
	};	
	imgOutflowIcon.src = "img/pdf/outflowicon.png";
	
	imgTrageGrowthIcon.onload = function() {
		var canvas = document.createElement('canvas');
            canvas.width = imgTrageGrowthIcon.width;
            canvas.height = imgTrageGrowthIcon.height;

            var context = canvas.getContext('2d');
            context.drawImage(imgTrageGrowthIcon, 0, 0);

            tradeGrowthIconDataURLImage = canvas.toDataURL('image/png');
			tradeGrowthIconLoaded  = true;
			
	};	
	imgTrageGrowthIcon.src = "img/pdf/tradegrowthicon.png";
	
	
	imgTVIcon.onload = function() {
		var canvas = document.createElement('canvas');
            canvas.width = imgTVIcon.width;
            canvas.height = imgTVIcon.height;

            var context = canvas.getContext('2d');
            context.drawImage(imgTVIcon, 0, 0);

            tvIconDataURLImage = canvas.toDataURL('image/png');
			tvIconLoaded  = true;
			
	};	
	imgTVIcon.src = "img/pdf/tradevoumeicon.png";
	
	imgFTIIcon.onload = function() {
		var canvas = document.createElement('canvas');
            canvas.width = imgFTIIcon.width;
            canvas.height = imgFTIIcon.height;

            var context = canvas.getContext('2d');
            context.drawImage(imgFTIIcon, 0, 0);

            ftiIconDataURLImage = canvas.toDataURL('image/png');
			ftiIconLoaded = true;
			
	};	
	imgFTIIcon.src = "img/pdf/ftiIcon.png";
}

function isAllDataReady(){
	return tvIconLoaded && chartBalanceLoaded && logoLoaded && curCountryLoaded && flagLoaded && giLoaded && ifIconLoaded && agrLoaded  && reportDataLoaded && tradeGrowthIconLoaded && ftiIconLoaded && donutChart0Rendered && donutChart1Rendered && donutChart2Rendered && mapIsReady;
}

function getPDFPageTemplate(){
	pdf.setFontSize(12);
    pdf.setTextColor(48, 48, 48);	
	pdf.setFontType("normal");
				
	pdf.text([tr('Non-Oil Foreign Trade Relation Report'),tr('between The United Arab Emirates and'),curCountry.name], 125, 16);
	//pdf.text('between The United Arab Emirates and', 125, 21.5);
	//pdf.text(curCountry.name, 125, 27);
		
	pdf.addImage(logoLoadedDataURLImage, "jpeg", 10, 10, 80, 0);
	pdf.addImage(sectionHeaderLoadedDataURLImage, "jpeg", 0, 50, pdfPageWidth, 0);

	pdf.addImage(flagLoadedDataURLImage, "png", 31, 50.7, 10, 0);	
	
	pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
	pdf.text(curCountry.name, 43, 56);
	
	
	
	pdf.setFontSize(8);
    pdf.setTextColor(48, 48, 48);	
	pdf.text('Published by: Analysis,Trade Information Department - Foreign Trade Sector', 10, 280);
	pdf.text('Last update: May 2017', 10, 284);
	pdf.text('All copyrights reserved 2017 - UAE Ministry of Economy', 10, 288);
	
}

function showReportBalanceChart(){
	$('#balanceChart svg').html('');

	  
	  var chart = new CanvasJS.Chart("balanceChart", {
				title: {
					text: ""
				},
				axisX: {
					interval: showBalanceData.length<7?1:2,
					valueFormatString: "#0.#",
				},
				data: [{
					type: "stackedColumn",
					dataPoints: showBalanceData,
					toolTipContent:"<div style='text-align:center;'>{label}</br>{y}",
				}]
			});
			chart.render();
}

function showReportGrowthChart(){

	$('#growthChart').html('');  
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
				data: [{
					type: "area",color: "#7fdfd1",
					toolTipContent: "<div style='text-align:center;'>{label}</br>{y}%</div>",
					lineThickness: 2,
					dataPoints: showData
				}]
			});
			chart.render();
}

var pageIndex = 0;

function genProgressBarCanvas(color, value, rtl){
	var headerCanvas = document.createElement('canvas');
        headerCanvas.width = 600; 
        headerCanvas.height = 20;
		
	var ctx=headerCanvas.getContext("2d");
		
		ctx.rect(0,0,600,20);
		ctx.stroke();
	
		ctx.fillStyle=color;
		if(rtl){
			ctx.fillRect(599*(1-value),1,599,19);
		}else{
			ctx.fillRect(1,1,599*value,19);
		}
		

	return headerCanvas.toDataURL('image/png');
}

function genTradeVolume(){
	if(pageIndex++ > 0){
		pdf.addPage();
	}
	
	getPDFPageTemplate();
	
	pdf.setFontSize(24);
	pdf.setTextColor(255, 255, 255);
	pdf.text(tr('Trade Volume'), 31, 70);
	
	pdf.addImage(tvIconDataURLImage, "png", 17.5, 64, 5, 0);
	
	pdf.setFontSize(10);
	var years = getActiveYearRange();
	pdf.text(tr('Year: ' + years[0] + "-" + years[1]), 105, 56.5);
		
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
	
	pdf.text(tr('Currency: '+currString), pdfPageWidth-10, 56.5, 'right');
	
	var headerCanvas = document.createElement('canvas');
        headerCanvas.width = 300; 
        headerCanvas.height = 39;
		
	var ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#2c2c2c";
		ctx.fillRect(0,0,279,39);
		
		ctx.beginPath();
		ctx.moveTo(279,0);
		ctx.lineTo(300,22.5);
		ctx.lineTo(279,39);
		ctx.fill();
			
		ctx.fillStyle="#b68a35";
		ctx.fillRect(0,0,39,39);
		
		
		
	var headerDataURLImage = headerCanvas.toDataURL('image/png');
	
	headerCanvas = document.createElement('canvas');
        headerCanvas.width = 300; 
        headerCanvas.height = 39;
		
	ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#b68a35";
		ctx.fillRect(0,0,300,39);
			
		ctx.fillStyle="#2c2c2c";
		ctx.fillRect(0,0,39,39);
		
		ctx.fillStyle="#ffffff";
		ctx.beginPath();
		ctx.moveTo(9,9);
		ctx.lineTo(30,9);
		ctx.lineTo(19.5,30);
		ctx.fill();
	
	var headerDataURLImage2 = headerCanvas.toDataURL('image/png');
	
	headerCanvas = document.createElement('canvas');
        headerCanvas.width = 300; 
        headerCanvas.height = 39;
		
	ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#b68a35";
		ctx.fillRect(0,0,279,39);
		
		ctx.beginPath();
		ctx.moveTo(279,0);
		ctx.lineTo(300,22.5);
		ctx.lineTo(279,39);
		ctx.fill();
			
		
	var headerDataURLImage3 = headerCanvas.toDataURL('image/png');
	
	headerCanvas = document.createElement('canvas');
        headerCanvas.width = 300; 
        headerCanvas.height = 39;
		
	ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#2c2c2c";
		ctx.fillRect(0,0,300,39);
		
			
		
	var headerDataURLImage4 = headerCanvas.toDataURL('image/png');
	
	headerCanvas = document.createElement('canvas');
        headerCanvas.width = 300; 
        headerCanvas.height = 70;
		
	ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#f1f1f1";
		ctx.fillRect(0,0,300,70);
	
	var exportBG =  headerCanvas.toDataURL('image/png');
	
	
	pdf.addImage(headerDataURLImage, "png", 10, 80, 56, 0);
	
	pdf.addImage(headerDataURLImage2, "png", 76, 80, 56, 0);
	
	pdf.addImage(headerDataURLImage2, "png", 142, 80, 56, 0);
	
	
	pdf.setFontSize(12);
	pdf.setTextColor(255, 255, 255);
	pdf.text(tr('Total'), 20, 85);
	
	pdf.text(tr('Direct'), 86, 85);
	
	pdf.text(tr('Free Zone'), 152, 85);
	
	if(reportData.ftv!=null && reportData.ftv.length>0){
		var ftvLength = reportData.ftv.length;
		var BlockHeight = 45;
		for(var i = 0; i<reportData.ftv.length; i++){
			var curData = reportData.ftv[ftvLength - i - 1];
			
			pdf.addImage(headerDataURLImage3, "png", 10, 93 + (i % 4)*BlockHeight, 56, 0);	
			pdf.addImage(headerDataURLImage4, "png", 76, 93 + (i % 4)*BlockHeight, 56, 0);
			pdf.addImage(headerDataURLImage4, "png", 142, 93 + (i % 4)*BlockHeight, 56, 0);
			
			pdf.setFontSize(10);
			pdf.setTextColor(255, 255, 255);
			pdf.text(curData.year, 12, 98 + (i % 4)*BlockHeight);
		
			pdf.text(curData.year, 78, 98 + (i % 4)*BlockHeight);
		
			pdf.text(curData.year, 144, 98 + (i % 4)*BlockHeight);
			
			var totalDerectTrade = curData.derectTrade.imports + curData.derectTrade.nonOilExports + curData.derectTrade.reExports;
			var totalFreeZonesTrade = curData.freeZonesTrade.imports + curData.freeZonesTrade.nonOilExports + curData.freeZonesTrade.reExports;
			
			pdf.text(setValuesFormats(curData.value), 62, 98 + (i % 4)*BlockHeight, 'right');
		
			pdf.text(setValuesFormats(totalDerectTrade), 130, 98 + (i % 4)*BlockHeight, 'right');
		
			pdf.text(setValuesFormats(totalFreeZonesTrade), 196, 98 + (i % 4)*BlockHeight, 'right');
			
			pdf.setFontSize(10);
			pdf.setTextColor(44, 44, 44);
			pdf.addImage(exportBG, "png", 10, 112 + (i % 4)*BlockHeight, 56, 0);
			pdf.text(tr('Import'), 12, 106 + (i % 4)*BlockHeight);
			pdf.text(setValuesFormats(curData.totalTrade.imports), 62, 106 + (i % 4)*BlockHeight, 'right');
			pdf.addImage(genProgressBarCanvas("#1ca6af", curData.value==0?0:curData.totalTrade.imports/curData.value, false), "png", 12, 108 + (i % 4)*BlockHeight, 50, 0);
			pdf.text(tr('Non-Oil Export'), 12, 118 + (i % 4)*BlockHeight);
			pdf.text(setValuesFormats(curData.totalTrade.nonOilExports), 62, 118 + (i % 4)*BlockHeight, 'right');
			pdf.addImage(genProgressBarCanvas("#83b75d", curData.value==0?0:curData.totalTrade.nonOilExports/curData.value, false), "png", 12, 120 + (i % 4)*BlockHeight, 50, 0);
			pdf.text(tr('Re-Export'), 12, 130 + (i % 4)*BlockHeight);
			pdf.text(setValuesFormats(curData.totalTrade.reExports), 62, 130 + (i % 4)*BlockHeight, 'right');
			pdf.addImage(genProgressBarCanvas("#e0694a", curData.value==0?0:curData.totalTrade.reExports/curData.value, false), "png", 12, 132 + (i % 4)*BlockHeight, 50, 0);
			
			
			pdf.addImage(exportBG, "png", 76, 112 + (i % 4)*BlockHeight, 56, 0);
			pdf.text(tr('Import'), 78, 106 + (i % 4)*BlockHeight);
			pdf.text(setValuesFormats(curData.derectTrade.imports), 130, 106 + (i % 4)*BlockHeight, 'right');
			pdf.addImage(genProgressBarCanvas("#1ca6af", totalDerectTrade==0?0:curData.derectTrade.imports/totalDerectTrade, false), "png", 78, 108 + (i % 4)*BlockHeight, 52, 0);
			pdf.text(tr('Non-Oil Export'), 78, 118 + (i % 4)*BlockHeight);
			pdf.text(setValuesFormats(curData.derectTrade.nonOilExports), 130, 118 + (i % 4)*BlockHeight, 'right');
			pdf.addImage(genProgressBarCanvas("#83b75d", totalDerectTrade==0?0:curData.derectTrade.nonOilExports/totalDerectTrade, false), "png", 78, 120 + (i % 4)*BlockHeight, 52, 0);
			pdf.text(tr('Re-Export'), 78, 130 + (i % 4)*BlockHeight);
			pdf.text(setValuesFormats(curData.derectTrade.reExports), 130, 130 + (i % 4)*BlockHeight, 'right');
			pdf.addImage(genProgressBarCanvas("#e0694a", totalDerectTrade==0?0:curData.derectTrade.reExports/totalDerectTrade, false), "png", 78, 132 + (i % 4)*BlockHeight, 52, 0);
			
			pdf.addImage(exportBG, "png", 142, 112 + (i % 4)*BlockHeight, 56, 0);
			pdf.text(tr('Import'), 144, 106 + (i % 4)*BlockHeight);
			pdf.text(setValuesFormats(curData.freeZonesTrade.imports), 196, 106 + (i % 4)*BlockHeight, 'right');
			pdf.addImage(genProgressBarCanvas("#1ca6af", totalFreeZonesTrade==0?0:curData.freeZonesTrade.imports/totalFreeZonesTrade, false), "png", 144, 108 + (i % 4)*BlockHeight, 52, 0);
			pdf.text(tr('Non-Oil Export'), 144, 118 + (i % 4)*BlockHeight);
			pdf.text(setValuesFormats(curData.freeZonesTrade.nonOilExports), 196, 118 + (i % 4)*BlockHeight, 'right');
			pdf.addImage(genProgressBarCanvas("#83b75d", totalFreeZonesTrade==0?0:curData.freeZonesTrade.nonOilExports/totalFreeZonesTrade, false), "png", 144, 120 + (i % 4)*BlockHeight, 52, 0);
			pdf.text(tr('Re-Export'), 144, 130 + (i % 4)*BlockHeight);
			pdf.text(setValuesFormats(curData.freeZonesTrade.reExports), 196, 130 + (i % 4)*BlockHeight, 'right');
			pdf.addImage(genProgressBarCanvas("#e0694a", totalFreeZonesTrade==0?0:curData.freeZonesTrade.reExports/totalFreeZonesTrade, false), "png", 144, 132 + (i % 4)*BlockHeight, 52, 0);
			
			

			if(i > 0 && i % 4 == 3 && i<ftvLength-1){
				pdf.addPage();pageIndex++;
				getPDFPageTemplate();
	
				pdf.setFontSize(24);
				pdf.setTextColor(255, 255, 255);
				pdf.text(tr('Trade Volume'), 31, 70);
				
				pdf.addImage(tvIconDataURLImage, "png", 17.5, 64, 5, 0);
				
				pdf.setFontSize(10);
				pdf.text(tr('Year: ' + years[0] + "-" + years[1]), 105, 56.5);
					
				pdf.text(tr('Currency: '+currString), pdfPageWidth-10, 56.5, 'right');
				
				pdf.addImage(headerDataURLImage, "png", 10, 80, 56, 0);
				
				pdf.addImage(headerDataURLImage2, "png", 76, 80, 56, 0);
				
				pdf.addImage(headerDataURLImage2, "png", 142, 80, 56, 0);
				
				
				pdf.setFontSize(12);
				pdf.setTextColor(255, 255, 255);
				pdf.text(tr('Total'), 20, 85);
				
				pdf.text(tr('Direct'), 86, 85);
				
				pdf.text(tr('Free Zone'), 152, 85);
			}
			
		}
	}
	
}

function genTradeVolume_AR(){
	if(pageIndex++ > 0){
		docDefinition.content.push({
			text: '',
			pageBreak: 'before'
		});
	}
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [475],
			body: [
				[ reverseWords(tr('Trade Volume')),],
			]
		},
		absolutePosition: {x:20, y:160},
		layout: 'noBorders',
		style:'pageHeader',
		
	});
	
	docDefinition.content.push({
		image: tvIconDataURLImage,
		width: 18,
		absolutePosition: {x:525, y:178}		
	});
	
	var years = getActiveYearRange();
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [300],
			body: [[{
					text:reverseWords(tr('Year')+ ': ' + years[0] + " - " + years[1]),
					style:'pageCountry',
			}]],
			
		},
		absolutePosition: {x:20, y:143},
			layout: 'noBorders',
			style:{
				alignment: 'right', 
				lineHeight: .7,
				color: '#fff',
			}
	});
	
	var currString = "";
	var curr = getCurCurrency();
	switch(curr){
		case 0:
		currString = tr("AED Millions");
			break;
		case 1:
		currString = tr("USD Millions");
			break;
		case 2:
		currString = tr("AED Billions");
			break;
		case 3:
		currString = tr("USD Billions");
			break;
	}
	docDefinition.content.push({
		text:reverseWords(tr('Currency')+ ': ' + currString),
		absolutePosition: {x:28, y:143},
		style:'pageCurrency',
	});
	var headerCanvas = document.createElement('canvas');
        headerCanvas.width = 300; 
        headerCanvas.height = 39;
		
	var ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#2c2c2c";
		ctx.fillRect(21,0,300,39);
		
		ctx.beginPath();
		ctx.moveTo(21,0);
		ctx.lineTo(0,22.5);
		ctx.lineTo(21,39);
		ctx.fill();
			
		ctx.fillStyle="#b68a35";
		ctx.fillRect(261,0,300,39);
		
		
		
	var headerDataURLImage = headerCanvas.toDataURL('image/png');
	
	headerCanvas = document.createElement('canvas');
        headerCanvas.width = 300; 
        headerCanvas.height = 39;
		
	ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#b68a35";
		ctx.fillRect(0,0,300,39);
			
		ctx.fillStyle="#2c2c2c";
		ctx.fillRect(261,0,300,39);
		
		ctx.fillStyle="#ffffff";
		ctx.beginPath();
		ctx.moveTo(291,9);
		ctx.lineTo(270,9);
		ctx.lineTo(280.5,30);
		ctx.fill();
	
	var headerDataURLImage2 = headerCanvas.toDataURL('image/png');
	
	headerCanvas = document.createElement('canvas');
        headerCanvas.width = 300; 
        headerCanvas.height = 39;
		
	ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#b68a35";
		ctx.fillRect(21,0,300,39);
		
		ctx.beginPath();
		ctx.moveTo(21,0);
		ctx.lineTo(0,22.5);
		ctx.lineTo(21,39);
		ctx.fill();
			
		
	var headerDataURLImage3 = headerCanvas.toDataURL('image/png');
	
	headerCanvas = document.createElement('canvas');
        headerCanvas.width = 300; 
        headerCanvas.height = 39;
		
	ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#2c2c2c";
		ctx.fillRect(0,0,300,39);
		
			
		
	var headerDataURLImage4 = headerCanvas.toDataURL('image/png');
	
	headerCanvas = document.createElement('canvas');
        headerCanvas.width = 300; 
        headerCanvas.height = 70;
		
	ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#f1f1f1";
		ctx.fillRect(0,0,300,70);
	
	var exportBG =  headerCanvas.toDataURL('image/png');
	
	docDefinition.content.push({
		image: headerDataURLImage,
		width: 165,
		absolutePosition: {x:406, y:230}		
	});
	
	docDefinition.content.push({
		image: headerDataURLImage2,
		width: 165,
		absolutePosition: {x:216, y:230}		
	});
	
	docDefinition.content.push({
		image: headerDataURLImage2,
		width: 165,
		absolutePosition: {x:28, y:230}		
	});
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [140],
			body: [[{
					text:reverseWords(tr('Total')),
					style:'blockHeader',
			}]],
			
		},
		absolutePosition: {x:406, y:228},
		layout: 'noBorders',
		style:{
			alignment: 'right', 
			lineHeight: .7,
			color: '#fff',
		}
	});
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [140],
			body: [[{
					text:reverseWords(tr('Direct')),
					style:'blockHeader',
			}]],
			
		},
		absolutePosition: {x:216, y:228},
		layout: 'noBorders',
		style:{
			alignment: 'right', 
			lineHeight: .7,
			color: '#fff',
		}
	});
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [140],
			body: [[{
					text:reverseWords(tr('Free Zone')),
					style:'blockHeader',
			}]],
			
		},
		absolutePosition: {x:28, y:228},
		layout: 'noBorders',
		style:{
			alignment: 'right', 
			lineHeight: .7,
			color: '#fff',
		}
	});
	
	
	
	if(reportData.ftv!=null && reportData.ftv.length>0){
		var ftvLength = reportData.ftv.length;
		var BlockHeight = 150;
		for(var i = 0; i<reportData.ftv.length; i++){
			
			
			var curData = reportData.ftv[ftvLength - i - 1];
			
			var totalDerectTrade = curData.derectTrade.imports + curData.derectTrade.nonOilExports + curData.derectTrade.reExports;
			var totalFreeZonesTrade = curData.freeZonesTrade.imports + curData.freeZonesTrade.nonOilExports + curData.freeZonesTrade.reExports;
			
			docDefinition.content.push({
				image: headerDataURLImage3,
				width: 165,
				absolutePosition: {x:406, y:272 + (i % 3)*BlockHeight}		
			});
			
			docDefinition.content.push({
				image: headerDataURLImage4,
				width: 165,
				absolutePosition: {x:216, y:272 + (i % 3)*BlockHeight}		
			});
			
			docDefinition.content.push({
				image: headerDataURLImage4,
				width: 165,
				absolutePosition: {x:28, y:272 + (i % 3)*BlockHeight}		
			});
			
			
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [65,73],
					body: [[{
							text:setValuesFormats(curData.value),
							style:'blockHeader2left',
					},
					{
							text:curData.year,
							style:'blockHeader2',
					}]],
					
				},
				absolutePosition: {x:421, y:270 + (i % 3)*BlockHeight},
				layout: 'noBorders',
				style:{
					alignment: 'right', 
					lineHeight: .7,
					color: '#fff',
				}
			});
			
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [75,73],
					body: [[{
							text:setValuesFormats(totalDerectTrade),
							style:'blockHeader2left',
					},
					{
							text:curData.year,
							style:'blockHeader2',
					}]],
					
				},
				absolutePosition: {x:221, y:270 + (i % 3)*BlockHeight},
				layout: 'noBorders',
				style:{
					alignment: 'right', 
					lineHeight: .7,
					color: '#fff',
				}
			});
			
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [75,73],
					body: [[{
							text:setValuesFormats(totalFreeZonesTrade),
							style:'blockHeader2left',
					},
					{
							text:curData.year,
							style:'blockHeader2',
					}]],
					
				},
				absolutePosition: {x:31, y:270 + (i % 3)*BlockHeight},
				layout: 'noBorders',
				style:{
					alignment: 'right', 
					lineHeight: .7,
					color: '#fff',
				}
			});
			docDefinition.content.push(
				[{
					image: exportBG,
					width: 165,
					absolutePosition: {x:406, y:330 + (i % 3)*BlockHeight}		
				},
				{
					image: exportBG,
					width: 165,
					absolutePosition: {x:215, y:330 + (i % 3)*BlockHeight}		
				},
				{
					image: exportBG,
					width: 165,
					absolutePosition: {x:28, y:330 + (i % 3)*BlockHeight}		
				},
				]
			);
			
			
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [33,103],
					body: [[{
							text:setValuesFormats(curData.totalTrade.imports),
							style:'tradeItemLeft',
					},
					{
							text:reverseWords(tr('Import')),
							style:'tradeItem',
					}]],
					
				},
				absolutePosition: {x:423, y:293 + (i % 3)*BlockHeight},
				layout: 'noBorders',
				style:{
					alignment: 'right', 
					lineHeight: .7,
					color: '#fff',
				}
			});
			
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [33,103],
					body: [[{
							text:setValuesFormats(curData.totalTrade.nonOilExports),
							style:'tradeItemLeft',
					},
					{
							text:reverseWords(tr('Non-Oil Export')),
							style:'tradeItem',
					}]],
					
				},
				absolutePosition: {x:423, y:332 + (i % 3)*BlockHeight},
				layout: 'noBorders',
				style:{
					alignment: 'right', 
					lineHeight: .7,
					color: '#fff',
				}
			});
			
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [33,103],
					body: [[{
							text:setValuesFormats(curData.totalTrade.reExports),
							style:'tradeItemLeft',
					},
					{
							text:reverseWords(tr('Re-Export')),
							style:'tradeItem',
					}]],
					
				},
				absolutePosition: {x:423, y:371 + (i % 3)*BlockHeight},
				layout: 'noBorders',
				style:{
					alignment: 'right', 
					lineHeight: .7,
					color: '#fff',
				}
			});
			docDefinition.content.push(
				[{
					image: genProgressBarCanvas("#1ca6af", curData.value==0? 0 :curData.totalTrade.imports/curData.value, true),
					width: 143,
					absolutePosition: {x:423, y:317 + (i % 3)*BlockHeight}		
				},
				{
					image: genProgressBarCanvas("#83b75d", curData.value==0? 0 :curData.totalTrade.nonOilExports/curData.value, true),
					width: 143,
					absolutePosition: {x:423, y:356 + (i % 3)*BlockHeight}		
				},
				{
					image: genProgressBarCanvas("#e0694a", curData.value==0? 0 :curData.totalTrade.reExports/curData.value, true),
					width: 143,
					absolutePosition: {x:423, y:395 + (i % 3)*BlockHeight}		
				},
				]
			);
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [33,115],
					body: [[{
							text:setValuesFormats(curData.derectTrade.imports),
							style:'tradeItemLeft',
					},
					{
							text:reverseWords(tr('Import')),
							style:'tradeItem',
					}]],
					
				},
				absolutePosition: {x:221, y:293 + (i % 3)*BlockHeight},
				layout: 'noBorders',
				style:{
					alignment: 'right', 
					lineHeight: .7,
					color: '#fff',
				}
			});
			
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [33,115],
					body: [[{
							text:setValuesFormats(curData.derectTrade.nonOilExports),
							style:'tradeItemLeft',
					},
					{
							text:reverseWords(tr('Non-Oil Export')),
							style:'tradeItem',
					}]],
					
				},
				absolutePosition: {x:221, y:332 + (i % 3)*BlockHeight},
				layout: 'noBorders',
				style:{
					alignment: 'right', 
					lineHeight: .7,
					color: '#fff',
				}
			});
			
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [33,115],
					body: [[{
							text:setValuesFormats(curData.derectTrade.reExports),
							style:'tradeItemLeft',
					},
					{
							text:reverseWords(tr('Re-Export')),
							style:'tradeItem',
					}]],
					
				},
				absolutePosition: {x:221, y:371 + (i % 3)*BlockHeight},
				layout: 'noBorders',
				style:{
					alignment: 'right', 
					lineHeight: .7,
					color: '#fff',
				}
			});
			docDefinition.content.push(
				[{
					image: genProgressBarCanvas("#1ca6af", totalDerectTrade==0?0:curData.derectTrade.imports/totalDerectTrade, true),
					width: 155,
					absolutePosition: {x:221, y:317 + (i % 3)*BlockHeight}		
				},
				{
					image: genProgressBarCanvas("#83b75d", totalDerectTrade==0?0:curData.derectTrade.nonOilExports/totalDerectTrade, true),
					width: 155,
					absolutePosition: {x:221, y:356 + (i % 3)*BlockHeight}		
				},
				{
					image: genProgressBarCanvas("#e0694a", totalDerectTrade==0?0:curData.derectTrade.reExports/totalDerectTrade, true),
					width: 155,
					absolutePosition: {x:221, y:395 + (i % 3)*BlockHeight}		
				},
				]
			);
			
			
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [33,115],
					body: [[{
							text:setValuesFormats(curData.freeZonesTrade.imports),
							style:'tradeItemLeft',
					},
					{
							text:reverseWords(tr('Import')),
							style:'tradeItem',
					}]],
					
				},
				absolutePosition: {x:31, y:293 + (i % 3)*BlockHeight},
				layout: 'noBorders',
				style:{
					alignment: 'right', 
					lineHeight: .7,
					color: '#fff',
				}
			});
			
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [33,115],
					body: [[{
							text:setValuesFormats(curData.freeZonesTrade.nonOilExports),
							style:'tradeItemLeft',
					},
					{
							text:reverseWords(tr('Non-Oil Export')),
							style:'tradeItem',
					}]],
					
				},
				absolutePosition: {x:31, y:332 + (i % 3)*BlockHeight},
				layout: 'noBorders',
				style:{
					alignment: 'right', 
					lineHeight: .7,
					color: '#fff',
				}
			});
			
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [33,115],
					body: [[{
							text:setValuesFormats(curData.freeZonesTrade.reExports),
							style:'tradeItemLeft',
					},
					{
							text:reverseWords(tr('Re-Export')),
							style:'tradeItem',
					}]],
					
				},
				absolutePosition: {x:31, y:371 + (i % 3)*BlockHeight},
				layout: 'noBorders',
				style:{
					alignment: 'right', 
					lineHeight: .7,
					color: '#fff',
				}
			});
			docDefinition.content.push(
				[{
					image: genProgressBarCanvas("#1ca6af", totalFreeZonesTrade==0?0:curData.freeZonesTrade.imports/totalFreeZonesTrade, true), 
					width: 155,
					absolutePosition: {x:31, y:317 + (i % 3)*BlockHeight}		
				},
				{
					image: genProgressBarCanvas("#83b75d", totalFreeZonesTrade==0?0:curData.freeZonesTrade.nonOilExports/totalFreeZonesTrade, true),
					width: 155,
					absolutePosition: {x:31, y:356 + (i % 3)*BlockHeight}		
				},
				{
					image: genProgressBarCanvas("#e0694a", totalFreeZonesTrade==0?0:curData.freeZonesTrade.reExports/totalFreeZonesTrade, true),
					width: 155,
					absolutePosition: {x:31, y:395 + (i % 3)*BlockHeight}		
				},
				]
			);

			if(i > 0 && i % 3 == 2 && i<ftvLength-1){
				docDefinition.content.push({
					text: '',
					pageBreak: 'before'
				});
				pageIndex++;
				
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [475],
						body: [
							[ reverseWords(tr('Trade Volume')),],
						]
					},
					absolutePosition: {x:20, y:160},
					layout: 'noBorders',
					style:'pageHeader',
					
				});
				
				docDefinition.content.push({
					image: tvIconDataURLImage,
					width: 18,
					absolutePosition: {x:525, y:178}		
				});
				
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [300],
						body: [[{
								text:reverseWords(tr('Year')+ ': ' + years[0] + " - " + years[1]),
								style:'pageCountry',
						}]],
						
					},
					absolutePosition: {x:20, y:143},
						layout: 'noBorders',
						style:{
							alignment: 'right', 
							lineHeight: .7,
							color: '#fff',
						}
				});

				docDefinition.content.push({
					text:reverseWords(tr('Currency')+ ': ' + currString),
					absolutePosition: {x:28, y:143},
					style:'pageCurrency',
				});
					docDefinition.content.push({
						image: headerDataURLImage,
						width: 165,
						absolutePosition: {x:406, y:225}		
					});
					
					docDefinition.content.push({
						image: headerDataURLImage2,
						width: 165,
						absolutePosition: {x:213, y:225}		
					});
					
					docDefinition.content.push({
						image: headerDataURLImage2,
						width: 165,
						absolutePosition: {x:28, y:225}		
					});
					
					docDefinition.content.push({
						table: {
							headerRows: 0,
							widths: [140],
							body: [[{
									text:reverseWords(tr('Total')),
									style:'blockHeader',
							}]],
							
						},
						absolutePosition: {x:406, y:223},
						layout: 'noBorders',
						style:{
							alignment: 'right', 
							lineHeight: .7,
							color: '#fff',
						}
					});
					
					docDefinition.content.push({
						table: {
							headerRows: 0,
							widths: [140],
							body: [[{
									text:reverseWords(tr('Direct')),
									style:'blockHeader',
							}]],
							
						},
						absolutePosition: {x:213, y:223},
						layout: 'noBorders',
						style:{
							alignment: 'right', 
							lineHeight: .7,
							color: '#fff',
						}
					});
					
					docDefinition.content.push({
						table: {
							headerRows: 0,
							widths: [140],
							body: [[{
									text:reverseWords(tr('Free Zone')),
									style:'blockHeader',
							}]],
							
						},
						absolutePosition: {x:28, y:223},
						layout: 'noBorders',
						style:{
							alignment: 'right', 
							lineHeight: .7,
							color: '#fff',
						}
					});
			}
			
		}
	}
	
}

	
function drawDonutChart(index){
	
	var chartColors = ['#E04B4A', '#95B75D', '#1CAF9A'];	
		
	$("#report #donutChart"+index+" svg").html("");
	var dntChart;
	var totalValue;
	var chartLabel;
	
	switch(index){
		case -1: 
			totalValue = reportData.tradeItems.totalFT;
			chartLabel = "";
			break;
		case 0: ;
			totalValue = reportData.tradeItems.totalImports;
			chartLabel = tr("Import");
			break;
		case 1: 
			totalValue = reportData.tradeItems.totalNonOilExports;
			chartLabel = tr("Export");
			break;
		case 2: 
			totalValue = reportData.tradeItems.totalReExports;
			chartLabel = tr("Re-Export");
			break;
	}
	
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
				var svg = d3.select("#report #donutChart"+index+" svg");

					var donut = svg.selectAll("g.nv-slice").filter(
				  function (d, i) {
					return i == 0;
				  }
				);
			  }
			}
		  
		  // Put the donut pie chart together
		  d3.select("#report #donutChart"+index+" svg")
			.datum([
			{
			  "label": "",
			  "value": totalValue
			},
			{
			  "label": "",
			  "value": reportData.tradeItems.totalFT - totalValue
			}])
			.call(dntChart)
			.call(centerText()).
			call(function(){
					setTimeout(
						function(){
							switch(index){
								case 0: donutChart0Rendered = true;
									break;
								case 1: 
									donutChart1Rendered = true;
									break;
								case 2: 
									donutChart2Rendered = true;
									break;
							}
						}, 
					300);
				});
			
		  return dntChart;
		});
}

function saveSVG2Image(selector, width, height) {
    var oSerializer = new XMLSerializer();
    var sXML = oSerializer.serializeToString(document.querySelector(selector));
	var canvas = document.getElementById('canvas');
	canvas.width = width;
	canvas.height = height;
    canvg(canvas, sXML,{ ignoreMouse: true, ignoreAnimation: true })
    var imgData = canvas.toDataURL("image/png");
    return imgData;
}

function genTradeItems(){
	if(pageIndex++ > 0){
		pdf.addPage();
	}
	
	getPDFPageTemplate();
	
	pdf.setFontSize(24);
	pdf.setTextColor(255, 255, 255);
	pdf.text(tr('Direct Trade Items'), 31, 70);
	
	pdf.addImage(ftiIconDataURLImage, "png", 18, 64, 5, 0);
	
	pdf.setFontSize(10);
	pdf.text(tr('Year: ' + getCurYear()), 105, 56.5);
		
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
	
	pdf.text(tr('Currency: '+currString), pdfPageWidth-10, 56.5, 'right');
	
	var headerCanvas = document.createElement('canvas');
        headerCanvas.width = 300; 
        headerCanvas.height = 39;
		
	var ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#2c2c2c";
		ctx.fillRect(0,0,279,39);
			
		ctx.fillStyle="#e0694a";
		ctx.fillRect(0,0,39,39);
		
		
		
	var headerDataURLImageImport = headerCanvas.toDataURL('image/png');
	
	headerCanvas = document.createElement('canvas');
        headerCanvas.width = 300; 
        headerCanvas.height = 39;
		
	ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#2c2c2c";
		ctx.fillRect(0,0,279,39);
			
		ctx.fillStyle="#83b75d";
		ctx.fillRect(0,0,39,39);
		
	var headerDataURLImageExport = headerCanvas.toDataURL('image/png');
	
	headerCanvas = document.createElement('canvas');
        headerCanvas.width = 300; 
        headerCanvas.height = 39;
		
	ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#2c2c2c";
		ctx.fillRect(0,0,279,39);
			
		ctx.fillStyle="#1ca6af";
		ctx.fillRect(0,0,39,39);
		
	var headerDataURLImageReExport = headerCanvas.toDataURL('image/png');
	
	blockBGCanvas = document.createElement('canvas');
        blockBGCanvas.width = 300; 
        blockBGCanvas.height = 135;
		
	ctx=blockBGCanvas.getContext("2d");
		ctx.fillStyle="#f0f0f0";
		ctx.fillRect(0,0,300,200);

		
	var blockBGDataURL = blockBGCanvas.toDataURL('image/png');
	
	pdf.addImage(headerDataURLImageImport, "png", 10, 80, 56, 0);
	
	pdf.addImage(headerDataURLImageExport, "png", 76, 80, 56, 0);
	
	pdf.addImage(headerDataURLImageReExport, "png", 142, 80, 56, 0);
	
	pdf.setFontSize(12);
	pdf.setTextColor(255, 255, 255);
	pdf.text(tr('Import Items'), 20, 85);
	
	pdf.text(tr('Non-Oil Export Items'), 86, 85);
	
	pdf.text(tr('Re-Export Items'), 152, 85);
	
	if(reportData.tradeItems!=null){
		
		var importItemsCount = reportData.tradeItems.importsItems !== undefined ? reportData.tradeItems.importsItems.length:0;
		var exportItemsCount = reportData.tradeItems.nonOilExportsItems !== undefined ?reportData.tradeItems.nonOilExportsItems.length:0;
		var reexportItemsCount = reportData.tradeItems.reExportsItems !== undefined ?reportData.tradeItems.reExportsItems.length:0;
		
		
		var importDataURLImage = saveSVG2Image("#report #donutChart0 svg", 500, 500);
		var exportDataURLImage = saveSVG2Image("#report #donutChart1 svg", 500, 500);
		var reexportDataURLImage = saveSVG2Image("#report #donutChart2 svg", 500, 500);
		
		pdf.addImage(importDataURLImage, "png", 8, 85, 56, 0);
		pdf.addImage(exportDataURLImage, "png", 74, 85, 56, 0);
		pdf.addImage(reexportDataURLImage, "png", 140, 85, 56, 0);
		
		pdf.setFontSize(20);
		pdf.setTextColor(48, 48, 48);
		pdf.setFontType("bold");
		pdf.text(setValuesFormats(reportData.tradeItems.totalImports), 36, 116, 'center');	
		pdf.text(setValuesFormats(reportData.tradeItems.totalNonOilExports), 102, 116, 'center');
		pdf.text(setValuesFormats(reportData.tradeItems.totalReExports), 168, 116, 'center');
		pdf.setFontType("normal");
		
		
		var blockTop = 145;
		
		for(var i = 0; i < importItemsCount || i < exportItemsCount || i < reexportItemsCount; i++){
			if(i < importItemsCount){
				var title = reportData.tradeItems.importsItems[i].title;
				
				if((i % 5) % 2 == 0){
					pdf.addImage(blockBGDataURL, "png", 10, blockTop - 5, 56, 0);
					
				}
				
				pdf.setFontSize(8);
				title = pdf.splitTextToSize(title, 53);
				if(title.length>5) {
					title = title.slice(0, 5);title[4]+="...";
				}
				pdf.text(title, 12, blockTop);
				
				var progress = genProgressBarCanvas("#e0694a",reportData.tradeItems.totalImports == 0? 0 : reportData.tradeItems.importsItems[i].value/reportData.tradeItems.totalImports, false);
				pdf.addImage(progress, "png", 12, blockTop+16.5, 40, 0);
				
				pdf.setFontSize(10);
				pdf.text(setValuesFormats(reportData.tradeItems.importsItems[i].value), 64, blockTop+18,'right');				
			}
			
			if(i < exportItemsCount){
				if((i % 5) % 2 == 0){
					pdf.addImage(blockBGDataURL, "png", 76, blockTop - 5, 56, 0);
					
				}
				var title = reportData.tradeItems.nonOilExportsItems[i].title;
				pdf.setFontSize(8);
				title = pdf.splitTextToSize(title, 53);
				if(title.length>5) {
					title = title.slice(0, 5);title[4]+="...";
				}
				pdf.text(title, 78, blockTop);
				
				var progress = genProgressBarCanvas("#83b75d", reportData.tradeItems.totalNonOilExports == 0 ? 0 :reportData.tradeItems.nonOilExportsItems[i].value/reportData.tradeItems.totalNonOilExports, false);
				pdf.addImage(progress, "png", 78, blockTop+16.5, 40, 0);
				
				pdf.setFontSize(10);
				pdf.text(setValuesFormats(reportData.tradeItems.nonOilExportsItems[i].value), 130, blockTop+18,'right');
			}
			
			if(i < reexportItemsCount){
				if((i % 5) % 2 == 0){
					pdf.addImage(blockBGDataURL, "png", 142, blockTop - 5, 56, 0);
					
				}
				var title = reportData.tradeItems.reExportsItems[i].title;
				pdf.setFontSize(8);
				title = pdf.splitTextToSize(title, 53);
				if(title.length>5) {
					title = title.slice(0, 5);title[4]+="...";
				}
				pdf.text(title, 144, blockTop);
				
				var progress = genProgressBarCanvas("#1ca6af",reportData.tradeItems.totalReExports == 0? 0: reportData.tradeItems.reExportsItems[i].value/reportData.tradeItems.totalReExports
, false);
				pdf.addImage(progress, "png", 144, blockTop+16.5, 40, 0);
				
				pdf.setFontSize(10);
				pdf.text(setValuesFormats(reportData.tradeItems.reExportsItems[i].value), 196, blockTop+18,'right');
			}
			
			blockTop+=27;
			
			if(i > 0 && i % 5 == 4 && (i < importItemsCount-1 || i < exportItemsCount-1 || i < reexportItemsCount-1)){
				pdf.addPage();pageIndex++;
				getPDFPageTemplate();
				pdf.setFontSize(24);
				pdf.setTextColor(255, 255, 255);
				pdf.text(tr('Direct Trade Items'), 31, 70);
				
				pdf.addImage(ftiIconDataURLImage, "png", 18, 64, 5, 0);
				
				pdf.setFontSize(10);
				pdf.text('Year: ' + getCurYear(), 105, 56.5);
					
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
				
				pdf.text(tr('Currency: '+currString), pdfPageWidth-10, 56.5, 'right');
				
				pdf.addImage(headerDataURLImageImport, "png", 10, 80, 56, 0);
	
				pdf.addImage(headerDataURLImageExport, "png", 76, 80, 56, 0);
				
				pdf.addImage(headerDataURLImageReExport, "png", 142, 80, 56, 0);
				
				pdf.setFontSize(12);
				pdf.setTextColor(255, 255, 255);
				pdf.text(tr('Import Items'), 20, 85);
				
				pdf.text(tr('Non-Oil Export Items'), 86, 85);
				
				pdf.text(tr('Re-Export Items'), 152, 85);
			
				pdf.addImage(importDataURLImage, "png", 8, 85, 56, 0);
				pdf.addImage(exportDataURLImage, "png", 74, 85, 56, 0);
				pdf.addImage(reexportDataURLImage, "png", 140, 85, 56, 0);

				pdf.setFontSize(20);
				pdf.setTextColor(48, 48, 48);
				pdf.setFontType("bold");
				pdf.text(setValuesFormats(reportData.tradeItems.totalImports), 36, 116, 'center');	
				pdf.text(setValuesFormats(reportData.tradeItems.totalNonOilExports), 102, 116, 'center');
				pdf.text(setValuesFormats(reportData.tradeItems.totalReExports), 168, 116, 'center');
				pdf.setFontType("normal");
				
				blockTop = 145;
			}
		}
		
		
		
	}
	
}

function genTradeItems_AR(){
	
	if(pageIndex++ > 0){
		docDefinition.content.push({
			text: '',
			pageBreak: 'before'
		});
	}
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [475],
			body: [
				[ reverseWords(tr('Direct Trade Items')),],
			]
		},
		absolutePosition: {x:20, y:160},
		layout: 'noBorders',
		style:'pageHeader',
		
	});
	
	docDefinition.content.push({
		image: ftiIconDataURLImage,
		width: 18,
		absolutePosition: {x:525, y:178}		
	});
	
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [300],
			body: [[{
					text:reverseWords(tr('Year')+ ': ' + getCurYear()),
					style:'pageCountry',
			}]],
			
		},
		absolutePosition: {x:20, y:143},
			layout: 'noBorders',
			style:{
				alignment: 'right', 
				lineHeight: .7,
				color: '#fff',
			}
	});
	
	var currString = "";
	var curr = getCurCurrency();
	switch(curr){
		case 0:
		currString = tr("AED Millions");
			break;
		case 1:
		currString = tr("USD Millions");
			break;
		case 2:
		currString = tr("AED Billions");
			break;
		case 3:
		currString = tr("USD Billions");
			break;
	}
	docDefinition.content.push({
		text:reverseWords(tr('Currency')+ ': ' + currString),
		absolutePosition: {x:28, y:143},
		style:'pageCurrency',
	});
	
	var headerCanvas = document.createElement('canvas');
        headerCanvas.width = 300; 
        headerCanvas.height = 39;
		
	var ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#2c2c2c";
		ctx.fillRect(0,0,279,39);
			
		ctx.fillStyle="#e0694a";
		ctx.fillRect(245,0,279,39);
		
		
		
	var headerDataURLImageImport = headerCanvas.toDataURL('image/png');
	
	headerCanvas = document.createElement('canvas');
        headerCanvas.width = 300; 
        headerCanvas.height = 39;
		
	ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#2c2c2c";
		ctx.fillRect(0,0,279,39);
			
		ctx.fillStyle="#83b75d";
		ctx.fillRect(245,0,279,39);
		
	var headerDataURLImageExport = headerCanvas.toDataURL('image/png');
	
	headerCanvas = document.createElement('canvas');
        headerCanvas.width = 300; 
        headerCanvas.height = 39;
		
	ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#2c2c2c";
		ctx.fillRect(0,0,279,39);
			
		ctx.fillStyle="#1ca6af";
		ctx.fillRect(245,0,279,39);
		
	var headerDataURLImageReExport = headerCanvas.toDataURL('image/png');
	
	blockBGCanvas = document.createElement('canvas');
        blockBGCanvas.width = 300; 
        blockBGCanvas.height = 140;
		
	ctx=blockBGCanvas.getContext("2d");
		ctx.fillStyle="#f0f0f0";
		ctx.fillRect(0,0,300,200);

		
	var blockBGDataURL = blockBGCanvas.toDataURL('image/png');
	
	docDefinition.content.push({
		image: headerDataURLImageImport,
		width: 165,
		absolutePosition: {x:400, y:220}		
	});
	
	docDefinition.content.push({
		image: headerDataURLImageExport,
		width: 165,
		absolutePosition: {x:215, y:220}		
	});
	
	docDefinition.content.push({
		image: headerDataURLImageReExport,
		width: 165,
		absolutePosition: {x:28, y:220}		
	});
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [130],
			body: [[{
					text:reverseWords(tr('Import Items')),
					style:'blockHeader',
			}]],
			
		},
		absolutePosition: {x:400, y:218},
		layout: 'noBorders',
		style:{
			alignment: 'right', 
			lineHeight: .7,
			color: '#fff',
		}
	});
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [130],
			body: [[{
					text:reverseWords(tr('Non-Oil Export Items')),
					style:'blockHeader',
			}]],
			
		},
		absolutePosition: {x:213, y:218},
		layout: 'noBorders',
		style:{
			alignment: 'right', 
			lineHeight: .7,
			color: '#fff',
		}
	});
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [130],
			body: [[{
					text:reverseWords(tr('Re-Export Items')),
					style:'blockHeader',
			}]],
			
		},
		absolutePosition: {x:28, y:218},
		layout: 'noBorders',
		style:{
			alignment: 'right', 
			lineHeight: .7,
			color: '#fff',
		}
	});
	
	if(reportData.tradeItems!=null){
		var importItemsCount = reportData.tradeItems.importsItems !== undefined ? reportData.tradeItems.importsItems.length:0;
		var exportItemsCount = reportData.tradeItems.nonOilExportsItems !== undefined ?reportData.tradeItems.nonOilExportsItems.length:0;
		var reexportItemsCount = reportData.tradeItems.reExportsItems !== undefined ?reportData.tradeItems.reExportsItems.length:0;
		
		
		var importDataURLImage = saveSVG2Image("#report #donutChart0 svg", 500, 500);
		var exportDataURLImage = saveSVG2Image("#report #donutChart1 svg", 500, 500);
		var reexportDataURLImage = saveSVG2Image("#report #donutChart2 svg", 500, 500);
		
		docDefinition.content.push({
			image: importDataURLImage,
			width: 150,
			absolutePosition: {x:405, y:230}		
		});
		
		docDefinition.content.push({
			image: exportDataURLImage,
			width: 150,
			absolutePosition: {x:225, y:230}		
		});
		
		docDefinition.content.push({
			image: reexportDataURLImage,
			width: 150,
			absolutePosition: {x:33.5, y:230}		
		});
		
		docDefinition.content.push({
			table: {
				headerRows: 0,
				widths: [160],
				body: [[{
						text:setValuesFormats(reportData.tradeItems.totalImports),
						style:'donutValue',
				}]],
				
			},
			absolutePosition: {x:400, y:285},
			layout: 'noBorders',
		});
		
		docDefinition.content.push({
			table: {
				headerRows: 0,
				widths: [160],
				body: [[{
						text:setValuesFormats(reportData.tradeItems.totalNonOilExports),
						style:'donutValue',
				}]],
				
			},
			absolutePosition: {x:220, y:285},
			layout: 'noBorders',
		});
		
		docDefinition.content.push({
			table: {
				headerRows: 0,
				widths: [160],
				body: [[{
						text:setValuesFormats(reportData.tradeItems.totalReExports),
						style:'donutValue',
				}]],
				
			},
			absolutePosition: {x:28, y:285},
			layout: 'noBorders',
		});
		
		var blockTop = 380;
		
		for(var i = 0; i < importItemsCount || i < exportItemsCount || i < reexportItemsCount; i++){
			if(i < importItemsCount){
				var title = reportData.tradeItems.importsItems[i].title;
				
				if((i % 5) % 2 == 0){
					docDefinition.content.push({
						image: blockBGDataURL,
						width: 165,
						absolutePosition: {x:400, y:blockTop - 3}		
					});
				}
				
				title = textToLines(title, 38, true, 5);
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [159],
						body: [[{
								text:title,
								style:'DTIText',
						}]],
						
					},
					absolutePosition: {x:400, y:blockTop},
					layout: 'noBorders',
					margin:3,
				});
				
				var progress = genProgressBarCanvas("#e0694a",reportData.tradeItems.totalImports ==0? 0 : reportData.tradeItems.importsItems[i].value/reportData.tradeItems.totalImports, true);
				docDefinition.content.push({
					image: progress,
					width: 120,
					absolutePosition: {x:438, y:blockTop + 62}		
				});
				
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [33],
						body: [[{
								text:setValuesFormats(reportData.tradeItems.importsItems[i].value),
								style:'DTIValue',
						}]],
						
					},
					absolutePosition: {x:405, y:blockTop + 39},
					layout: 'noBorders',
					margin:3,
				});
			}
			
			if(i < exportItemsCount){
				var title = reportData.tradeItems.nonOilExportsItems[i].title;
				
				if((i % 5) % 2 == 0){
					docDefinition.content.push({
						image: blockBGDataURL,
						width: 165,
						absolutePosition: {x:215, y:blockTop - 3}		
					});
				}
				
				title = textToLines(title, 38, true, 5);
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [159],
						body: [[{
								text:title,
								style:'DTIText',
						}]],
						
					},
					absolutePosition: {x:215, y:blockTop},
					layout: 'noBorders',
					margin:3,
				});
				
				var progress = genProgressBarCanvas("#83b75d", reportData.tradeItems.totalNonOilExports == 0? 0: reportData.tradeItems.nonOilExportsItems[i].value/reportData.tradeItems.totalNonOilExports, true);
				docDefinition.content.push({
					image: progress,
					width: 120,
					absolutePosition: {x:253, y:blockTop + 62}		
				});
				
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [33],
						body: [[{
								text:setValuesFormats(reportData.tradeItems.nonOilExportsItems[i].value),
								style:'DTIValue',
						}]],
						
					},
					absolutePosition: {x:220, y:blockTop + 39},
					layout: 'noBorders',
					margin:3,
				});
				
				
				
			}
			if(i < reexportItemsCount){
			
				var title = reportData.tradeItems.reExportsItems[i].title;
				
				if((i % 5) % 2 == 0){
					docDefinition.content.push({
						image: blockBGDataURL,
						width: 165,
						absolutePosition: {x:28, y:blockTop - 3}		
					});
				}
				
				title = textToLines(title, 38, true, 5);
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [159],
						body: [[{
								text:title,
								style:'DTIText',
						}]],
						
					},
					absolutePosition: {x:28, y:blockTop},
					layout: 'noBorders',
					margin:3,
				});
				
				var progress = genProgressBarCanvas("#1ca6af", 
				reportData.tradeItems.totalReExports == 0? 0: reportData.tradeItems.reExportsItems[i].value/reportData.tradeItems.totalReExports,
				true);
				docDefinition.content.push({
					image: progress,
					width: 120,
					absolutePosition: {x:66, y:blockTop + 62}		
				});
				
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [33],
						body: [[{
								text:setValuesFormats(reportData.tradeItems.reExportsItems[i].value),
								style:'DTIValue',
						}]],
						
					},
					absolutePosition: {x:33, y:blockTop + 39},
					layout: 'noBorders',
					margin:3,
				});
			}

			blockTop+=80;
			
			if(i > 0 && i % 5 == 4 && (i < importItemsCount-1 || i < exportItemsCount-1 || i < reexportItemsCount-1)){
				
				docDefinition.content.push({
					text: '',
					pageBreak: 'before'
				});
				pageIndex++;
				
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [475],
						body: [
							[ reverseWords(tr('Direct Trade Items')),],
						]
					},
					absolutePosition: {x:20, y:160},
					layout: 'noBorders',
					style:'pageHeader',
					
				});
				
				docDefinition.content.push({
					image: ftiIconDataURLImage,
					width: 18,
					absolutePosition: {x:525, y:178}		
				});
				
				
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [300],
						body: [[{
								text:reverseWords(tr('Year')+ ': ' + getCurYear()),
								style:'pageCountry',
						}]],
						
					},
					absolutePosition: {x:20, y:143},
						layout: 'noBorders',
						style:{
							alignment: 'right', 
							lineHeight: .7,
							color: '#fff',
						}
				});
				
				docDefinition.content.push({
					text:reverseWords(tr('Currency')+ ': ' + currString),
					absolutePosition: {x:28, y:143},
					style:'pageCurrency',
				});
				
				docDefinition.content.push({
					image: headerDataURLImageImport,
					width: 165,
					absolutePosition: {x:400, y:220}		
				});
				
				docDefinition.content.push({
					image: headerDataURLImageExport,
					width: 165,
					absolutePosition: {x:215, y:220}		
				});
				
				docDefinition.content.push({
					image: headerDataURLImageReExport,
					width: 165,
					absolutePosition: {x:28, y:220}		
				});
				
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [130],
						body: [[{
								text:reverseWords(tr('Import Items')),
								style:'blockHeader',
						}]],
						
					},
					absolutePosition: {x:400, y:218},
					layout: 'noBorders',
					style:{
						alignment: 'right', 
						lineHeight: .7,
						color: '#fff',
					}
				});
				
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [130],
						body: [[{
								text:reverseWords(tr('Non-Oil Export Items')),
								style:'blockHeader',
						}]],
						
					},
					absolutePosition: {x:213, y:218},
					layout: 'noBorders',
					style:{
						alignment: 'right', 
						lineHeight: .7,
						color: '#fff',
					}
				});
				
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [130],
						body: [[{
								text:reverseWords(tr('Re-Export Items')),
								style:'blockHeader',
						}]],
						
					},
					absolutePosition: {x:28, y:218},
					layout: 'noBorders',
					style:{
						alignment: 'right', 
						lineHeight: .7,
						color: '#fff',
					}
				});
				
						docDefinition.content.push({
							image: importDataURLImage,
							width: 150,
							absolutePosition: {x:405, y:230}		
						});
						
						docDefinition.content.push({
							image: exportDataURLImage,
							width: 150,
							absolutePosition: {x:225, y:230}		
						});
						
						docDefinition.content.push({
							image: reexportDataURLImage,
							width: 150,
							absolutePosition: {x:33.5, y:230}		
						});
						
						docDefinition.content.push({
							table: {
								headerRows: 0,
								widths: [160],
								body: [[{
										text:setValuesFormats(reportData.tradeItems.totalImports),
										style:'donutValue',
								}]],
								
							},
							absolutePosition: {x:400, y:285},
							layout: 'noBorders',
						});
						
						docDefinition.content.push({
							table: {
								headerRows: 0,
								widths: [160],
								body: [[{
										text:setValuesFormats(reportData.tradeItems.totalNonOilExports),
										style:'donutValue',
								}]],
								
							},
							absolutePosition: {x:220, y:285},
							layout: 'noBorders',
						});
						
						docDefinition.content.push({
							table: {
								headerRows: 0,
								widths: [160],
								body: [[{
										text:setValuesFormats(reportData.tradeItems.totalReExports),
										style:'donutValue',
								}]],
								
							},
							absolutePosition: {x:28, y:285},
							layout: 'noBorders',
						});
				blockTop = 380;
			}
			
		}
		
	}
	
	
	
}

function genTradeBalance(){
	
	
	if(pageIndex++ > 0){
		pdf.addPage();
	}
	
	getPDFPageTemplate();
	
	pdf.setFontSize(24);
	pdf.setTextColor(255, 255, 255);
	pdf.text(tr('Trade Growth and Balance'), 31, 70);
	
	pdf.addImage(tradeGrowthIconDataURLImage, "png", 17.5, 64, 5, 0);
	pdf.addImage(chartGrowthDataURLImage, "jpeg", 10, 90, pdfPageWidth-20, 0);
	
	pdf.addImage(chartBalanceDataURLImage, "jpeg", 10, 190, pdfPageWidth-20, 0);
	pdf.setFontSize(10);
	var years = getActiveYearRange();
	pdf.text(tr('Year: ' + years[0] + "-" + years[1]), 105, 56.5);
		
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
	
	pdf.text(tr('Currency: '+currString), pdfPageWidth-10, 56.5, 'right');
	var headerCanvas = document.createElement('canvas');
        headerCanvas.width = pdfPageWidth - 20;
        headerCanvas.height = 7;
		
	var ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#2c2c2c";
		ctx.fillRect(0,0,300,7);
			
		ctx.fillStyle="#b68a35";
		ctx.fillRect(0,0,20,7);
		
	var headerDataURLImage = headerCanvas.toDataURL('image/png');
	
	pdf.addImage(headerDataURLImage, "png", 10, 80, pdfPageWidth - 20, 0);
		pdf.setFontSize(12);
		pdf.setTextColor(255, 255, 255);
		pdf.text(tr("Non-Oil Trade Growth"), 33, 85);
		
		pdf.addImage(headerDataURLImage, "png", 10, 180, pdfPageWidth - 20, 0);
		pdf.text(tr("Non-Oil Trade Balance"), 33, 185);
	
}

function genTradeBalance_AR(){
	if(pageIndex++ > 0){
		docDefinition.content.push({
			text: '',
			pageBreak: 'before'
		});
	}
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [475],
			body: [
				[ reverseWords(tr('Trade Growth and Balance')),],
			]
		},
		absolutePosition: {x:20, y:160},
		layout: 'noBorders',
		style:'pageHeader',
		
	});
	
	docDefinition.content.push({
		image: tradeGrowthIconDataURLImage,
		width: 18,
		absolutePosition: {x:525, y:178}		
	});
	
	var years = getActiveYearRange();
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [300],
			body: [[{
					text:reverseWords(tr('Year')+ ': ' + years[0] + " - " + years[1]),
					style:'pageCountry',
			}]],
			
		},
		absolutePosition: {x:20, y:143},
			layout: 'noBorders',
			style:{
				alignment: 'right', 
				lineHeight: .7,
				color: '#fff',
			}
	});
	
	var currString = "";
	var curr = getCurCurrency();
	switch(curr){
		case 0:
		currString = tr("AED Millions");
			break;
		case 1:
		currString = tr("USD Millions");
			break;
		case 2:
		currString = tr("AED Billions");
			break;
		case 3:
		currString = tr("USD Billions");
			break;
	}
	docDefinition.content.push({
		text:reverseWords(tr('Currency')+ ': ' + currString),
		absolutePosition: {x:28, y:143},
		style:'pageCurrency',
	});
	
	
	var headerCanvas = document.createElement('canvas');
        headerCanvas.width = 500;
        headerCanvas.height = 20;
		
	var ctx=headerCanvas.getContext("2d");
		ctx.fillStyle="#2c2c2c";
		ctx.fillRect(0,0,500,20);
			
		ctx.fillStyle="#b68a35";
		ctx.fillRect(450,0,500,20);
		
	var headerDataURLImage = headerCanvas.toDataURL('image/png');
	
	docDefinition.content.push({
		image: headerDataURLImage,
		width: 525,
		absolutePosition: {x:36, y:225}		
	});
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [465],
			body: [[{
					text:reverseWords(tr("Non-Oil Trade Growth")),
					style:'blockHeader',
			}]],
			
		},
		absolutePosition: {x:36, y:222},
			layout: 'noBorders',
			style:{
				alignment: 'right', 
				lineHeight: .7,
				color: '#fff',
			}
	});
	
	docDefinition.content.push({
		image: chartGrowthDataURLImage,
		width: 525,
		absolutePosition: {x:36, y:258}		
	});
	
	
	docDefinition.content.push({
		image: headerDataURLImage,
		width: 525,
		absolutePosition: {x:36, y:493}		
	});
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [465],
			body: [[{
					text:reverseWords(tr("Non-Oil Trade Balance")),
					style:'blockHeader',
			}]],
			
		},
		absolutePosition: {x:36, y:490},
			layout: 'noBorders',
			style:{
				alignment: 'right', 
				lineHeight: .7,
				color: '#fff',
			}
	});
	
	docDefinition.content.push({
		image: chartBalanceDataURLImage,
		width: 525,
		absolutePosition: {x:36, y:530}		
	});
}

function genInvestmentsFacts(){
	
	
	if(pageIndex++ > 0){
		pdf.addPage();
	}
	
	getPDFPageTemplate();
	
	pdf.setFontSize(24);
	pdf.setTextColor(255, 255, 255);
	pdf.text(tr('Investments Facts'), 31, 70);
	
	pdf.addImage(inflowIconDataURLImage, "png", 17.5, 63.5, 5, 0);
	
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
	
	if((reportData.act !=null && reportData.act.length>0) ||
		(reportData.inflowFDI !=null && reportData.inflowFDI.length>0) ||
		(reportData.outflowFDI !=null && reportData.outflowFDI.length>0)){
		
		var headerCanvas = document.createElement('canvas');
            headerCanvas.width = pdfPageWidth - 20;
            headerCanvas.height = 13;
		
		var ctx=headerCanvas.getContext("2d");
			ctx.fillStyle="#2c2c2c";
			ctx.fillRect(0,0,pdfPageWidth - 20,13);
			
			ctx.fillStyle="#b68a35";
			ctx.fillRect(0,0,20,13);
			
			ctx.fillStyle="#e2e2e2";
			ctx.fillRect(pdfPageWidth - 80,0,pdfPageWidth - 20,13);
		
		var headerDataURLImage = headerCanvas.toDataURL('image/png');
		
		var headerCanvas2 = document.createElement('canvas');
            headerCanvas2.width = pdfPageWidth - 20;
            headerCanvas2.height = 7;
		
		var ctx2=headerCanvas2.getContext("2d");
			ctx2.fillStyle="#2c2c2c";
			ctx2.fillRect(0,0,pdfPageWidth - 20,7);
			
			ctx2.fillStyle="#b68a35";
			ctx2.fillRect(0,0,20,7);
		
		
		var headerDataURLImage2 = headerCanvas2.toDataURL('image/png');
		
		var actBlockCanvas = document.createElement('canvas');
            actBlockCanvas.width = 50;
            actBlockCanvas.height = 25;
		
		var actContext=actBlockCanvas.getContext("2d");
			actContext.fillStyle="#2c2c2c";
			actContext.fillRect(0,0,50,25);

		
		var actBlockDataURLImage = actBlockCanvas.toDataURL('image/png');
		
		pdf.addImage(headerDataURLImage, "png", 10, 78, pdfPageWidth - 20, 0);
		
		pdf.addImage(inflowIconDataURLImage, "png", 15, 79, 10, 0);
		
		pdf.setFontSize(16);
		pdf.setTextColor(255, 255, 255);
		pdf.text(tr('Inward FDI Stock Value'), 33, 88);
		
		pdf.setFontSize(8);
		pdf.text(tr('into the UAE') + (reportData.inflowFDI.length > 0 ? " ("+reportData.inflowFDI[0].period+")":""), 94, 88);
		
		pdf.setTextColor(44, 44, 44);
		pdf.setFontSize(8);
		pdf.text(tr("(" + currString + ")"), 174, 88);
		
		pdf.setFontSize(24);
		var text = pdf.splitTextToSize(tr((reportData.inflowFDI.length > 0?setValuesFormats(reportData.inflowFDI[0].value):"0")), 100);
		pdf.text(text, 172, 88, 'right');
		
		pdf.addImage(actBlockDataURLImage, "png", 32, 98, 27, 0);
		
		pdf.setTextColor(255, 255, 255);
		pdf.setFontSize(20);
		pdf.text(reportData.act.length > 0? "" +reportData.act[0].companies:"0", 45, 107, 'center');
		
		pdf.addImage(actBlockDataURLImage, "png", 92, 98, 27, 0);
		pdf.text(reportData.act.length > 0? "" +reportData.act[0].agencies:"0", 105, 107, 'center');
		
		pdf.addImage(actBlockDataURLImage, "png", 152, 98, 27, 0);
		pdf.text(reportData.act.length > 0? "" +reportData.act[0].trademark:"0", 165, 107, 'center');
		
		
		pdf.setTextColor(37, 37, 37);
		pdf.setFontSize(12);
		pdf.text(tr("Companies"), 45, 120, 'center');
		
		pdf.text(tr("Commercial Agencies"), 105, 120, 'center');
		
		pdf.text(tr("Trademarks"), 165, 120, 'center');
		
		pdf.setFontSize(8);
		pdf.text(tr("registered in the UAE") + " (2015)", 45, 124, 'center');
		pdf.text(tr("registered in the UAE") + " (2015)", 105, 124, 'center');
		pdf.text(tr("registered in the UAE") + " (2015)", 165, 124, 'center');
		 
		pdf.addImage(headerDataURLImage2, "png", 10, 130, pdfPageWidth - 20, 0);
		pdf.setFontSize(12);
		pdf.setTextColor(255, 255, 255);
		pdf.text(tr("Main Sectors"), 33, 135);
		
		
		pdf.addImage(headerDataURLImage, "png", 10, 170, pdfPageWidth - 20, 0);//78
		
		pdf.addImage(outflowIconDataURLImage, "png", 15, 172, 10, 0);
		
		pdf.setFontSize(16);
		pdf.setTextColor(255, 255, 255);
		pdf.text(tr('Outward FDI Stock Value'), 33, 180);
		pdf.setFontSize(8);
		pdf.text(tr('from the UAE') + (reportData.outflowFDI.length > 0 ? " ("+reportData.outflowFDI[0].period+")":""), 98, 180);
		
		pdf.setTextColor(44, 44, 44);
		pdf.setFontSize(8);
		pdf.text(tr("(" + currString + ")"), 174, 180);
		
		pdf.setFontSize(24);
		text = pdf.splitTextToSize(tr((reportData.outflowFDI.length > 0?setValuesFormats(reportData.outflowFDI[0].value):"0")), 100);
		pdf.text(text, 172, 180, 'right');
		
		pdf.addImage(headerDataURLImage2, "png", 10, 190, pdfPageWidth - 20, 0);
		pdf.setFontSize(12);
		pdf.setTextColor(255, 255, 255);
		pdf.text(tr("Main Companies"), 33, 195);
		
		pdf.addImage(headerDataURLImage2, "png", 10, 235, pdfPageWidth - 20, 0);
		pdf.setTextColor(255, 255, 255);
		pdf.text(tr("Main Sectors"), 33, 240);
		
	}
	
}

function genInvestmentsFacts_AR(){
	if(pageIndex++ > 0){
		docDefinition.content.push({
			text: '',
			pageBreak: 'before'
		});
	}
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [475],
			body: [
				[ reverseWords(tr('Investments Facts')),],
			]
		},
		absolutePosition: {x:20, y:160},
		layout: 'noBorders',
		style:'pageHeader',
		
	});
	
	docDefinition.content.push({
		image: ifIconDataURLImage,
		width: 14,
		absolutePosition: {x:527, y:178}		
	});
	
	var currString = "";
	var curr = getCurCurrency();
	switch(curr){
		case 0:
		currString = tr("AED Millions");
			break;
		case 1:
		currString = tr("USD Millions");
			break;
		case 2:
		currString = tr("AED Billions");
			break;
		case 3:
		currString = tr("USD Billions");
			break;
	}
	docDefinition.content.push({
		text:reverseWords(tr('Currency')+ ': ' + currString),
		absolutePosition: {x:28, y:143},
		style:'pageCurrency',
	});
	
	
	if((reportData.act !=null && reportData.act.length>0) ||
		(reportData.inflowFDI !=null && reportData.inflowFDI.length>0) ||
		(reportData.outflowFDI !=null && reportData.outflowFDI.length>0)){
		
		var headerCanvas = document.createElement('canvas');
            headerCanvas.width = 540;
            headerCanvas.height = 37;
		
		var ctx=headerCanvas.getContext("2d");
			ctx.fillStyle="#2c2c2c";
			ctx.fillRect(0,0,540,37);
			
			ctx.fillStyle="#b68a35";
			ctx.fillRect(483,0,540,37);
			
			ctx.fillStyle="#e2e2e2";
			ctx.fillRect(0,0,170,37);
		
		var headerDataURLImage = headerCanvas.toDataURL('image/png');
		
		var headerCanvas2 = document.createElement('canvas');
            headerCanvas2.width = 540;
            headerCanvas2.height = 20;
		
		var ctx2=headerCanvas2.getContext("2d");
			ctx2.fillStyle="#2c2c2c";
			ctx2.fillRect(0,0,540,20);
			
			ctx2.fillStyle="#b68a35";
			ctx2.fillRect(483,0,540,20);
		
		
		var headerDataURLImage2 = headerCanvas2.toDataURL('image/png');
		
		var actBlockCanvas = document.createElement('canvas');
            actBlockCanvas.width = 50;
            actBlockCanvas.height = 25;
		
		var actContext=actBlockCanvas.getContext("2d");
			actContext.fillStyle="#2c2c2c";
			actContext.fillRect(0,0,50,25);

		
		var actBlockDataURLImage = actBlockCanvas.toDataURL('image/png');
		
		docDefinition.content.push({
			image: headerDataURLImage,
			width: 540,
			absolutePosition: {x:28, y:220}		
		});
		
		docDefinition.content.push({
			image: inflowIconDataURLImage,
			width: 28,
			absolutePosition: {x:525, y:225}		
		});
		
		docDefinition.content.push({
			table: {
				headerRows: 0,
				widths: [308],
				body: [
					[ 
					  {
						text:[
							
							{
								text:reverseWords(tr('into the UAE') + (reportData.inflowFDI.length > 0 ? " ("+reportData.inflowFDI[0].period+")":"")),
								style:'IFHaderSmall',
							},
							reverseWords(tr('Inward FDI Stock Value')),
						],
						style:'IFHader',
					  },
					  
					
					],
				]
			},
			absolutePosition: {x:198, y:226},
			layout: 'noBorders',
			style:'pageHeader',
			
		});
		
		docDefinition.content.push({
			table: {
				headerRows: 0,
				widths: [160],
				body: [
					[ 
					  {
						text:[
							
							{
								text:reverseWords(tr(currString)),
								style:'IFHaderValueSmall',
							},
							" ",
							(reportData.inflowFDI.length > 0?setValuesFormats(reportData.inflowFDI[0].value):"0"),
						],
						style:'IFHaderValue',
					  },
					],
				]
			},
			absolutePosition: {x:28, y:215},
			layout: 'noBorders',
			style:'pageHeader',
			
		});
		
		docDefinition.content.push({
			image: actBlockDataURLImage,
			width: 80,
			absolutePosition: {x:426, y:275}		
		});
		
		docDefinition.content.push({
			image: actBlockDataURLImage,
			width: 80,
			absolutePosition: {x:258, y:275}		
		});
		
		docDefinition.content.push({
			image: actBlockDataURLImage,
			width: 80,
			absolutePosition: {x:90, y:275}		
		});
		
		
		
		docDefinition.content.push({
			table: {
				headerRows: 0,
				widths: [70],
				body: [
					[ 
					  {
						text:reportData.act.length > 0? "" +reportData.act[0].companies:"0",
					  },
					],
				]
			},
			absolutePosition: {x:426, y:275},
			layout: 'noBorders',
			style:'ACTValue',
			
		});
		docDefinition.content.push({
			table: {
				headerRows: 0,
				widths: [70],
				body: [
					[ 
					  {
						text:reportData.act.length > 0? "" +reportData.act[0].agencies:"0",
					  },
					],
				]
			},
			absolutePosition: {x:258, y:275},
			layout: 'noBorders',
			style:'ACTValue',
			
		});
		
		docDefinition.content.push({
			table: {
				headerRows: 0,
				widths: [70],
				body: [
					[ 
					  {
						text:reportData.act.length > 0? "" +reportData.act[0].trademark:"0",
					  },
					],
				]
			},
			absolutePosition: {x:90, y:275},
			layout: 'noBorders',
			style:'ACTValue',
			
		});
		
		
		docDefinition.content.push({
			table: {
				headerRows: 0,
				widths: [130],
				body: [
					[ 
					  {
						text:reverseWords(tr("Companies")),
					  },
					],
					[ 
					  {
						text:reverseWords(tr("registered in the UAE") + " (2015)"),
						style:'ACTTitleSmall',
					  },
					  
					],
				]
			},
			absolutePosition: {x:396, y:315},
			layout: 'noBorders',
			style:'ACTTitle',
			
		});
		
		docDefinition.content.push({
			table: {
				headerRows: 0,
				widths: [130],
				body: [
					[ 
					  {
						text:reverseWords(tr("Commercial Agencies")),
					  },
					],
					[ 
					  {
						text:reverseWords(tr("registered in the UAE") + " (2015)"),
						style:'ACTTitleSmall',
					  },
					  
					],
				]
			},
			absolutePosition: {x:228, y:315},
			layout: 'noBorders',
			style:'ACTTitle',
			
		});
		
		docDefinition.content.push({
			table: {
				headerRows: 0,
				widths: [130],
				body: [
					[ 
					  {
						text:reverseWords(tr("Trademarks")),
					  },
					],
					[ 
					  {
						text:reverseWords(tr("registered in the UAE") + " (2015)"),
						style:'ACTTitleSmall',
					  },
					  
					],
				]
			},
			absolutePosition: {x:60, y:315},
			layout: 'noBorders',
			style:'ACTTitle',
			
		});
		
		docDefinition.content.push({
			image: headerDataURLImage2,
			width: 540,
			absolutePosition: {x:28, y:365}		
		});
		
		
		docDefinition.content.push({
			table: {
				headerRows: 0,
				widths: [475],
				body: [
					[ 
					  {
						text:reverseWords(tr("Main Sectors")),
					  },
					],
				]
			},
			absolutePosition: {x:28, y:362},
			layout: 'noBorders',
			style:'blockHeader',
			
		});
		
		docDefinition.content.push({
			image: headerDataURLImage,
			width: 540,
			absolutePosition: {x:28, y:480}		
		});
		
		docDefinition.content.push({
			image: outflowIconDataURLImage,
			width: 28,
			absolutePosition: {x:525, y:486}		
		});
		
		docDefinition.content.push({
			table: {
				headerRows: 0,
				widths: [308],
				body: [
					[ 
					  {
						text:[
							
							{
								text:reverseWords(tr('from the UAE') + (reportData.inflowFDI.length > 0 ? " ("+reportData.outflowFDI[0].period+")":"")),
								style:'IFHaderSmall',
							},
							reverseWords(tr('Outward FDI Stock Value')),
						],
						style:'IFHader',
					  },
					  
					
					],
				]
			},
			absolutePosition: {x:198, y:486},
			layout: 'noBorders',
			style:'pageHeader',
			
		});
		
		docDefinition.content.push({
			table: {
				headerRows: 0,
				widths: [160],
				body: [
					[ 
					  {
						text:[
							
							{
								text:reverseWords(tr(currString)),
								style:'IFHaderValueSmall',
							},
							" ",
							(reportData.inflowFDI.length > 0?setValuesFormats(reportData.outflowFDI[0].value):"0"),
						],
						style:'IFHaderValue',
					  },
					],
				]
			},
			absolutePosition: {x:28, y:475},
			layout: 'noBorders',
			style:'pageHeader',
			
		});
		
		docDefinition.content.push({
			image: headerDataURLImage2,
			width: 540,
			absolutePosition: {x:28, y:535}		
		});
		
		
		docDefinition.content.push({
			table: {
				headerRows: 0,
				widths: [475],
				body: [
					[ 
					  {
						text:reverseWords(tr("Main Companies")),
					  },
					],
				]
			},
			absolutePosition: {x:28, y:532},
			layout: 'noBorders',
			style:'blockHeader',
			
		});
		
		docDefinition.content.push({
			image: headerDataURLImage2,
			width: 540,
			absolutePosition: {x:28, y:655}		
		});
		
		
		docDefinition.content.push({
			table: {
				headerRows: 0,
				widths: [475],
				body: [
					[ 
					  {
						text:reverseWords(tr("Main Sectors")),
					  },
					],
				]
			},
			absolutePosition: {x:28, y:652},
			layout: 'noBorders',
			style:'blockHeader',
			
		});
	}
	
}

function genGeneralInformation(){
	if(pageIndex++ > 0){
		pdf.addPage();
	}
	
	getPDFPageTemplate();
	
	pdf.setFontSize(24);
	pdf.setTextColor(255, 255, 255);
	pdf.text(tr('General Information'), 31, 70);
	
	var oSerializer = new XMLSerializer();
    var sXML = oSerializer.serializeToString(document.querySelector("#report #vector_world_map svg"));
	var canvasMap = document.createElement('canvas');
	canvasMap.width = 500;
	canvasMap.height = 350;
    canvg(canvasMap, sXML,{ ignoreMouse: true, ignoreAnimation: true })
	
	var Canvas = document.createElement('canvas');
        Canvas.width = 500; 
        Canvas.height = 350;
		
	var ctx=Canvas.getContext("2d");
		ctx.fillStyle="#b3d1ff";
		ctx.fillRect(0,0,500,350);
	
	ctx.drawImage(canvasMap, 0, 0);
	
	ctx.strokeStyle = '#cfcfcf';
	ctx.rect(0,0,500,350);
	ctx.stroke();
	
	var mapBGDataURLImageImport = Canvas.toDataURL('image/jpeg');
	pdf.addImage(mapBGDataURLImageImport, "jpeg", 90, 80, 110, 0);
	
	
	
	pdf.addImage(imgGI, "png", 17.3, 63.5, 6, 0);
	
	pdf.setFontSize(12);
	pdf.setTextColor(48, 48, 48);
	pdf.text(tr('Capital'), 20, 83);
	
	
	
	pdf.text(tr('Population'), 20, 105);
	
	pdf.setFontSize(8);
	
	var disclamer = tr('Disclaimer: The material presented on this map does not imply the expression of any opinion, recognition or endorsement on the part of Ministry of Economy and the United Arab Emirates concerning the legal status of any country, territory, city or area of its authorities or any delimitation of its frontiers or boundaries.');

	var text2 = pdf.splitTextToSize(disclamer, 65);
	pdf.text(text2, 20, 137);
	
	if(reportData.genInfo !=null && reportData.genInfo.length>0){
		var gridColumns = [
			{title: "", dataKey: "id"},
			{title: "", dataKey: "value"}
		];
		
		var gridData = [];
		
		
			pdf.setFontSize(18);
			reportData.genInfo.forEach(function(el) {
				var addElement = true;
				//pdf.setFontType("bold");
				if(el.weight == 1) {
					//Capital
					pdf.text(el.value, 20, 90);
					addElement = false;
				}
				
				if(el.weight == 3) {
					$(".GICountryTitle .population .value").text();
					//Population
					pdf.text(setValuesFormatsInt(Math.round(parseFloat(el.value.replace(/[^\d\.]/g,'') ))) + ' ' + tr('Millions'), 20, 112);
					addElement = false;
				}
				if(addElement){
					var title = el.name;
					var value = (el.value == null || isNaN(el.value) ?el.value:setValuesFormats(el.value));
					
					gridData.push({
						id: title,
						value: value,
					});
				}
				
				

			});
		var table = pdf.autoTable(gridColumns, gridData,{
			styles: {
				cellPadding: {top: 1, right: 1, bottom: 1, left: 10}, // a number, array or object (see margin below)
				fontSize: 10,
				font: "helvetica",
			},
			showHeader: 'never',
			startY:163,
			margin: {top: 10, right: 10, bottom: 10, left: 10},
		});
	}
	
}

function genGeneralInformation_AR(){
	if(pageIndex++ > 0){
		docDefinition.content.push({
			text: '',
			pageBreak: 'before'
		});
	}
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [475],
			body: [
				[ reverseWords(tr('General Information')),],
			]
		},
		absolutePosition: {x:20, y:160},
		layout: 'noBorders',
		style:'pageHeader',
		
	});
	
	docDefinition.content.push({
		image: giLoadedDataURLImage,
		width: 18,
		absolutePosition: {x:526, y:177}		
	});
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [220],
			body: [
				[ reverseWords(tr('Capital')),],
			]
		},
		absolutePosition: {x:315, y:230},
		layout: 'noBorders',
		style:'giCapital',
		
	});
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [220],
			body: [
				[ reverseWords(tr('Population')),],
			]
		},
		absolutePosition: {x:315, y:300},
		layout: 'noBorders',
		style:'giCapital',
		
	});
	
	var disclamer = tr('Disclaimer: The material presented on this map does not imply the expression of any opinion, recognition or endorsement on the part of Ministry of Economy and the United Arab Emirates concerning the legal status of any country, territory, city or area of its authorities or any delimitation of its frontiers or boundaries.');
	
	disclamer = textToLines(disclamer, 60, true,100);
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [220],
			body: [
				[ disclamer,],
			]
		},
		absolutePosition: {x:315, y:375},
		layout: 'noBorders',
		style:'giDisclamer',
		
	});

	var oSerializer = new XMLSerializer();
    var sXML = oSerializer.serializeToString(document.querySelector("#report #vector_world_map svg"));
	var canvasMap = document.createElement('canvas');
	canvasMap.width = 500;
	canvasMap.height = 350;
    canvg(canvasMap, sXML,{ ignoreMouse: true, ignoreAnimation: true })
	
	var Canvas = document.createElement('canvas');
        Canvas.width = 500; 
        Canvas.height = 350;
		
	var ctx=Canvas.getContext("2d");
		ctx.fillStyle="#b3d1ff";
		ctx.fillRect(0,0,500,350);
	
	ctx.drawImage(canvasMap, 0, 0);
	
	ctx.strokeStyle = '#cfcfcf';
	ctx.rect(0,0,500,350);
	ctx.stroke();
	
	var mapBGDataURLImageImport = Canvas.toDataURL('image/png');
	docDefinition.content.push({
		image: mapBGDataURLImageImport,
		width: 280,
		absolutePosition: {x:28, y:225}		
	});
	
	if(reportData.genInfo !=null && reportData.genInfo.length>0){
			var gridData = [];
			reportData.genInfo.forEach(function(el) {
				var addElement = true;
				if(el.weight == 1) {			
					docDefinition.content.push({
						table: {
							headerRows: 0,
							widths: [220],
							body: [
								[ el.value,],
							]
						},
						absolutePosition: {x:315, y:243},
						layout: 'noBorders',
						style:'giCapitalName',
						
					});
					
					addElement = false;
				}
				
				if(el.weight == 3) {
					//Population					
					docDefinition.content.push({
						table: {
							headerRows: 0,
							widths: [250],
							body: [
								[
									{text: [tr('Millions'), 
										{text: setValuesFormatsInt(Math.round(parseFloat(el.value.replace(/[^\d\.]/g,'') ))) + ' ', style:'number',}
									]}
								],
							]
						},
						absolutePosition: {x:285, y:313},
						layout: 'noBorders',
						style:'giCapitalName',
						
					});
					addElement = false;
				}

				if(addElement){
					var title = reverseWords(el.name);
					var value = (el.value == null || isNaN(el.value) ?el.value:setValuesFormats(el.value));
					
					gridData.push([
						{text:value, margin: [15, 0, 0, 0]},
						{text:title, style:{alignment:'right',}, margin: [0, 0, 15, 0]},
					]);
				}
			});
		docDefinition.content.push({
			table: {
				headerRows: 0,
				widths: [100,420],
				body: gridData,
			},
			layout: {
				fillColor: function (i, node) {
					return (i % 2 === 0) ? '#eeeeee' : null;
				},
				paddingLeft: function(i, node) { return 1; },
				paddingRight: function(i, node) { return 1; },
				paddingTop: function(i, node) { return 1; },
				paddingBottom: function(i, node) { return 1; },
				hLineWidth:function(t){return 0},
				vLineWidth:function(t){return 0},
			},
			style:'giTable',
			absolutePosition: {x:28, y:440},
		});
	}
	
}

function genAgreements(){
if(pageIndex++ > 0){
		pdf.addPage();
	}
	getPDFPageTemplate();
	pdf.setFontSize(24);
	pdf.setTextColor(255, 255, 255);
	pdf.text('Agreements', 31, 70);
	
	pdf.addImage(imgAgr, "png", 16.8, 65, 7, 0);
	
	pdf.setFontSize(10);
	var years = getActiveYearRange();
	pdf.text(tr('Year: ' + years[0] + "-" + years[1]), 105, 56.5);
	
	if(reportData.agreements !=null && reportData.agreements.length>0){

		
		var headerCanvas = document.createElement('canvas');
            headerCanvas.width = pdfPageWidth - 20;
            headerCanvas.height = 6;
		
		var ctx=headerCanvas.getContext("2d");
			ctx.fillStyle="#2c2c2c";
			ctx.fillRect(0,0,300,10);
			
			ctx.fillStyle="#b68a35";
			ctx.fillRect(0,0,15,10);
		
		var headerDataURLImage = headerCanvas.toDataURL('image/png');
		
		var blockTop = 82;
		
		
		var text = "";
		var agr = reportData.agreements.reverse();
		agr.forEach(function(el) {
			pdf.setFontSize(10);
			text = el.explain;
			
			var textHeight = 0;
			
			pdf.autoTable([{title: "", dataKey: "text"},], [{ text: text},],{
				theme: 'plain', // 'striped', 'grid' or 'plain'
				styles: {
					cellPadding: {top: 1, right: 1, bottom: 1, left: 10}, // a number, array or object (see margin below)
					fontSize: 10,
					overflow: 'linebreak', 
					//textColor: 'transparent',
				},
				showHeader: 'never',
				startY:0,
				tableWidth: pdfPageWidth - 30, // 'auto', 'wrap' or a number,
				pageBreak: 'avoid', // 'auto',  or 'always'
				margin: {top: 10, right: 0, bottom: 10, left: pdfPageWidth},
				drawCell: function (cell, data) {
					textHeight = cell.height;
				},
			});
			
			
			var addElement = true;
			var newBlockTop = blockTop + 10 + textHeight;
				//pdf.setFontType("bold");
				
			if(newBlockTop > 280){
				pdf.addPage();pageIndex++;
				getPDFPageTemplate();
				pdf.setFontSize(24);
				pdf.setTextColor(255, 255, 255);
				pdf.text('Agreements', 31, 70);
				
				pdf.setFontSize(10);
				var years = getActiveYearRange();
				pdf.text(tr('Year: ' + years[0] + "-" + years[1]), 105, 56.5);
				
				pdf.addImage(imgAgr, "png", 16.8, 65, 7, 0);
				blockTop = 82;
				newBlockTop = blockTop + 10 + textHeight;
			}
			pdf.setFontSize(10);
			pdf.addImage(headerDataURLImage, "png", 10, blockTop - 4.3, pdfPageWidth - 20, 0);
			
			
			pdf.setTextColor(255, 255, 255);
			pdf.text(el.date, 31, blockTop);
			pdf.setTextColor(100, 100, 100);
			//pdf.text(text2, 25, blockTop + 7);
			
			
			pdf.autoTable([{title: "", dataKey: "text"},], [{ text: text},],{
				theme: 'plain', // 'striped', 'grid' or 'plain'
				styles: {
					cellPadding: {top: 1, right: 1, bottom: 1, left: 10}, // a number, array or object (see margin below)
					fontSize: 10,
					overflow: 'linebreak', 
					//textColor: [255, 255, 255],
				},
				showHeader: 'never',
				startY:blockTop + 3,
				tableWidth: pdfPageWidth - 30,
				margin: {top: 10, right: 10, bottom: 10, left: 10},
			});
			
			blockTop = newBlockTop;
		});
		
	}
	
}

function genAgreements_AR(){
	if(pageIndex++ > 0){
		docDefinition.content.push({
			text: '',
			pageBreak: 'before'
		});
	}
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [475],
			body: [
				[ reverseWords(tr('Agreements')),],
			]
		},
		absolutePosition: {x:20, y:160},
		layout: 'noBorders',
		style:'pageHeader',
		
	});
	
	docDefinition.content.push({
		image: agrLoadedDataURLImage,
		width: 18,
		absolutePosition: {x:525, y:183}		
	});
	
	var years = getActiveYearRange();
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [300],
			body: [[{
					text:reverseWords(tr('Year')+ ': ' + years[0] + " - " + years[1]),
					style:'pageCountry',
			}]],
			
		},
		absolutePosition: {x:20, y:143},
			layout: 'noBorders',
			style:{
				alignment: 'right', 
				lineHeight: .7,
				color: '#fff',
			}
	});
	
	
	
	if(reportData.agreements !=null && reportData.agreements.length>0){
		
		var headerCanvas = document.createElement('canvas');
            headerCanvas.width = 540;
            headerCanvas.height = 20;
		
		var ctx=headerCanvas.getContext("2d");
			ctx.fillStyle="#2c2c2c";
			ctx.fillRect(0,0,540,20);
			
			ctx.fillStyle="#b68a35";
			ctx.fillRect(480,0,540,20);
		
		var headerDataURLImage = headerCanvas.toDataURL('image/png');
		
		
		var blockTop = 220;
		var agr = reportData.agreements.reverse();
		agr.forEach(function(el) {
			
			var expainText = textToLines(el.explain, 80, true, 25);
			var blockHeight = expainText.split("\n").length * 20;
			
			if(blockTop + blockHeight + 25 > 770){

				docDefinition.content.push({
					text: '',
					pageBreak: 'before'
				});
				
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [475],
						body: [
							[ reverseWords(tr('Agreements')),],
						]
					},
					absolutePosition: {x:20, y:160},
					layout: 'noBorders',
					style:'pageHeader',
					
				});
				
				docDefinition.content.push({
					image: agrLoadedDataURLImage,
					width: 18,
					absolutePosition: {x:525, y:183}		
				});
				
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [300],
						body: [[{
								text:reverseWords(tr('Year')+ ': ' + years[0] + " - " + years[1]),
								style:'pageCountry',
						}]],
						
					},
					absolutePosition: {x:20, y:143},
						layout: 'noBorders',
						style:{
							alignment: 'right', 
							lineHeight: .7,
							color: '#fff',
						}
				});
				
				blockTop = 220;
			}
			
			docDefinition.content.push({
				image: headerDataURLImage,
				width: 540,
				absolutePosition: {x:28, y:blockTop}		
			});
			
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [468],
					body: [[{
							text:el.date,
							style:'ACVDate',
					}]],
					
				},
				absolutePosition: {x:28, y:blockTop-2},
					layout: 'noBorders',
					style:{
						alignment: 'right', 
						lineHeight: .7,
						color: '#fff',
					}
			});
			
			blockTop+=25;
			
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [535],
					body: [[{
							text:expainText,
							style:'ACVExpain',
					}]],
					
				},
				absolutePosition: {x:28, y:blockTop-2},
					layout: 'noBorders',
					style:{
						alignment: 'right', 
						lineHeight: .7,
						color: '#fff',
					}
			});
			blockTop+=blockHeight;
		});
	}
}

function genVisits(){
if(pageIndex++ > 0){
		pdf.addPage();
	}
	getPDFPageTemplate();
	pdf.setFontSize(24);
	pdf.setTextColor(255, 255, 255);
	pdf.text('Visits', 31, 70);
	
	pdf.addImage(imgAgr, "png", 16.8, 65, 7, 0);
	
	pdf.setFontSize(10);
	var years = getActiveYearRange();
	pdf.text(tr('Year: ' + years[0] + "-" + years[1]), 105, 56.5);
	
	if(reportData.visits !=null && reportData.visits.length>0){
		
		var headerCanvas = document.createElement('canvas');
            headerCanvas.width = pdfPageWidth - 20;
            headerCanvas.height = 6;
		
		var ctx=headerCanvas.getContext("2d");
			ctx.fillStyle="#2c2c2c";
			ctx.fillRect(0,0,300,10);
			
			ctx.fillStyle="#b68a35";
			ctx.fillRect(0,0,15,10);
		
		var headerDataURLImage = headerCanvas.toDataURL('image/png');
		
		var blockTop = 82;
		
		
		var text = "";
		var vis = reportData.visits.reverse();
		vis.forEach(function(el) {
			pdf.setFontSize(10);
			text = el.explain;
			
			var textHeight = 0;
			
			pdf.autoTable([{title: "", dataKey: "text"},], [{ text: text},],{
				theme: 'plain', // 'striped', 'grid' or 'plain'
				styles: {
					cellPadding: {top: 1, right: 1, bottom: 1, left: 10}, // a number, array or object (see margin below)
					fontSize: 10,
					overflow: 'linebreak', 
					//textColor: 'transparent',
				},
				showHeader: 'never',
				startY:0,
				tableWidth: pdfPageWidth - 30, // 'auto', 'wrap' or a number,
				pageBreak: 'avoid', // 'auto',  or 'always'
				margin: {top: 10, right: 0, bottom: 10, left: pdfPageWidth},
				drawCell: function (cell, data) {
					textHeight = cell.height;
				},
			});
			
			
			var addElement = true;
			var newBlockTop = blockTop + 10 + textHeight;
				//pdf.setFontType("bold");
				
			if(newBlockTop > 280){
				pdf.addPage();pageIndex++;
				getPDFPageTemplate();
				pdf.setFontSize(24);
				pdf.setTextColor(255, 255, 255);
				pdf.text('Visits', 31, 70);
				
				pdf.setFontSize(10);
				var years = getActiveYearRange();
				pdf.text(tr('Year: ' + years[0] + "-" + years[1]), 105, 56.5);
				
				pdf.addImage(imgAgr, "png", 16.8, 65, 7, 0);
				blockTop = 82;
				newBlockTop = blockTop + 10 + textHeight;
			}
			pdf.setFontSize(10);
			pdf.addImage(headerDataURLImage, "png", 10, blockTop - 4.3, pdfPageWidth - 20, 0);
			
			
			pdf.setTextColor(255, 255, 255);
			pdf.text(el.date, 31, blockTop);
			pdf.setTextColor(100, 100, 100);
			//pdf.text(text2, 25, blockTop + 7);
			
			
			pdf.autoTable([{title: "", dataKey: "text"},], [{ text: text},],{
				theme: 'plain', // 'striped', 'grid' or 'plain'
				styles: {
					cellPadding: {top: 1, right: 1, bottom: 1, left: 10}, // a number, array or object (see margin below)
					fontSize: 10,
					overflow: 'linebreak', 
					//textColor: [255, 255, 255],
				},
				showHeader: 'never',
				startY:blockTop + 3,
				tableWidth: pdfPageWidth - 30,
				margin: {top: 10, right: 10, bottom: 10, left: 10},
			});			
			
			blockTop = newBlockTop;
		});
		
	}
}

function genVisits_AR(){
	if(pageIndex++ > 0){
		docDefinition.content.push({
			text: '',
			pageBreak: 'before'
		});
	}
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [475],
			body: [
				[ reverseWords(tr('Visits')),],
			]
		},
		absolutePosition: {x:20, y:160},
		layout: 'noBorders',
		style:'pageHeader',
		
	});
	
	docDefinition.content.push({
		image: agrLoadedDataURLImage,
		width: 18,
		absolutePosition: {x:525, y:183}		
	});
	
	var years = getActiveYearRange();
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [300],
			body: [[{
					text:reverseWords(tr('Year')+ ': ' + years[0] + " - " + years[1]),
					style:'pageCountry',
			}]],
			
		},
		absolutePosition: {x:20, y:143},
			layout: 'noBorders',
			style:{
				alignment: 'right', 
				lineHeight: .7,
				color: '#fff',
			}
	});
	
	
	
	if(reportData.visits !=null && reportData.visits.length>0){
		
		var headerCanvas = document.createElement('canvas');
            headerCanvas.width = 540;
            headerCanvas.height = 20;
		
		var ctx=headerCanvas.getContext("2d");
			ctx.fillStyle="#2c2c2c";
			ctx.fillRect(0,0,540,20);
			
			ctx.fillStyle="#b68a35";
			ctx.fillRect(480,0,540,20);
		
		var headerDataURLImage = headerCanvas.toDataURL('image/png');
		
		
		var blockTop = 220;
		var vis = reportData.visits.reverse();
		vis.forEach(function(el) {
			
			var expainText = textToLines(el.explain, 80, true, 25);
			var blockHeight = expainText.split("\n").length * 20;
			
			if(blockTop + blockHeight + 25 > 770){

				docDefinition.content.push({
					text: '',
					pageBreak: 'before'
				});
				
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [475],
						body: [
							[ reverseWords(tr('Visits')),],
						]
					},
					absolutePosition: {x:20, y:160},
					layout: 'noBorders',
					style:'pageHeader',
					
				});
				
				docDefinition.content.push({
					image: agrLoadedDataURLImage,
					width: 18,
					absolutePosition: {x:525, y:183}		
				});
				
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [300],
						body: [[{
								text:reverseWords(tr('Year')+ ': ' + years[0] + " - " + years[1]),
								style:'pageCountry',
						}]],
						
					},
					absolutePosition: {x:20, y:143},
						layout: 'noBorders',
						style:{
							alignment: 'right', 
							lineHeight: .7,
							color: '#fff',
						}
				});
				
				blockTop = 220;
			}
			
			docDefinition.content.push({
				image: headerDataURLImage,
				width: 540,
				absolutePosition: {x:28, y:blockTop}		
			});
			
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [468],
					body: [[{
							text:el.date,
							style:'ACVDate',
					}]],
					
				},
				absolutePosition: {x:28, y:blockTop-2},
					layout: 'noBorders',
					style:{
						alignment: 'right', 
						lineHeight: .7,
						color: '#fff',
					}
			});
			
			blockTop+=25;
			
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [535],
					body: [[{
							text:expainText,
							style:'ACVExpain',
					}]],
					
				},
				absolutePosition: {x:28, y:blockTop-2},
					layout: 'noBorders',
					style:{
						alignment: 'right', 
						lineHeight: .7,
						color: '#fff',
					}
			});
			blockTop+=blockHeight;
		});
	}
}

function genCommitteess(){
	if(pageIndex++ > 0){
		pdf.addPage();
	}
	getPDFPageTemplate();
	pdf.setFontSize(24);
	pdf.setTextColor(255, 255, 255);
	pdf.text('Committees', 31, 70);
	
	pdf.addImage(imgAgr, "png", 16.8, 65, 7, 0);
	
	pdf.setFontSize(10);
	var years = getActiveYearRange();
	pdf.text(tr('Year: ' + years[0] + "-" + years[1]), 105, 56.5);
	
	if(reportData.committees !=null && reportData.committees.length>0){
		
		var headerCanvas = document.createElement('canvas');
            headerCanvas.width = pdfPageWidth - 20;
            headerCanvas.height = 6;
		
		var ctx=headerCanvas.getContext("2d");
			ctx.fillStyle="#2c2c2c";
			ctx.fillRect(0,0,300,10);
			
			ctx.fillStyle="#b68a35";
			ctx.fillRect(0,0,15,10);
		
		var headerDataURLImage = headerCanvas.toDataURL('image/png');
		
		var blockTop = 82;
		
		
		var text = "";
		var comm = reportData.committees.reverse();
		comm.forEach(function(el) {
			pdf.setFontSize(10);
			text = el.explain;
			
			var textHeight = 0;
			
			pdf.autoTable([{title: "", dataKey: "text"},], [{ text: text},],{
				theme: 'plain', // 'striped', 'grid' or 'plain'
				styles: {
					cellPadding: {top: 1, right: 1, bottom: 1, left: 10}, // a number, array or object (see margin below)
					fontSize: 10,
					overflow: 'linebreak', 
					//textColor: 'transparent',
				},
				showHeader: 'never',
				startY:0,
				tableWidth: pdfPageWidth - 30, // 'auto', 'wrap' or a number,
				pageBreak: 'avoid', // 'auto',  or 'always'
				margin: {top: 10, right: 0, bottom: 10, left: pdfPageWidth},
				drawCell: function (cell, data) {
					textHeight = cell.height;
				},
			});
			
			
			var addElement = true;
			var newBlockTop = blockTop + 10 + textHeight;
				//pdf.setFontType("bold");
				
			if(newBlockTop > 280){
				pdf.addPage();pageIndex++;
				getPDFPageTemplate();
				pdf.setFontSize(24);
				pdf.setTextColor(255, 255, 255);
				pdf.text('Committeess', 31, 70);
				
				pdf.setFontSize(10);
				var years = getActiveYearRange();
				pdf.text(tr('Year: ' + years[0] + "-" + years[1]), 105, 56.5);
				
				pdf.addImage(imgAgr, "png", 16.8, 65, 7, 0);
				blockTop = 82;
				newBlockTop = blockTop + 10 + textHeight;
			}
			pdf.setFontSize(10);
			pdf.addImage(headerDataURLImage, "png", 10, blockTop - 4.3, pdfPageWidth - 20, 0);
			
			
			pdf.setTextColor(255, 255, 255);
			pdf.text(el.date, 31, blockTop);
			pdf.setTextColor(100, 100, 100);
			//pdf.text(text2, 25, blockTop + 7);
			
			
			pdf.autoTable([{title: "", dataKey: "text"},], [{ text: text},],{
				theme: 'plain', // 'striped', 'grid' or 'plain'
				styles: {
					cellPadding: {top: 1, right: 1, bottom: 1, left: 10}, // a number, array or object (see margin below)
					fontSize: 10,
					overflow: 'linebreak', 
					//textColor: [255, 255, 255],
				},
				showHeader: 'never',
				startY:blockTop + 3,
				tableWidth: pdfPageWidth - 30,
				margin: {top: 10, right: 10, bottom: 10, left: 10},
			});
			
			blockTop = newBlockTop;
		});
		
	}
}

function genCommitteess_AR(){
	
	if(pageIndex++ > 0){
		docDefinition.content.push({
			text: '',
			pageBreak: 'before'
		});
	}
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [475],
			body: [
				[ reverseWords(tr('Committees')),],
			]
		},
		absolutePosition: {x:20, y:160},
		layout: 'noBorders',
		style:'pageHeader',
		
	});
	
	docDefinition.content.push({
		image: agrLoadedDataURLImage,
		width: 18,
		absolutePosition: {x:525, y:183}		
	});
	
	var years = getActiveYearRange();
	
	docDefinition.content.push({
		table: {
			headerRows: 0,
			widths: [300],
			body: [[{
					text:reverseWords(tr('Year')+ ': ' + years[0] + " - " + years[1]),
					style:'pageCountry',
			}]],
			
		},
		absolutePosition: {x:20, y:143},
			layout: 'noBorders',
			style:{
				alignment: 'right', 
				lineHeight: .7,
				color: '#fff',
			}
	});
	
	
	
	if(reportData.committees !=null && reportData.committees.length>0){
		
		var headerCanvas = document.createElement('canvas');
            headerCanvas.width = 540;
            headerCanvas.height = 20;
		
		var ctx=headerCanvas.getContext("2d");
			ctx.fillStyle="#2c2c2c";
			ctx.fillRect(0,0,540,20);
			
			ctx.fillStyle="#b68a35";
			ctx.fillRect(480,0,540,20);
		
		var headerDataURLImage = headerCanvas.toDataURL('image/png');
		
		
		var blockTop = 220;
		var comm = reportData.committees.reverse();
		comm.forEach(function(el) {
			
			var expainText = textToLines(el.explain, 80, true, 25);
			var blockHeight = expainText.split("\n").length * 20;
			
			if(blockTop + blockHeight + 25 > 770){

				docDefinition.content.push({
					text: '',
					pageBreak: 'before'
				});
				
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [475],
						body: [
							[ reverseWords(tr('Committees')),],
						]
					},
					absolutePosition: {x:20, y:160},
					layout: 'noBorders',
					style:'pageHeader',
					
				});
				
				docDefinition.content.push({
					image: agrLoadedDataURLImage,
					width: 18,
					absolutePosition: {x:525, y:183}		
				});
				
				docDefinition.content.push({
					table: {
						headerRows: 0,
						widths: [300],
						body: [[{
								text:reverseWords(tr('Year')+ ': ' + years[0] + " - " + years[1]),
								style:'pageCountry',
						}]],
						
					},
					absolutePosition: {x:20, y:143},
						layout: 'noBorders',
						style:{
							alignment: 'right', 
							lineHeight: .7,
							color: '#fff',
						}
				});
				
				blockTop = 220;
			}
			
			docDefinition.content.push({
				image: headerDataURLImage,
				width: 540,
				absolutePosition: {x:28, y:blockTop}		
			});
			
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [468],
					body: [[{
							text:el.date,
							style:'ACVDate',
					}]],
					
				},
				absolutePosition: {x:28, y:blockTop-2},
					layout: 'noBorders',
					style:{
						alignment: 'right', 
						lineHeight: .7,
						color: '#fff',
					}
			});
			
			blockTop+=25;
			
			docDefinition.content.push({
				table: {
					headerRows: 0,
					widths: [535],
					body: [[{
							text:expainText,
							style:'ACVExpain',
					}]],
					
				},
				absolutePosition: {x:28, y:blockTop-2},
					layout: 'noBorders',
					style:{
						alignment: 'right', 
						lineHeight: .7,
						color: '#fff',
					}
			});
			blockTop+=blockHeight;
		});
	}
}

var pdfName = "UAE-Foreign-Trade.pdf";
function genPDFReport(){
	if(pdfCatFiter>0){
		if(isAllDataReady()){
			currentProgess = 20;
			setLoadingProgress(currentProgess/maxReportProgress);
			
			appLang = getAppLang();
			
			if(appLang == 'EN'){
				pdf = new jsPDF();

				pdfInternals = pdf.internal;
				pdfPageSize = pdfInternals.pageSize;
				pdfPageWidth = pdfPageSize.width;
				pdfPageHeight = pdfPageSize.height;
			 
				setTimeout(function(){
					if(pdfCatFiter & 1) {genGeneralInformation();currentProgess += 10;setLoadingProgress(currentProgess/maxReportProgress);}
					setTimeout(function(){
						if(pdfCatFiter & 2) {genTradeVolume();currentProgess += 10;setLoadingProgress(currentProgess/maxReportProgress);}
						setTimeout(function(){
							if(pdfCatFiter & 4)  {genTradeItems();currentProgess += 10;setLoadingProgress(currentProgess/maxReportProgress);}
							setTimeout(function(){
								if(pdfCatFiter & 24) {genTradeBalance();currentProgess += 10;setLoadingProgress(currentProgess/maxReportProgress);}
								setTimeout(function(){
									if(pdfCatFiter & 256) {genInvestmentsFacts();currentProgess += 10;setLoadingProgress(currentProgess/maxReportProgress);}
									setTimeout(function(){
										if(pdfCatFiter & 32) {genAgreements();currentProgess += 10;setLoadingProgress(currentProgess/maxReportProgress);}
										setTimeout(function(){
											if(pdfCatFiter & 64) {genVisits();currentProgess += 10;setLoadingProgress(currentProgess/maxReportProgress);}
											setTimeout(function(){
												if(pdfCatFiter & 128) {genCommitteess();currentProgess += 10;setLoadingProgress(currentProgess/maxReportProgress);}
												setTimeout(function(){
													if(pdfCatFiter & 128) {genCommitteess();currentProgess += 10;setLoadingProgress(currentProgess/maxReportProgress);}
													setTimeout(function(){
														try{
													
															pdfOutput = pdf.output();
														
															var buffer = new ArrayBuffer(pdfOutput.length);
															var array = new Uint8Array(buffer);
															for (var i = 0; i < pdfOutput.length; i++) {
																array[i] = pdfOutput.charCodeAt(i);
															} 
															
														
															var path = device.platform == "Android" ? cordova.file.externalDataDirectory : cordova.file.documentsDirectory; 
															var filename = pdfName;

															window.resolveLocalFileSystemURL(path, function(dir) {
																//alert(path);
																dir.getFile(filename, {create:true}, function(fileEntry) {
																	var entry = fileEntry ;
																	  //alert(entry);
																		 
																	  fileEntry.createWriter(function(writer) {
																		 writer.onwrite = function(evt) {
																		 //alert("write success");
																	  };
																 
																	  //alert("writing to file");
																		 //writer.write( pdfOutput );
																		 
																		 writer.write(buffer);
																		 //alert(tr('Report saved to ' + path + filename));
																		 currentProgess += 20;setLoadingProgress(currentProgess/maxReportProgress);
																		 hideReportGeneratingWindow();
																		 cordova.plugins.fileOpener2.open(
																			path + filename, // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
																			'application/pdf', 
																			{ 
																				error : function(e) { 
																					console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
																				},
																				success : function () {
																					console.log('file opened successfully'); 				
																				}
																			}
																		);
																		 //window.plugins.fileOpener.open(path + filename);
																	  }, function(error) {
																		 //alert(error);
																	  });
																	  
																});
															});		
														}catch(err){
															hideReportGeneratingWindow();
															pdf.save(pdfName);
														}
														pageIndex = 0;
													},100);
												},100);
											},100);
										},100);
									},100);
								},100);
							},100);
						},100);
					},100);
				},100);
				
			}else{
				
				pdfMake.fonts = {
				   DroidKufi: {
					 normal: 'DroidKufi.ttf',
					 bold: 'DroidKufi-Bold.ttf',
					 italics: 'DroidKufi.ttf',
					 bolditalics: 'DroidKufi.ttf'
				   },
				}
				docDefinition = { 
					background: [
						{
						  // if you specify width, image will scale proportionally
						  image: logoLoadedDataURLImage,
						  width: 224,
						  absolutePosition: {x:340, y:28}
						},
						{
							table: {
								// headers are automatically repeated if the table spans over multiple pages
								// you can declare how many rows should be treated as headers
								headerRows: 0,
								widths: [200],
								body: [
								  [ reverseWords(tr('Non-Oil Foreign Trade Relation Report'))+"\n"+reverseWords(tr('between The United Arab Emirates and'))+"\n"+curCountry.name],
								],							
							},
							absolutePosition: {x:20, y:30},
							layout: 'noBorders',
							style:{
								alignment: 'right', 
								lineHeight: .7,
								fontSize: 10,
							}
						},
						{
						  // if you specify width, image will scale proportionally
						  image: sectionHeaderLoadedDataURLImage,
						  width: 595,
						  absolutePosition: {x:0, y:140}
						},
						{
							table: {
								headerRows: 0,
								widths: [440,28,28],
								body: [
								  [ {
									  text:curCountry.name,
									  style:'pageCountry',
									}, 
									{
									  // if you specify width, image will scale proportionally
									  image: flagLoadedDataURLImage,
									  width: 28,
									  
									},' '],
								],							
							},
							absolutePosition: {x:20, y:141},
							layout: 'noBorders',
							style:{
								alignment: 'right', 
								lineHeight: .7,
								color: '#fff',
							}
						},
						{
							table: {
								headerRows: 0,
								widths: [550],
								body: [
								  [ {
									  text:reverseWords(tr('Published by: Analysis, Trade Information Department - Foreign Trade Sector')) + "\n"+
										reverseWords(tr('Last update: May 2017')) + "\n"+
										reverseWords(tr('All copyrights reserved 2017 - UAE Ministry of Economy'))
									}, 
								  ],
								],							
							},
							absolutePosition: {x:20, y:780},
							layout: 'noBorders',
							style:{
								alignment: 'right', 
								lineHeight: 0.9,
								fontSize: 8,
							}
						},
						
					],
					content: [],
					defaultStyle: {
						font: 'DroidKufi',
						fontSize: 12,
						color: "#303030",
						
					},
						styles: {
							number:{
								//font: 'CronosPro',
							},
							pageCountry: {
								fontSize: 10,
								color: "#ffffff",
								alignment: 'right',
							},
							
							pageCurrency: {
								fontSize: 10,
								color: "#ffffff",
								alignment: 'left',
							},
							
							pageHeader: {
								fontSize: 24,
								color: "#ffffff",
								alignment: 'right',
							},
							
							blockHeader: {
								fontSize: 12,
								color: "#ffffff",
								alignment: 'right',
							},
							
							blockHeader2: {
								fontSize: 12,
								color: "#ffffff",
								alignment: 'right',
							},
							
							tradeItem: {
								fontSize: 10,
								color: "#303030",
								alignment: 'right',
							},
							
							tradeItemLeft: {
								fontSize: 12,
								color: "#303030",
								alignment: 'left',
							},
							blockHeader2left: {
								fontSize: 12,
								color: "#ffffff",
								alignment: 'left',
							},
							giCapital: {
								fontSize: 12,
								color: "#303030",
								alignment: 'right',
							},
							
							giCapitalName: {
								fontSize: 18,
								color: "#303030",
								alignment: 'right',
							},
							
							giDisclamer: {
								fontSize: 8,
								color: "#303030",
								alignment: 'right',
								lineHeight: 0.7,
							},
							
							giTable: {
								fontSize: 10,
								color: "#2c2c2c",
								lineHeight: 0.7,
							},
							
							donutValue: {
								fontSize: 20,
								color: "#2c2c2c",
								alignment: 'center',
								lineHeight: 0.7,
							},
							
							DTIText: {
								fontSize: 8,
								color: "#2c2c2c",
								alignment: 'right',
								lineHeight: 0.7,
							},
							
							DTIValue: {
								fontSize: 20,
								color: "#2c2c2c",
								alignment: 'left',
								bold:true,
								lineHeight: 0.7,
							},
							ACVDate: {
								fontSize: 12,
								color: "#ffffff",
								alignment: 'right',
								lineHeight: 0.7,
							},
							ACVExpain: {
								fontSize: 12,
								color: "#2c2c2c",
								alignment: 'right',
								lineHeight: 0.7,
							},
							
							IFHader: {
								fontSize: 16,
								color: "#fff",
								alignment: 'right',
								lineHeight: 0.7,
							},
							
							IFHaderSmall: {
								fontSize: 8,
								color: "#fff",
								alignment: 'right',
								lineHeight: 0.7,
							},
							
							IFHaderValue: {
								fontSize: 24,
								color: "#2c2c2c",
								alignment: 'right',
								//bold:true,
								lineHeight: 0.7,
							},
							
							IFHaderValueSmall: {
								fontSize: 8,
								color: "#2c2c2c",
								alignment: 'right',
								//bold:false,
								lineHeight: 0.7,
							},
							ACTValue: {
								fontSize: 20,
								color: "#ffffff",
								alignment: 'center',
								//bold:false,
								lineHeight: 0.7,
							},
							ACTTitle: {
								fontSize: 12,
								color: "#2c2c2c",
								alignment: 'center',
								//bold:false,
								lineHeight: 0.7,
							},
							ACTTitleSmall: {
								fontSize: 8,
								color: "#2c2c2c",
								alignment: 'center',
								//bold:false,
								lineHeight: 0.7,
							},
						}
				};
				setTimeout(function(){
					if(pdfCatFiter & 1) {genGeneralInformation_AR();currentProgess += 10;setLoadingProgress(currentProgess/maxReportProgress);}
					setTimeout(function(){
						if(pdfCatFiter & 2) {genTradeVolume_AR();currentProgess += 10;setLoadingProgress(currentProgess/maxReportProgress);}
						setTimeout(function(){
							if(pdfCatFiter & 4)  {genTradeItems_AR();currentProgess += 10;setLoadingProgress(currentProgess/maxReportProgress);}
							setTimeout(function(){
								if(pdfCatFiter & 24) {genTradeBalance_AR();currentProgess += 10;setLoadingProgress(currentProgess/maxReportProgress);}
								setTimeout(function(){
									if(pdfCatFiter & 32) {genAgreements_AR();currentProgess += 10;setLoadingProgress(currentProgess/maxReportProgress);}
									setTimeout(function(){
										if(pdfCatFiter & 64) {genVisits_AR();currentProgess += 10;setLoadingProgress(currentProgess/maxReportProgress);}
										setTimeout(function(){
											if(pdfCatFiter & 128) {genCommitteess_AR();currentProgess += 10;setLoadingProgress(currentProgess/maxReportProgress);}
											setTimeout(function(){
												if(pdfCatFiter & 256) {genInvestmentsFacts_AR();currentProgess += 10;setLoadingProgress(currentProgess/maxReportProgress);}
												setTimeout(function(){
													pdfMake.createPdf(docDefinition).getBuffer(function(buff) {
														// turn buffer into blob
														var utf8 = new Uint8Array(buff);
														pdfOutput = utf8.buffer;
														/*
														var buffer = new ArrayBuffer(pdfOutput.length);
														var array = new Uint8Array(buffer);
														for (var i = 0; i < pdfOutput.length; i++) {
															array[i] = pdfOutput.charCodeAt(i);
														} */
														try{
															var path = device.platform == "Android" ? cordova.file.externalDataDirectory : cordova.file.documentsDirectory; 
															var filename = pdfName;

															window.resolveLocalFileSystemURL(path, function(dir) {
																//alert(path);
																dir.getFile(filename, {create:true}, function(fileEntry) {
																	var entry = fileEntry ;
																	  //alert(entry);
																		 
																	  fileEntry.createWriter(function(writer) {
																		 writer.onwrite = function(evt) {
																		 //alert("write success");
																	  };
																		 
																		 writer.write(pdfOutput);
																		 //alert(tr('Report saved to ' + path + filename));
																		 currentProgess += 20;setLoadingProgress(currentProgess/maxReportProgress);
																		 hideReportGeneratingWindow();
																		 cordova.plugins.fileOpener2.open(
																			path + filename, 
																			'application/pdf', 
																			{ 
																				error : function(e) { 
																					console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
																				},
																				success : function () {
																					console.log('file opened successfully'); 				
																				}
																			}
																		);
																		 //window.plugins.fileOpener.open(path + filename);
																	  }, function(error) {
																		 //alert(error);
																	  });
																	  
																});
															});		
														}catch(err){
															hideReportGeneratingWindow();
															pdfMake.createPdf(docDefinition).download(pdfName);
														}
													});
													pageIndex = 0;
												}, 100);
											}, 100);
										}, 100);
									}, 100);
								}, 100);
							}, 100);
						}, 100);
					}, 100);
				}, 100);	
			}
		}else{
			setTimeout(genPDFReport, 500);
		}
	}else{
		hideReportGeneratingWindow();
	}
}




function showReportGeneratingWindow(){
	setLoadingProgress(0);
	$('input[type=button].reportBtn').prop('disabled', true);
	$('input[type=button].reportBtn').val(tr('Please wait'));
	$('#reportFiters').css('visibility', 'hidden');
	$('#loadingReport').show();
	pageIndex = 0;
}
	
function hideReportGeneratingWindow(){
	
	$('#loadingReport').hide();
	$('#reportFiters').css('visibility', 'visible');
	setLoadingProgress(0);
	$('input[type=button].reportBtn').prop('disabled', false);
	$('input[type=button].reportBtn').val(tr('Export PDF Report'));	
}

function setLoadingProgress(value){	
	$('#loadingReport').circleProgress({
		value: value,
		size: $('#loadingReport').width(),
		startAngle:-Math.PI/2,
		animation:false,
		fill:"#b78a35",
		insertMode:'append',
	});
	//console.log(Math.round(value*100)+'%');
	var p = Math.round(value*100);
	$('#loadingReport .prValue').text(appLang == "EN" ? p+'%': '%'+p);
}

function reverseWords(str){
	return str.split(" ").reverse().join(" ");
}

function textToLines(text, lineSize, reverse, maxlines){
	var words = text.split(" ");
	
	var lines = [];
	
	var wordsCount = words.length;
	var line = [];
	var lSize = 0;
	
	for(var i = 0; i<wordsCount;i++){
		words[i].length
		if(lSize + words[i].length >= lineSize){
			if(reverse) line.reverse();
			lines.push(line.join(" "));
			line = [];
			lSize = 0;
		}
		
		line.push(words[i]);lSize += words[i].length + 1;
	}
	if(reverse) line.reverse();
	lines.push(line.join(" "));
	
	if(lines.length > maxlines) {
		lines = lines.slice(0, maxlines);
		lines[maxlines-1] = reverse ? "... " + lines[maxlines-1] : lines[maxlines-1] + "..."; 
	}
	return lines.join("\n");
}