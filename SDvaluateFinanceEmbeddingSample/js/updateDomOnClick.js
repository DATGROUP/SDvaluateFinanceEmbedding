
			//sphinx.setProductUrl( 'http://gold.dat.de/FinanceLine/' );
			
			setIframeName( 'iframeSilverDAT' );
			
			//sphinx.hostUrl = "http://localhost:7080" + "/FinanceLinePostClient/client123456.html";
			
			sphinx.credentials = {
				customerNumber : "1300553",
				customerLogin : "Anwender01",
				customerSignature : "akEwRUF3TUNkOGJzQ3FqVzJTZGd5VE93N2tvTUk2MmtWOHhIaXVSRVc3c2M3cnFTakhTV2hBRFNW dHVhZVRhVw0Kc2o0d1BKTlVtYzNJRzd3TUtvcVRRSVZNT2FvPQ0KPVloRFE=",
				interfacePartnerNumber : "1300553",
				interfacePartnerSignature : "jA0EAwMCv7RRTaNA6TNgyStYodg5mQsgJsKv5PR0ZtQxPvsoOv6f0duXiVhrHc39ag3pqjeD3t+OKIPd"
			};
			
			
			sphinx.params = {
				datCountryIndicator : "DE",
				locale : "de_DE",
				action : "changeDossier",
				dossierid : "49518",
				
				//type : "<%dossierType%>",
				//vxs : " ",
				
				page : "model selection",
				workflow : "true",
				save : "true"
			};

			sphinx.onLoginFailure = function ( response ) {
				alert( 'DAT login failed!\nReason: ' + response.message );
			};
			sphinx.onFinished = function () {
				sphinx.exportDossier();
			};
			sphinx.afterExportDossier = function () {
				$( '#vxsResult' ).val( sphinx.response.xml );
				sphinx.logout();
			};
		