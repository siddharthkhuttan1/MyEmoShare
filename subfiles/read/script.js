$(function(){
    $("button").click(function (){

            $.post('/read',{"genre":$('#genre').val()},function(data){
            for(var i=0;i<data.length;i++){
                $("#output").append("<div><div>"+data[i].username+"</div>" +
                    "<div>"+data[i].story+"</div></div>");
            }
        })
    });
})