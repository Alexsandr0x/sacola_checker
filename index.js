var card_name = "blood-moon"

$.ajax({
   url:"http://cors.io/?u=https://tappedout.net/mtg-card/"+card_name,
   type:'GET',
   success: function(data){
     price_column = $(data).find(".col-sm-4 :nth-child(3)").html();
     
     var price = parseFloat( price_column.split(" ").filter( function( el ) {
       return el != ""
     })[1].substring(1));
     console.log(price);
   }
});