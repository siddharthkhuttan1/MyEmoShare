var genre;
$(function(){
    $(".getstories").click(function (){
            genre=$('#genre').val();
            $.post('/read',{"genre":$('#genre').val()},function(data){
            for(var i=0;i<data.length;i++){
                $("#output").append("<div><div>"+data[i].username+"</div>" +
                    "<div>"+data[i].story+"</div><button onclick='thank(this)'>Thank the storyteller.</button><div style='display:none'>"+data[i]._id+"</div></div>");
            }
        })
    });


})

function thank(el) {

    $.post('/thank',{"id":el.nextElementSibling.textContent,"genre":genre},function(data){
        for(var i=0;i<data.length;i++){
            $("#output").append("<div><div>"+data[i].username+"</div>" +
                "<div>"+data[i].story+"</div></div>");
        }
    })

}