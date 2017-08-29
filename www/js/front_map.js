$(document).ready(function(){

/* jVectorMaps */
if($("#vector_world_map").length > 0){
    
    var jvm_wm = new jvm.WorldMap({container: $('#vector_world_map'),
                                map: 'world_mill_en', 
                                backgroundColor: '#B3D1FF',                                      
                                regionsSelectable: true,
								regionsSelectableOne: true,
                                regionStyle: {selected: {fill: '#33414E'},
                                                initial: {fill: '#FFFFFF'}},
                                onRegionSelected: function(){
									window.location = "country.html?region="+jvm_wm.getSelectedRegions().toString();                                          
                                }
                                });
                                
}                            
/* EOF jVectorMaps */                            



});
