$(document).ready(function(){
	$(".container .close").click(function(){
		$(this).parents(".container").animate({ opacity: "hide"}, "slow");	
	});
	$(".open").click(function(){
		$(".container").animate({ opacity: "show"}, "slow");	
	});
	$(".button-primary").on("click", function(){
		email = $ ("#email")[0].value;
		gender = $("#gender")[0].value; 
		input = $("<tr><td>" + email + "</td><td>" + gender + "</td><tr>");
		$("tbody").append(input);
	})
});