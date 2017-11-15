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
	reportDataLoaded = flagLoaded = giLoaded = false;
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
}




function isAllDataReady(){
	return logoLoaded && curCountryLoaded && flagLoaded && giLoaded && reportDataLoaded;
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



function genGeneralInformation(){
	
	pdf.setFontSize(24);
	pdf.setTextColor(255, 255, 255);
	pdf.text('General Information', 31, 70);
	
	pdf.addImage(imgGI, "png", 17.3, 63.5, 6, 0);
	
	pdf.setFontSize(12);
	pdf.setTextColor(48, 48, 48);
	pdf.text('Capital', 20, 83);
	
	
	
	pdf.text('Population', 20, 105);
	
	pdf.setFontSize(8);
	var text2 = pdf.splitTextToSize('Disclaimer: The material presented on this map does not imply the expression of any opinion, recognition or endorsement on the part of Ministry of Economy and the United Arab Emirates concerning the legal status of any country, territory, city or area of its authorities or any delimitation of its frontiers or boundaries.', 65);
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

function genPDFReport(){
	if(isAllDataReady()){
		pdf = new jsPDF();
		
		
		pdfInternals = pdf.internal;
		pdfPageSize = pdfInternals.pageSize;
		pdfPageWidth = pdfPageSize.width;
		pdfPageHeight = pdfPageSize.height;
		
        getPDFPageTemplate();
		
		genGeneralInformation();
		
		pdf.addPage();
		getPDFPageTemplate();
		/*
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
		{	
			alert("writing to file");
			 var blob = pdf.output();
			 window.open(URL.createObjectURL(blob));
			 alert("writing to file end");
		}
		else
		{
			 pdf.save('report.pdf');
		}
		*/
		/*
		pdfOutput = pdf.output();
	
		var path = cordova.file.externalDataDirectory;//if IOS cordova.file.documentsDirectory
		var filename = "report.pdf";

		window.resolveLocalFileSystemURL(path, function(dir) {
			alert(path);
			dir.getFile(filename, {create:true}, function(fileEntry) {
				var entry = fileEntry ;
				  //alert(entry);
			 
				  fileEntry.createWriter(function(writer) {
					 writer.onwrite = function(evt) {
					 //alert("write success");
				  };
			 
				  //alert("writing to file");
					 writer.write( pdfOutput );
				  }, function(error) {
					 //alert(error);
				  });
				  
			});
		});		
		*/
		pdf.save('report.pdf');
	}else{
		setTimeout(genPDFReport, 500);
	}
}


	
