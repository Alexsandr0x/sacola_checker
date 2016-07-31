var card_name = "blood-moon"

$.ajax({
   url:"https://sacola-checker-alexsandr-01.c9users.io/card/"+card_name,
   type:'GET',
   success: function(data){
     console.log(data);
   }
});