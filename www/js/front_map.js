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
										if(country!=null) {
											setActiveCountry(country.id, false);
											$('#vector_world_map').vectorMap('set', 'focus',curCountry.iso2);
											updateGeneralInformation();
										}
										
									}
									countrySelectedFromMap = true;
                                }
                                });
                                
}                            
/* EOF jVectorMaps */                            



});
