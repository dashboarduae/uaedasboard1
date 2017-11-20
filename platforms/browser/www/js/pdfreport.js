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



function reLoadData(){
	reportDataLoaded = flagLoaded = giLoaded = agrLoaded = ifIconLoaded = inflowIconLoaded = outflowIconLoaded = tradeGrowthIconLoaded = false;
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
}




function isAllDataReady(){
	return logoLoaded && curCountryLoaded && flagLoaded && giLoaded && ifIconLoaded && agrLoaded  && reportDataLoaded && tradeGrowthIconLoaded;
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

var pageIndex = 0;

function genTradeBalance(){
	
	
	if(pageIndex++ > 0){
		pdf.addPage();
	}
	
	getPDFPageTemplate();
	
	pdf.setFontSize(24);
	pdf.setTextColor(255, 255, 255);
	pdf.text(tr('Trade Growth and Balance'), 31, 70);
	
	pdf.addImage(tradeGrowthIconDataURLImage, "png", 17.5, 63.5, 5, 0);
	
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
		pdf.text(tr('into the UAE') + (reportData.inflowFDI[0].period != undefined ? " ("+reportData.inflowFDI[0].period+")":""), 94, 88);
		
		pdf.setTextColor(44, 44, 44);
		pdf.setFontSize(8);
		pdf.text(tr("(" + currString + ")"), 174, 88);
		
		pdf.setFontSize(24);
		var text = pdf.splitTextToSize(tr((reportData.inflowFDI[0].value != undefined?setValuesFormats(reportData.inflowFDI[0].value):"0")), 100);
		pdf.text(text, 172, 88, 'right');
		
		pdf.addImage(actBlockDataURLImage, "png", 32, 98, 27, 0);
		
		pdf.setTextColor(255, 255, 255);
		pdf.setFontSize(20);
		pdf.text(reportData.act[0].companies != undefined? "" +reportData.act[0].companies:"0", 45, 107, 'center');
		
		pdf.addImage(actBlockDataURLImage, "png", 92, 98, 27, 0);
		pdf.text(reportData.act[0].agencies != undefined? "" +reportData.act[0].agencies:"0", 105, 107, 'center');
		
		pdf.addImage(actBlockDataURLImage, "png", 152, 98, 27, 0);
		pdf.text(reportData.act[0].trademark != undefined? "" +reportData.act[0].trademark:"0", 165, 107, 'center');
		
		
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
		pdf.text(tr('from the UAE') + (reportData.outflowFDI[0].period != undefined ? " ("+reportData.outflowFDI[0].period+")":""), 98, 180);
		
		pdf.setTextColor(44, 44, 44);
		pdf.setFontSize(8);
		pdf.text(tr("(" + currString + ")"), 174, 180);
		
		pdf.setFontSize(24);
		text = pdf.splitTextToSize(tr((reportData.outflowFDI[0].value != undefined?setValuesFormats(reportData.outflowFDI[0].value):"0")), 100);
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
			pdf.save('report.pdf');
		}
		pageIndex = 0;
	}else{
		setTimeout(genPDFReport, 500);
	}
}


	
