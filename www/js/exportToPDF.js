var tempPDFDoc;
	 $(function() {
     $("#exportPDFInput").change(function (){
       var fileName = $(this).val();
       alert(fileName);
     });
});

function exportToPdf(){
	
	
	tempPDFDoc = new jsPDF();
	
	$('#exportPDF').hide();
	

	

	
	html2canvas(document.body, {
            onrendered: function(canvas) {         
                var tempImgData = canvas.toDataURL(
                    'image/png');
				tempPDFDoc.addImage(tempImgData, 'PNG', 10, 10);
				/*var pdfOutput = tempPDFDoc.output();
				
				window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dirEntry) {

						
					   var file = dirEntry.getFile("test.pdf", {create: true}, function(entry) {
						  var fileEntry = entry;
						  console.log(entry);
							alert(entry.fullPath);
						  entry.createWriter(function(writer) {
							 writer.onwrite = function(evt) {
							 console.log("write success");
						  };
					 
						  console.log("writing to file");
							 writer.write( pdfOutput );
						  }, function(error) {
							 console.log(error);
						  });
					 
					   }, function(error){
						  console.log(error);
					   });
					  console.log( file );
					},
					function(event){
					 console.log( event );
					});
				
				*/
				$('#exportPDF').show();
            }
        });
	
}


function exportToPdfFTI(){
	
	
	tempPDFDoc = new jsPDF();
	
	$('#exportPDF').hide();
	

	

	
	html2canvas($('.FTItemsCategories .Import'), {
            onrendered: function(canvas) {         
                var tempImgData = canvas.toDataURL(
                    'image/png');
				tempPDFDoc.addImage(tempImgData, 'PNG', 10, 10);
				tempPDFDoc.save();
				$('#exportPDF').show();
            }
        });
	
}

function exportToPdfACV(){
	
	
	tempPDFDoc = new jsPDF();
	
	$('#exportPDF').hide();
	

	

	
	html2canvas($('.ACV .tab-content'), {
            onrendered: function(canvas) {         
                var tempImgData = canvas.toDataURL(
                    'image/png');
					
				tempPDFDoc.text(20, 20, 'Committees & Agreements');
				tempPDFDoc.addImage(tempImgData, 'PNG', 10, 30);
				tempPDFDoc.save();
				$('#exportPDF').show();
            }
        });
	
}