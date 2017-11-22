var pdf;
var pdfOutput;

var pdfCatFiter = 1;

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
var chartGrowthLoaded = true;



$(document).ready(function(){	
	$.ajaxSetup({
			type: 'POST',
			timeout: 5000,
			error: function(xhr) {
				alert(tr('Please check internet is not connection'));
			}
	});
	
	$('.reportFiter input[type="checkbox"]').change(function() {
		if($(this).is(":checked")) {
            pdfCatFiter = pdfCatFiter | $(this).data('category');
        }else{
			pdfCatFiter = pdfCatFiter & ~($(this).data('category'));
		}
		
	});
	
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
	showReportGeneratingWindow();
	reportDataLoaded = flagLoaded = giLoaded = agrLoaded = ifIconLoaded = inflowIconLoaded = outflowIconLoaded = tradeGrowthIconLoaded =
	chartBalanceLoaded = chartGrowthLoaded = tvIconLoaded = false;
	showBalanceData = [];
	showData = [];
	var years = getActiveYearRange();
	$.post(baseServiceUrl + "/pdfreport",
				{
					lang: getAppLang(),
					country: curCountry.id,
					catfilter: pdfCatFiter,
					from:years[0],
					to:years[1],
					currency:getCurCurrency()
				},
				function(data, status){

					var info = data;
					
					if(status == 'success' && info.status == 0){
						reportData = info.data;
						console.log(reportData);
						
						reportDataLoaded = true;
						
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

            logoLoadedDataURLImage = canvas.toDataURL('image/png');
			logoLoaded = true;
			
	};	
	imgLogo.src = "img/pdf/logo.png";
	
	
	sectionHeader.onload = function() {
		var canvas = document.createElement('canvas');
            canvas.width = sectionHeader.width;
            canvas.height = sectionHeader.height;

            var context = canvas.getContext('2d');
            context.drawImage(sectionHeader, 0, 0);

            sectionHeaderLoadedDataURLImage = canvas.toDataURL('image/png');
			sectionHeaderLoaded = true;
			
	};	
	sectionHeader.src = "img/pdf/sectionheder.png";
	
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
	
	
	
}

function isAllDataReady(){
	return tvIconLoaded && chartBalanceLoaded && logoLoaded && curCountryLoaded && flagLoaded && giLoaded && ifIconLoaded && agrLoaded  && reportDataLoaded && tradeGrowthIconLoaded;
}

function getPDFPageTemplate(){
	pdf.setFontSize(12);
    pdf.setTextColor(48, 48, 48);	
	pdf.setFontType("normal");
		
	pdf.text('Non-Oil Foreign Trade Relation Report', 125, 16);
	pdf.text('between The United Arab Emirates and', 125, 21.5);
	pdf.text(curCountry.name, 125, 27);
		
	pdf.addImage(logoLoadedDataURLImage, "png", 10, 10, 80, 0);
	pdf.addImage(sectionHeaderLoadedDataURLImage, "png", 0, 50, pdfPageWidth, 0);

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

function genProgressBarCanvas(color, value){
	var headerCanvas = document.createElement('canvas');
        headerCanvas.width = 600; 
        headerCanvas.height = 20;
		
	var ctx=headerCanvas.getContext("2d");
		
		ctx.rect(0,0,600,20);
		ctx.stroke();
	
		ctx.fillStyle=color;
		ctx.fillRect(1,1,599*value,19);

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
			pdf.addImage(genProgressBarCanvas("#1ca6af", curData.totalTrade.imports/curData.value), "png", 12, 108 + (i % 4)*BlockHeight, 50, 0);
			pdf.text(tr('Non-Oil Export'), 12, 118 + (i % 4)*BlockHeight);
			pdf.text(setValuesFormats(curData.totalTrade.nonOilExports), 62, 118 + (i % 4)*BlockHeight, 'right');
			pdf.addImage(genProgressBarCanvas("#83b75d", curData.totalTrade.nonOilExports/curData.value), "png", 12, 120 + (i % 4)*BlockHeight, 50, 0);
			pdf.text(tr('Re-Export'), 12, 130 + (i % 4)*BlockHeight);
			pdf.text(setValuesFormats(curData.totalTrade.reExports), 62, 130 + (i % 4)*BlockHeight, 'right');
			pdf.addImage(genProgressBarCanvas("#e0694a", curData.totalTrade.reExports/curData.value), "png", 12, 132 + (i % 4)*BlockHeight, 50, 0);
			
			
			pdf.addImage(exportBG, "png", 76, 112 + (i % 4)*BlockHeight, 56, 0);
			pdf.text(tr('Import'), 78, 106 + (i % 4)*BlockHeight);
			pdf.text(setValuesFormats(curData.derectTrade.imports), 130, 106 + (i % 4)*BlockHeight, 'right');
			pdf.addImage(genProgressBarCanvas("#1ca6af", curData.derectTrade.imports/totalDerectTrade), "png", 78, 108 + (i % 4)*BlockHeight, 52, 0);
			pdf.text(tr('Non-Oil Export'), 78, 118 + (i % 4)*BlockHeight);
			pdf.text(setValuesFormats(curData.derectTrade.nonOilExports), 130, 118 + (i % 4)*BlockHeight, 'right');
			pdf.addImage(genProgressBarCanvas("#83b75d", curData.derectTrade.nonOilExports/totalDerectTrade), "png", 78, 120 + (i % 4)*BlockHeight, 52, 0);
			pdf.text(tr('Re-Export'), 78, 130 + (i % 4)*BlockHeight);
			pdf.text(setValuesFormats(curData.derectTrade.reExports), 130, 130 + (i % 4)*BlockHeight, 'right');
			pdf.addImage(genProgressBarCanvas("#e0694a", curData.derectTrade.reExports/totalDerectTrade), "png", 78, 132 + (i % 4)*BlockHeight, 52, 0);
			
			pdf.addImage(exportBG, "png", 142, 112 + (i % 4)*BlockHeight, 56, 0);
			pdf.text(tr('Import'), 144, 106 + (i % 4)*BlockHeight);
			pdf.text(setValuesFormats(curData.freeZonesTrade.imports), 196, 106 + (i % 4)*BlockHeight, 'right');
			pdf.addImage(genProgressBarCanvas("#1ca6af", curData.freeZonesTrade.imports/totalFreeZonesTrade), "png", 144, 108 + (i % 4)*BlockHeight, 52, 0);
			pdf.text(tr('Non-Oil Export'), 144, 118 + (i % 4)*BlockHeight);
			pdf.text(setValuesFormats(curData.freeZonesTrade.nonOilExports), 196, 118 + (i % 4)*BlockHeight, 'right');
			pdf.addImage(genProgressBarCanvas("#83b75d", curData.freeZonesTrade.nonOilExports/totalFreeZonesTrade), "png", 144, 120 + (i % 4)*BlockHeight, 52, 0);
			pdf.text(tr('Re-Export'), 144, 130 + (i % 4)*BlockHeight);
			pdf.text(setValuesFormats(curData.freeZonesTrade.reExports), 196, 130 + (i % 4)*BlockHeight, 'right');
			pdf.addImage(genProgressBarCanvas("#e0694a", curData.freeZonesTrade.reExports/totalFreeZonesTrade), "png", 144, 132 + (i % 4)*BlockHeight, 52, 0);
			
			

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

function genInvestmentsFacts(){
	
	
	if(pageIndex++ > 0){
		pdf.addPage();
	}
	
	getPDFPageTemplate();
	
	pdf.setFontSize(24);
	pdf.setTextColor(255, 255, 255);
	pdf.text(tr('Investments Facts'), 31, 70);
	
	pdf.addImage(imgIFIcon, "png", 17.5, 63.5, 5, 0);
	
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
			ctx.fillRect(0,0,300,13);
			
			ctx.fillStyle="#b68a35";
			ctx.fillRect(0,0,20,13);
			
			ctx.fillStyle="#e2e2e2";
			ctx.fillRect(130,0,300,13);
		
		var headerDataURLImage = headerCanvas.toDataURL('image/png');
		
		var headerCanvas2 = document.createElement('canvas');
            headerCanvas2.width = pdfPageWidth - 20;
            headerCanvas2.height = 7;
		
		var ctx2=headerCanvas2.getContext("2d");
			ctx2.fillStyle="#2c2c2c";
			ctx2.fillRect(0,0,300,7);
			
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
		
		pdf.addImage(inflowIconDataURLImage, "png", 15, 171, 10, 0);
		
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

function genGeneralInformation(){
	
	
	if(pageIndex++ > 0){
		pdf.addPage();
	}
	
	getPDFPageTemplate();
	
	pdf.setFontSize(24);
	pdf.setTextColor(255, 255, 255);
	pdf.text(tr('General Information'), 31, 70);
	
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
				pdf.setFontType("bold");
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
					var title = HtmlEncode(el.name);
					var value = (el.value == null || isNaN(el.value) ?el.value:setValuesFormats(el.value));
					
					gridData.push({
						id: title,
						value: value,
					});
				}
				
				

			});
		pdf.autoTable(gridColumns, gridData,{
			styles: {
				cellPadding: {top: 1, right: 1, bottom: 1, left: 10}, // a number, array or object (see margin below)
				fontSize: 10,
			},
			showHeader: 'never',
			startY:163,
			margin: {top: 10, right: 10, bottom: 10, left: 10},
			drawCell: function (cell, data) {
				//console.log(cell);
				//console.log(data);
				if(data.column.dataKey == "value") {
					//cell.styles.columnWidth = 10;
					//cell.styles.halign = "right";

				}
			},
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
		reportData.committees.forEach(function(el) {
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
					console.log(textHeight);
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
			
			console.log(newBlockTop);
			
			blockTop = newBlockTop;
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
		reportData.visits.forEach(function(el) {
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
					console.log(textHeight);
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
			
			console.log(newBlockTop);
			
			blockTop = newBlockTop;
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
	pdf.text('Committeess', 31, 70);
	
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
		reportData.committees.forEach(function(el) {
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
					console.log(textHeight);
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
			
			console.log(newBlockTop);
			
			blockTop = newBlockTop;
		});
		
	}
}

function genPDFReport(){
	if(isAllDataReady()){
		
		pdf = new jsPDF();
		
		
		pdfInternals = pdf.internal;
		pdfPageSize = pdfInternals.pageSize;
		pdfPageWidth = pdfPageSize.width;
		pdfPageHeight = pdfPageSize.height;
	 
		if(pdfCatFiter & 1) genGeneralInformation();
		if(pdfCatFiter & 2) genTradeVolume();
		if(pdfCatFiter & 24)genTradeBalance();
		if(pdfCatFiter & 32) genAgreements();
		if(pdfCatFiter & 64) genVisits();
		if(pdfCatFiter & 128) genCommitteess();
		if(pdfCatFiter & 256) genInvestmentsFacts();
		
		

		try{
		pdfOutput = pdf.output();
		
		var buffer = new ArrayBuffer(pdfOutput.length);
		var array = new Uint8Array(buffer);
		for (var i = 0; i < pdfOutput.length; i++) {
			array[i] = pdfOutput.charCodeAt(i);
		} 
		
	
		var path = device.platform == "Android" ? cordova.file.externalDataDirectory : cordova.file.documentsDirectory; 
		var filename = "report.pdf";

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
			pdf.save('report.pdf');
		}
		pageIndex = 0;
		
	}else{
		setTimeout(genPDFReport, 500);
	}
}

function showReportGeneratingWindow(){
	$('input[type=button].reportBtn').prop('disabled', true);
	$('input[type=button].reportBtn').val(tr('Please wait'));
}
	
function hideReportGeneratingWindow(){
	$('input[type=button].reportBtn').prop('disabled', false);
	$('input[type=button].reportBtn').val(tr('PDF Report'));
}