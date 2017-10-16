$(document).ready(function(){

/* jVectorMaps */
if($("#vector_world_map").length > 0){
    
    countryMap = new jvm.WorldMap({container: $('#vector_world_map'),
                                map: 'world_mill_en', 
                                backgroundColor: '#B3D1FF',                                      
                                regionsSelectable: true,
								regionsSelectableOne: true,
                                regionStyle: {selected: {fill: '#1b1e24'},
                                                initial: {fill: '#FFFFFF'}},
                                onRegionSelected: function(){ 
									if(countrySelectedFromMap){
										var country = getCountryFromListISO2(countryMap.getSelectedRegions()[0]);
										if( countryMap.getSelectedRegions()[0] != undefined && country!=null) {
											setActiveCountry(country.id, false);updateGeneralInformation();updateMap();	
										}
										
									}
									
                                }
                                });
                                
}                            
/* EOF jVectorMaps */                            
});
