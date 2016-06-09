

function TextfieldToVar() {

	var customerNumber = $("#customerNumber").val().replace(/'/g, "\\'");
	var customerLogin = $("#customerLogin").val().replace(/'/g, "\\'");
	var customerSignature = $("#customerSignature").val().replace(/'/g, "\\'");
	var interfacePartnerNumber = $("#interfacePartnerNumber").val().replace(/'/g, "\\'");
	var interfacePartnerSignature = $("#interfacePartnerSignature").val().replace(/'/g, "\\'");
	var Aktenzeichen = $("#Aktenzeichen").val().replace(/'/g, "\\'");
	
	
}